import {
  publishingDefinitions,
  publishingContractSchemas,
} from './publishing/publishing.schemas';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'node:fs';
import { z } from 'zod';
import { AppModule } from './app.module';

async function generate() {
  // Generation has no network/database effects and uses explicit placeholder configuration.
  process.env.PUBLISHING_ENABLED = 'false';
  process.env.NODE_ENV = 'development';
  process.env.DOCUMENT_BASE_URL ??= 'http://127.0.0.1:4001';
  process.env.CODING_LABS_BASE_URL ??= 'http://127.0.0.1:4002';
  const app = await NestFactory.create(AppModule, {
    logger: false,
    bodyParser: false,
  });
  try {
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('NGX Workshop AI publisher contracts')
        .setDescription(
          'Administrator MCP runs at /mcp/publishing; browser tools at /publisher/tools. Components describe tool arguments/results; there are no REST CRUD endpoints. See mcp-tools.json for protocol tool definitions.'
        )
        .setVersion('0.1.0')
        .build()
    );
    const schemas = Object.fromEntries(
      Object.entries({ ...publishingContractSchemas }).map(([name, schema]) => [
        name,
        z.toJSONSchema(schema, { target: 'openapi-3.0', io: 'input' }),
      ])
    );
    const artifact = {
      name: 'ngx-workshop-publisher',
      version: '0.1.0',
      publishing: {
        endpoint: '/mcp/publishing',
        authentication: 'platform administrator bearer',
        tools: Object.entries(publishingDefinitions).map(([name, d]) => ({
          name,
          description: d.description,
          annotations: d.annotations,
          inputSchema: z.toJSONSchema(d.inputSchema, { io: 'input' }),
          outputSchema: z.toJSONSchema(d.outputSchema),
        })),
      },
    };
    writeFileSync(
      'openapi.json',
      JSON.stringify(
        {
          ...document,
          components: {
            ...document.components,
            schemas: { ...document.components?.schemas, ...schemas },
          },
        },
        null,
        2
      ) + '\n'
    );
    writeFileSync('mcp-tools.json', JSON.stringify(artifact, null, 2) + '\n');
  } finally {
    await app.close();
  }
}
void generate().catch((error: unknown) => {
  console.error(
    error instanceof Error ? error.message : 'Contract generation failed'
  );
  process.exitCode = 1;
});
