import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateOrganizationCommand, CreateOrganizationDto } from './commands/create-organization.command';

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrganization(@Body() dto: CreateOrganizationDto) {
    return await this.commandBus.execute(new CreateOrganizationCommand(dto));
  }
}
