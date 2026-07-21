import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IngestKnowledgeCommand } from '../ingest-knowledge.command';
import { Logger } from '@nestjs/common';

@CommandHandler(IngestKnowledgeCommand)
export class IngestKnowledgeHandler implements ICommandHandler<IngestKnowledgeCommand> {
  private readonly logger = new Logger(IngestKnowledgeHandler.name);

  async execute(command: IngestKnowledgeCommand): Promise<{ nodeId: string; status: string }> {
    const { dto } = command;
    const nodeId = `knode_${Date.now()}`;
    
    this.logger.log(`[RAG Engine] Ingesting knowledge node for project ${dto.projectId}: "${dto.title}" (${nodeId})`);

    return { nodeId, status: 'INGESTED' };
  }
}
