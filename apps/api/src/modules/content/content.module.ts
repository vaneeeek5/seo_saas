import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ContentController } from './content.controller';
import { GenerateArticleHandler } from './commands/handlers/generate-article.handler';

@Module({
  imports: [CqrsModule],
  controllers: [ContentController],
  providers: [GenerateArticleHandler],
})
export class ContentModule {}
