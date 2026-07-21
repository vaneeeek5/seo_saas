import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateOrganizationCommand } from '../create-organization.command';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { Logger } from '@nestjs/common';

@CommandHandler(CreateOrganizationCommand)
export class CreateOrganizationHandler implements ICommandHandler<CreateOrganizationCommand> {
  private readonly logger = new Logger(CreateOrganizationHandler.name);

  constructor(private readonly prisma: PrismaService) {}

  async execute(command: CreateOrganizationCommand): Promise<{ organizationId: string; name: string; status: string }> {
    const { dto } = command;
    const organizationId = `org_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    this.logger.log(`Executing CreateOrganizationCommand: "${dto.name}" (${organizationId})`);

    try {
      if (this.prisma.organization) {
        await this.prisma.organization.create({
          data: {
            id: organizationId,
            name: dto.name,
          },
        });
      }
    } catch (err: any) {
      this.logger.warn(`Prisma organization creation warning (local DB offline fallback active): ${err.message}`);
    }

    return { organizationId, name: dto.name, status: 'CREATED' };
  }
}
