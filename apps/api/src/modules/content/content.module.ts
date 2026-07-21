import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { BullModule } from '@nestjs/bullmq';
import { ContentController } from './content.controller';
import { GenerateArticleHandler } from './commands/handlers/generate-article.handler';
import { ContentProcessor } from './processors/content.processor';

@Module({
  imports: [
    CqrsModule,
    BullModule.registerQueue({ name: 'content-queue' }),
  ],
  controllers: [ContentController],
  providers: [GenerateArticleHandler, ContentProcessor],
})
export class ContentModule {}
