import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { GenerateArticleDto } from '@seo-saas/shared';
import { GenerateArticleCommand } from './commands/generate-article.command';

@Controller('content')
export class ContentController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('articles/generate')
  @HttpCode(HttpStatus.ACCEPTED)
  async generateArticle(@Body() dto: GenerateArticleDto) {
    return await this.commandBus.execute(new GenerateArticleCommand(dto));
  }
}
