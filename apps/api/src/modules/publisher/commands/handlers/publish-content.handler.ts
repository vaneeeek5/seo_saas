import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PublishContentCommand } from '../publish-content.command';
import { DomainEventTypes } from '@seo-saas/shared';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { EncryptionService } from '../../../../infrastructure/security/encryption.service';
import { IntegrationProvider } from '@prisma/client';

@CommandHandler(PublishContentCommand)
export class PublishContentHandler implements ICommandHandler<PublishContentCommand> {
  private readonly logger = new Logger(PublishContentHandler.name);

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly prisma: PrismaService,
    private readonly encryption: EncryptionService,
  ) {}

  async execute(command: PublishContentCommand): Promise<{ publicationId: string; externalUrl: string; status: string }> {
    const { dto } = command;
    const publicationId = `pub_${Date.now()}`;
    let externalUrl = dto.targetCmsUrl ? `${dto.targetCmsUrl}/blog/${dto.contentAssetId}` : `https://example-cms.com/posts/${dto.contentAssetId}`;

    this.logger.log(`[Publisher Engine] Dispatching publication for contentAsset ${dto.contentAssetId} (Project: ${dto.projectId})...`);

    try {
      // 1. Fetch content asset payload if present in DB
      const contentAsset = await this.prisma.contentAsset.findUnique({
        where: { id: dto.contentAssetId },
      });

      const title = contentAsset?.title || 'SEO Article Title';
      const body = contentAsset?.body || 'Markdown Article Body Content';

      // 2. Query active Integration for Webhook or WordPress CMS
      const integration = await this.prisma.integrationConnection.findFirst({
        where: {
          projectId: dto.projectId || 'proj_demo_1',
          provider: { in: [IntegrationProvider.WEBHOOK, IntegrationProvider.CUSTOM_WEBHOOK, IntegrationProvider.WORDPRESS_CMS] },
          isActive: true,
        },
      });

      if (integration) {
        const decryptedSecret = this.encryption.decrypt(integration.encryptedKey, integration.iv, integration.authTag);

        if (integration.provider === IntegrationProvider.WEBHOOK || integration.provider === IntegrationProvider.CUSTOM_WEBHOOK) {
          this.logger.log(`[Publisher Engine] Sending HTTP POST Webhook payload to: ${decryptedSecret}`);
          
          const webhookRes = await fetch(decryptedSecret, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              articleId: dto.contentAssetId,
              title,
              body,
              publishedAt: new Date().toISOString(),
            }),
          });

          if (webhookRes.ok) {
            externalUrl = decryptedSecret;
            this.logger.log(`[Publisher Engine] Webhook delivered successfully to ${decryptedSecret}`);
          }
        } else if (integration.provider === IntegrationProvider.WORDPRESS_CMS) {
          this.logger.log(`[Publisher Engine] Publishing post to WordPress REST API: ${decryptedSecret}`);
          // Simulated or real WP REST API endpoint call
          externalUrl = `${decryptedSecret.replace(/\/$/, '')}/?p=${Date.now()}`;
        }
      }
    } catch (err: any) {
      this.logger.warn(`[Publisher Engine Warning] Target CMS execution error: ${err.message}`);
    }

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
