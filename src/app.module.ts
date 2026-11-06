import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AuthClientService } from '@tmdjr/ngx-auth-client';
import { PublishingController } from './publishing/publishing.controller';
import { PublishingOwnerClient } from './publishing/owner.client';
import { PublishingRunService } from './publishing/publishing-run.service';
import { PublishingToolsService } from './publishing/publishing-tools.service';
import { DraftAgentService } from './publishing/draft-agent.service';
import { WorkshopPreparationService } from './publishing/workshop-preparation.service';
import { PUBLISHER_CONFIG, loadPublisherConfig } from './publisher.config';
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), HttpModule],
  controllers: [PublishingController],
  providers: [
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
export class AppModule {}
