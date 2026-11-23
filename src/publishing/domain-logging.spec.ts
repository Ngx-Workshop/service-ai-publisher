import { Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Test } from '@nestjs/testing';
import { throwError } from 'rxjs';
import { PUBLISHER_CONFIG, loadPublisherConfig } from '../publisher.config';
import { createServiceLogger } from '../observability/observability';
import { PublishingToolsService } from './publishing-tools.service';
import { PublishingOwnerClient } from './owner.client';
import { DraftAgentService } from './draft-agent.service';
import { PublishingRunService } from './publishing-run.service';
import { WorkshopPreparationService } from './workshop-preparation.service';
import { DraftRepository } from './draft.repository';
import { GenerationError } from './generation-error';

describe('Safe publisher domain logging', () => {
  const identity = { subject: 'private-subject', token: 'private-token' };

  it('logs bounded success and failure metadata without input, names or raw errors', async () => {
    const log = jest.spyOn(Logger.prototype, 'log').mockImplementation();
    const warn = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
    const error = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    const assessment = jest
      .fn()
      .mockRejectedValue(new Error('private-owner-body'));
    const module = await Test.createTestingModule({
      providers: [
        PublishingToolsService,
        { provide: PublishingOwnerClient, useValue: { assessment } },
        { provide: DraftAgentService, useValue: {} },
        { provide: PublishingRunService, useValue: {} },
        {
          provide: WorkshopPreparationService,
          useValue: {
            stored: () => Promise.resolve({ status: 'running' }),
          },
        },
        { provide: DraftRepository, useValue: null },
      ],
    }).compile();
    try {
      log.mockClear();
      warn.mockClear();
      error.mockClear();
      const tools = module.get(PublishingToolsService);
      await tools.invoke(
        'list_workshop_drafts',
        { private: 'private-content' },
        identity
      );
      expect(warn).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'publishing_tool',
          outcome: 'failed',
          failure: 'invalid_input',
        })
      );
      await tools.invoke('private-tool-name', {}, identity);
      expect(error).toHaveBeenCalledWith(
        expect.objectContaining({
          tool: 'unknown',
          outcome: 'failed',
        })
      );
      await tools.invoke('manage_assessment', { operation: 'list' }, identity);
      expect(error).toHaveBeenCalledWith(
        expect.objectContaining({
          tool: 'manage_assessment',
          durationMs: expect.any(Number) as unknown,
        })
      );
      assessment.mockResolvedValueOnce({});
      await tools.invoke('manage_assessment', { operation: 'list' }, identity);
      expect(log).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'publishing_tool',
          outcome: 'success',
          tool: 'manage_assessment',
        })
      );
      const calls = JSON.stringify([
        log.mock.calls,
        warn.mock.calls,
        error.mock.calls,
      ]);
      expect(calls).not.toContain('private-');

      const write = jest
        .spyOn(process.stdout, 'write')
        .mockImplementation(() => true);
      try {
        createServiceLogger().warn(
          warn.mock.calls[0][0],
          'PublishingToolsService'
        );
        createServiceLogger().log(
          log.mock.calls[0][0],
          'PublishingToolsService'
        );
        expect(JSON.parse(String(write.mock.calls[0][0]))).toEqual(
          expect.objectContaining({
            level: 'warn',
            context: 'PublishingToolsService',
            message: expect.objectContaining({
              event: 'publishing_tool',
              outcome: 'failed',
            }) as unknown,
          })
        );
        expect(JSON.parse(String(write.mock.calls[1][0]))).toEqual(
          expect.objectContaining({
            level: 'log',
            message: expect.objectContaining({
              event: 'publishing_tool',
              outcome: 'success',
            }) as unknown,
          })
        );
      } finally {
        write.mockRestore();
      }
      log.mockClear();
      await tools.invoke(
        'get_workshop_preparation',
        {
          preparationId: '11111111-1111-4111-8111-111111111111',
        },
        identity
      );
      expect(log).not.toHaveBeenCalled();
      const circular: { self?: unknown } = {};
      circular.self = circular;
      assessment.mockResolvedValueOnce(circular);
      const invalidResponse = await tools.invoke(
        'manage_assessment',
        { operation: 'list' },
        identity
      );
      expect(invalidResponse.isError).toBe(true);
      expect(log).not.toHaveBeenCalled();
    } finally {
      await module.close();
      jest.restoreAllMocks();
    }
  });

  it('logs failed owner boundaries without URLs, credentials or upstream payloads', async () => {
    const warn = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
    const failure = new Error('private-error-with-body');
    const module = await Test.createTestingModule({
      providers: [
        PublishingOwnerClient,
        {
          provide: HttpService,
          useValue: { request: () => throwError(() => failure) },
        },
        {
          provide: PUBLISHER_CONFIG,
          useValue: loadPublisherConfig({
            DOCUMENT_BASE_URL: 'http://localhost:4001',
            CODING_LABS_BASE_URL: 'http://localhost:4002',
          }),
        },
      ],
    }).compile();
    try {
      await expect(
        module
          .get(PublishingOwnerClient)
          .request(
            'document',
            'POST',
            '/private-resource?token=private-query',
            identity,
            { prompt: 'private-content' }
          )
      ).rejects.toBe(failure);
      expect(warn).toHaveBeenCalledTimes(1);
      expect(warn).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'publishing_owner_request',
          owner: 'document',
          method: 'POST',
          outcome: 'failed',
          durationMs: expect.any(Number) as unknown,
        })
      );
      expect(JSON.stringify(warn.mock.calls)).not.toContain('private-');
    } finally {
      await module.close();
      warn.mockRestore();
    }
  });

  it('reports failed asynchronous preparation and terminal storage failure safely', async () => {
    const warn = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
    const error = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    const checkpoint = jest.fn().mockResolvedValue(undefined);
    const module = await Test.createTestingModule({
      providers: [
        WorkshopPreparationService,
        {
          provide: DraftAgentService,
          useValue: {
            models: () => ({ defaultModel: null }),
            generate: () =>
              Promise.reject(
                new GenerationError('MODEL_NOT_CONFIGURED', ['private-field'])
              ),
          },
        },
        { provide: PublishingOwnerClient, useValue: {} },
        { provide: DraftRepository, useValue: { checkpoint } },
      ],
    }).compile();
    try {
      const service = module.get(WorkshopPreparationService);
      const input = {
        operation: 'generate',
        input: {
          sectionId: 'a'.repeat(24),
          brief: 'private-content brief',
          level: 1,
        },
      };
      service.start(input, identity);
      await new Promise<void>((resolve) => setImmediate(resolve));
      expect(warn).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'publishing_preparation',
          outcome: 'failed',
          ready: false,
        })
      );
      checkpoint.mockRejectedValue(new Error('private-storage-credentials'));
      const report = service.start(input, {
        ...identity,
        subject: 'private-other-subject',
      });
      await new Promise<void>((resolve) => setImmediate(resolve));
      expect(error).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'publishing_preparation_checkpoint',
          outcome: 'failed',
          preparationId: report.preparationId,
        })
      );
      expect(JSON.stringify([warn.mock.calls, error.mock.calls])).not.toContain(
        'private-'
      );
    } finally {
      await module.close();
      jest.restoreAllMocks();
    }
  });
});
