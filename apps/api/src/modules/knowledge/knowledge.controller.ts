import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { IngestKnowledgeCommand, IngestKnowledgeDto } from './commands/ingest-knowledge.command';

@Controller('knowledge')
export class KnowledgeController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('ingest')
  @HttpCode(HttpStatus.CREATED)
  async ingestKnowledge(@Body() dto: IngestKnowledgeDto) {
    return await this.commandBus.execute(new IngestKnowledgeCommand(dto));
  }
}
