import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { OrganizationController } from './organization.controller';
import { CreateOrganizationHandler } from './commands/handlers/create-organization.handler';

@Module({
  imports: [CqrsModule],
  controllers: [OrganizationController],
  providers: [CreateOrganizationHandler],
})
export class OrganizationModule {}
