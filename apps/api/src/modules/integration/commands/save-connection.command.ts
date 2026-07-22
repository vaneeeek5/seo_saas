export interface SaveConnectionDto {
  projectId: string;
  provider: 'OPENAI' | 'GEMINI' | 'ANTHROPIC' | 'WORDSTAT' | 'AHREFS' | 'WORDPRESS_CMS' | 'CUSTOM_WEBHOOK';
  name: string;
  apiKey: string;
  config?: Record<string, any>;
}

export class SaveConnectionCommand {
  constructor(public readonly dto: SaveConnectionDto) {}
}
