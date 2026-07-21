export interface IngestKnowledgeDto {
  projectId: string;
  title: string;
  content: string;
  category?: string;
}

export class IngestKnowledgeCommand {
  constructor(public readonly dto: IngestKnowledgeDto) {}
}
