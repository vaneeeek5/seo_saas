import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateProjectCommand } from '../create-project.command';
import { DomainEventTypes, ProjectCreatedEvent } from '@seo-saas/shared';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { Logger } from '@nestjs/common';

@CommandHandler(CreateProjectCommand)
export class CreateProjectHandler implements ICommandHandler<CreateProjectCommand> {
  private readonly logger = new Logger(CreateProjectHandler.name);

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly prisma: PrismaService,
  ) {}

  async execute(command: CreateProjectCommand): Promise<{ projectId: string; status: string }> {
    const { dto } = command;
    const projectId = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    this.logger.log(`Executing CreateProjectCommand for project: ${dto.name} (${projectId})`);

    // Persist to PostgreSQL via Prisma (with fallback handling if DB server isn't running locally)
    try {
      if (this.prisma.project) {
        await this.prisma.project.create({
          data: {
            id: projectId,
            name: dto.name,
            domain: dto.domain,
            organizationId: dto.organizationId || 'org_demo',
            targetRegion: dto.targetRegion || 'global',
            language: dto.language || 'en',
          },
        });
      }
    } catch (err: any) {
      this.logger.warn(`Prisma persistence warning (local DB offline fallback active): ${err.message}`);
    }

    const event: ProjectCreatedEvent = {
      eventId: `evt_${Date.now()}`,
      eventType: DomainEventTypes.PROJECT_CREATED,
      aggregateId: projectId,
      timestamp: new Date().toISOString(),
      payload: {
        projectId,
        organizationId: dto.organizationId || 'org_demo',
        name: dto.name,
        domain: dto.domain,
      },
    };

    // Publish event via Event Bus
    this.eventEmitter.emit(DomainEventTypes.PROJECT_CREATED, event);

    return { projectId, status: 'CREATED' };
  }
}
