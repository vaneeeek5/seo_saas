import { Controller, Post, Body, HttpCode, HttpStatus, Get, Param, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SaveConnectionCommand, SaveConnectionDto } from './commands/save-connection.command';
import { GetIntegrationsQuery } from './queries/get-integrations.query';

@Controller('integrations')
export class IntegrationController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createIntegration(@Body() dto: SaveConnectionDto) {
    return await this.commandBus.execute(new SaveConnectionCommand(dto));
  }

  @Post('save')
  @HttpCode(HttpStatus.CREATED)
  async saveConnection(@Body() dto: SaveConnectionDto) {
    return await this.commandBus.execute(new SaveConnectionCommand(dto));
  }

  @Get()
  async getIntegrations(@Query('projectId') projectId?: string) {
    return await this.queryBus.execute(new GetIntegrationsQuery(projectId));
  }

  @Get('list/:projectId')
  async listConnections(@Param('projectId') projectId: string) {
    return await this.queryBus.execute(new GetIntegrationsQuery(projectId));
  }
}
