import { GenerateArticleDto } from '@seo-saas/shared';

export class GenerateArticleCommand {
  constructor(public readonly dto: GenerateArticleDto) {}
}
