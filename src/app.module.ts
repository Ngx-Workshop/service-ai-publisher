import { ObservabilityModule } from './observability/observability.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PublishingModule } from './publishing/publishing.module';
@Module({
  imports: [
    ObservabilityModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PublishingModule,
  ],
})
export class AppModule {}
