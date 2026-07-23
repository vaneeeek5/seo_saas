export interface SaveConnectionDto {
  projectId: string;
  provider:
    | 'OPENAI'
    | 'GEMINI'
    | 'ANTHROPIC'
    | 'WORDSTAT'
    | 'YANDEX_WORDSTAT'
    | 'METRIKA'
    | 'AHREFS'
    | 'WORDPRESS_CMS'
    | 'CUSTOM_WEBHOOK'
    | 'WEBHOOK'
    | 'GSC'
    | 'TELEGRAM';
  name: string;
  apiKey: string;
  config?: Record<string, any>;
}

export class SaveConnectionCommand {
  constructor(public readonly dto: SaveConnectionDto) {}
}
