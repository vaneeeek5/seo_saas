import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PublisherController } from './publisher.controller';
import { PublishContentHandler } from './commands/handlers/publish-content.handler';

@Module({
  imports: [CqrsModule],
  controllers: [PublisherController],
  providers: [PublishContentHandler],
})
export class PublisherModule {}
