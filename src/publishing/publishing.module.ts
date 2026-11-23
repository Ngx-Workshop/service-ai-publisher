import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthClientService } from '@tmdjr/ngx-auth-client';
import { PUBLISHER_CONFIG, loadPublisherConfig } from '../publisher.config';
import { DraftRepository } from './draft.repository';
import { PublishingController } from './publishing.controller';
import { PublishingOwnerClient } from './owner.client';
import { PublishingRunService } from './publishing-run.service';
import { PublishingToolsService } from './publishing-tools.service';
import { DraftAgentService } from './draft-agent.service';
import { WorkshopPreparationService } from './workshop-preparation.service';

@Module({
  imports: [HttpModule],
  controllers: [PublishingController],
  providers: [
    DraftRepository,
    AuthClientService,
    PublishingOwnerClient,
    PublishingRunService,
    PublishingToolsService,
    DraftAgentService,
    WorkshopPreparationService,
    {
      provide: PUBLISHER_CONFIG,
      useFactory: () => loadPublisherConfig(process.env),
    },
  ],
})
export class PublishingModule {}
