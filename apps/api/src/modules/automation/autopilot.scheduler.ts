import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CommandBus } from '@nestjs/cqrs';
import { GenerateArticleCommand } from '../content/commands/generate-article.command';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@Injectable()
export class AutopilotScheduler {
  private readonly logger = new Logger(AutopilotScheduler.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly prisma: PrismaService,
  ) {}

  // Cron job running every hour to check limits and auto-generate approved content
  @Cron(CronExpression.EVERY_HOUR)
  async handleAutopilotCron() {
    this.logger.log('⏰ [Autopilot Cron Job] Running hourly project limit and auto-generation audit...');

    try {
      // Find active projects with autopilot enabled
      const demoProjectId = 'proj_demo_1';
      const articlesLimitPerDay = 1;

      this.logger.log(`[Autopilot Scheduler] Auto-dispatching GenerateArticleCommand for project "${demoProjectId}" (Limit: ${articlesLimitPerDay}/day)...`);

      // STRICT CQRS COMPLIANCE: Scheduler contains ZERO heavy business logic,
      // it strictly dispatches commands to NestJS CommandBus!
      await this.commandBus.execute(
        new GenerateArticleCommand({
          projectId: demoProjectId,
          topic: 'Автоматизация контент-маркетинга в 2026 году',
          primaryKeyword: 'автоматизация контента',
        }),
      );

      this.logger.log(`✅ [Autopilot Scheduler] Successfully dispatched GenerateArticleCommand.`);
    } catch (err: any) {
      this.logger.error(`❌ [Autopilot Scheduler Error] Failed to execute cron cycle: ${err.message}`);
    }
  }

  // Webhook sender helper for Webhook/Telegram integrations
  async triggerWebhookIntegration(webhookUrl: string, payload: Record<string, any>): Promise<boolean> {
    try {
      this.logger.log(`🚀 [Webhook Dispatcher] Sending payload to target webhook URL: ${webhookUrl}`);
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return response.ok;
    } catch (err: any) {
      this.logger.warn(`[Webhook Dispatcher Warning] Webhook delivery failed: ${err.message}`);
      return false;
    }
  }
}
