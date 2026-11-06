import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PUBLISHER_CONFIG, PublisherConfig } from './publisher.config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  const config = app.get<PublisherConfig>(PUBLISHER_CONFIG);
  app.enableShutdownHooks();
  await app.listen(config.port, '0.0.0.0');
}
void bootstrap();
