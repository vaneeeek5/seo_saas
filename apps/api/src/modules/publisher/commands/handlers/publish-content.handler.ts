import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PublishContentCommand } from '../publish-content.command';
import { DomainEventTypes } from '@seo-saas/shared';
import { Logger } from '@nestjs/common';

@CommandHandler(PublishContentCommand)
export class PublishContentHandler implements ICommandHandler<PublishContentCommand> {
  private readonly logger = new Logger(PublishContentHandler.name);

  constructor(private readonly eventEmitter: EventEmitter2) {}

  async execute(command: PublishContentCommand): Promise<{ publicationId: string; externalUrl: string; status: string }> {
    const { dto } = command;
    const publicationId = `pub_${Date.now()}`;
    const externalUrl = dto.targetCmsUrl ? `${dto.targetCmsUrl}/blog/${dto.contentAssetId}` : `https://example-cms.com/posts/${dto.contentAssetId}`;

    this.logger.log(`[Publisher Engine] Publishing contentAsset ${dto.contentAssetId} to CMS... (${publicationId})`);

    // Emit event via Event Bus
    this.eventEmitter.emit(DomainEventTypes.PUBLICATION_COMPLETED, {
      eventId: `evt_${Date.now()}`,
      eventType: DomainEventTypes.PUBLICATION_COMPLETED,
      aggregateId: publicationId,
      timestamp: new Date().toISOString(),
      payload: {
        publicationId,
        projectId: dto.projectId,
        contentAssetId: dto.contentAssetId,
        externalUrl,
      },
    });

    return { publicationId, externalUrl, status: 'PUBLISHED' };
  }
}
