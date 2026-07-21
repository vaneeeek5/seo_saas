import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { KnowledgeController } from './knowledge.controller';
import { IngestKnowledgeHandler } from './commands/handlers/ingest-knowledge.handler';

@Module({
  imports: [CqrsModule],
  controllers: [KnowledgeController],
  providers: [IngestKnowledgeHandler],
})
export class KnowledgeModule {}
