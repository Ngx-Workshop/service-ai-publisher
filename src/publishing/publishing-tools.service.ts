import { DraftRepository } from './draft.repository';
import { WorkshopPreparationService } from './workshop-preparation.service';
import { Injectable, Logger, Optional } from '@nestjs/common';
import { McpServer, CallToolResult } from '@modelcontextprotocol/server';
import { z } from 'zod';
import { GenerationError } from './generation-error';
import { DraftAgentService } from './draft-agent.service';
import { PublisherIdentity, PublishingOwnerClient } from './owner.client';
import { PublishingRunService } from './publishing-run.service';
import {
  publishingDefinitions,
  imageInputSchema,
  workshopDraftSchema,
} from './publishing.schemas';
@Injectable()
export class PublishingToolsService {
  private readonly logger = new Logger(PublishingToolsService.name);
  constructor(
    private readonly owner: PublishingOwnerClient,
    private readonly agent: DraftAgentService,
    private readonly runs: PublishingRunService,
    private readonly preparations?: WorkshopPreparationService,
    @Optional() private readonly drafts?: DraftRepository
  ) {}
  async invoke(
    name: string,
    input: unknown,
    identity: PublisherIdentity
  ): Promise<CallToolResult> {
    try {
      if (!Object.hasOwn(publishingDefinitions, name))
        throw new Error('Unknown publishing tool');
      const definition =
        publishingDefinitions[name as keyof typeof publishingDefinitions];
      const value = definition.inputSchema.parse(input);
      let data: unknown;
      switch (name) {
        case 'list_workshop_drafts':
          data = await this.drafts!.list(
            identity.subject,
            (value as { before?: string }).before
          );
          break;
        case 'get_workshop_draft':
          data = await this.drafts!.get(
            (value as { draftId: string }).draftId,
            identity.subject
          );
          break;
        case 'save_workshop_draft': {
          const save = value as {
            draftId: string;
            version: number;
            json: string;
          };
          data = await this.drafts!.save(
            save.draftId,
            identity.subject,
            save.version,
            save.json
          );
          break;
        }
        case 'get_workshop_repair_options':
          if (!this.preparations) throw new Error('Preparation is unavailable');
          await this.preparations.stored(
            (value as { preparationId: string }).preparationId,
            identity
          );
          data = this.preparations.repairOptions(
            (value as { preparationId: string }).preparationId,
            identity
          );
          break;
        case 'start_workshop_preparation':
          if (!this.preparations) throw new Error('Preparation is unavailable');
          data = await this.preparations.startDurable(value, identity);
          break;
        case 'get_workshop_preparation':
          if (!this.preparations) throw new Error('Preparation is unavailable');
          data = await this.preparations.stored(
            (value as { preparationId: string }).preparationId,
            identity
          );
          break;
        case 'list_publishing_models':
          data = this.agent.models();
          break;
        case 'list_publishing_runs':
          data = await this.runs.list(identity);
          break;
        case 'generate_workshop_draft': {
          // Legacy strict clients predate learningPlan. The preparation tools carry it.
          const draft = { ...(await this.agent.generate(value, identity)) };
          delete draft.learningPlan;
          data = draft;
          break;
        }
        case 'validate_workshop_draft':
          data = workshopDraftSchema.parse((value as { draft: unknown }).draft);
          break;
        case 'publish_workshop': {
          const publish = value as {
            requestId: string;
            preparationId?: string;
            draft: import('./publishing.schemas').WorkshopDraft;
          };
          // Recorded requests retain idempotent receipt/recovery behavior even after preparation expires.
          const existing = publish.preparationId
            ? await this.runs.find(publish.requestId, identity)
            : undefined;
          if (publish.preparationId && !existing) {
            if (!this.preparations)
              throw new Error('Preparation is unavailable');
            await this.drafts?.assertCurrent(
              publish.preparationId,
              identity.subject
            );
            await this.preparations.stored(publish.preparationId, identity);
            this.preparations.assertReady(
              publish.preparationId,
              publish.draft,
              identity
            );
          }
          const checked =
            publish.preparationId && !existing
              ? this.preparations!.get(publish.preparationId, identity)
              : undefined;
          const evidence = checked ? { ...checked } : undefined;
          if (evidence) delete evidence.draft;
          const receipt = await this.runs.publish(value, identity, evidence);
          if (receipt.status === 'complete' && publish.preparationId)
            await this.drafts?.published(
              publish.preparationId,
              identity.subject,
              publish.requestId
            );
          data = receipt;
          break;
        }
        case 'get_publishing_run':
          data = await this.runs.get(
            (value as { requestId: string }).requestId,
            identity
          );
          break;
        case 'manage_document':
          data = await this.owner.document(value, identity);
          break;
        case 'manage_assessment':
          data = await this.owner.assessment(value, identity);
          break;
        case 'manage_coding_lab':
          data = await this.owner.lab(value, identity);
          break;
        case 'workshop_image': {
          const image = imageInputSchema.parse(value);
          data =
            image.operation === 'generate'
              ? await this.agent.image(image, identity)
              : await this.owner.image(image, identity);
          break;
        }
      }
      const structuredContent = { data };
      return {
        structuredContent,
        content: [{ type: 'text', text: JSON.stringify(structuredContent) }],
      };
    } catch (error) {
      if (error instanceof GenerationError)
        this.logger.warn(
          `Draft generation failed: ${error.code}${error.fields.length ? `; fields: ${error.fields.join(', ')}` : ''}`
        );
      const message =
        error instanceof GenerationError
          ? error.message
          : error instanceof z.ZodError
            ? `Invalid publishing input: ${error.issues
                .map((i) => i.path.join('.') || 'draft')
                .slice(0, 8)
                .join(', ')}`
            : 'Publishing request failed. Check owner access, server configuration, or the publishing receipt.';
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error: {
                code:
                  error instanceof GenerationError
                    ? error.code
                    : 'PUBLISHING_FAILED',
                message,
              },
            }),
          },
        ],
      };
    }
  }
  createServer(identity: PublisherIdentity) {
    const server = new McpServer({
      name: 'ngx-workshop-publishing',
      version: '0.1.0',
    });
    for (const [name, definition] of Object.entries(publishingDefinitions))
      server.registerTool(name, definition, (input) =>
        this.invoke(name, input, identity)
      );
    return server;
  }
}
