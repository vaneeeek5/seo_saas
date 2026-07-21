import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  // Configure OpenAPI Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('SEO Content Factory OS API')
    .setDescription('Multi-Agent Autonomous SaaS Platform Architecture (CQRS + DDD + Event-Driven)')
    .setVersion('1.0')
    .addTag('projects', 'Project Management Bounded Context')
    .addTag('semantics', 'Semantic Collection & Clustering Engine')
    .addTag('content', 'Multi-Stage AI Content Generation Engine')
    .addTag('knowledge', 'RAG Brand Knowledge Store Engine')
    .addTag('decision', 'Autonomous SEO Decision Engine')
    .addTag('publishers', 'CMS Auto-Publishing Engine')
    .addTag('analytics', 'Organic Search Analytics Engine')
    .addTag('health', 'System Health & Resource Monitoring')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`SEO Content Factory API running on port ${port}`);
  logger.log(`OpenAPI Swagger documentation available at http://localhost:${port}/api/docs`);
}
bootstrap();
