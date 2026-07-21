import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateProjectCommand } from '../create-project.command';
import { DomainEventTypes, ProjectCreatedEvent } from '@seo-saas/shared';
import { Logger } from '@nestjs/common';

@CommandHandler(CreateProjectCommand)
export class CreateProjectHandler implements ICommandHandler<CreateProjectCommand> {
  private readonly logger = new Logger(CreateProjectHandler.name);

  constructor(private readonly eventEmitter: EventEmitter2) {}

  async execute(command: CreateProjectCommand): Promise<{ projectId: string; status: string }> {
    const { dto } = command;
    const projectId = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    this.logger.log(`Executing CreateProjectCommand for project: ${dto.name} (${projectId})`);

    const event: ProjectCreatedEvent = {
      eventId: `evt_${Date.now()}`,
      eventType: DomainEventTypes.PROJECT_CREATED,
      aggregateId: projectId,
      timestamp: new Date().toISOString(),
      payload: {
        projectId,
        organizationId: dto.organizationId,
        name: dto.name,
        domain: dto.domain
      }
    };

    // Publish event via Event Bus
    this.eventEmitter.emit(DomainEventTypes.PROJECT_CREATED, event);

    return { projectId, status: 'CREATED' };
  }
}
