import { Controller, Post, Body, HttpCode, HttpStatus, Get, Param, Query } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SaveConnectionCommand, SaveConnectionDto } from './commands/save-connection.command';

@Controller('integrations')
export class IntegrationController {
  constructor(private readonly commandBus: CommandBus) {}

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
    return [
      {
        id: 'conn_demo_ai',
        provider: 'OPENAI',
        name: 'LLM AI Provider API',
        maskedKey: 'sk-p-****-****-a9F1',
        encryption: 'AES-256-GCM',
        status: 'CONNECTED',
        isActive: true,
        date: new Date().toISOString(),
      },
      {
        id: 'conn_demo_wp',
        provider: 'WORDPRESS_CMS',
        name: 'WordPress CMS Site API',
        maskedKey: 'wp_a-****-****-00ff',
        encryption: 'AES-256-GCM',
        status: 'CONNECTED',
        isActive: true,
        date: new Date().toISOString(),
      },
      {
        id: 'conn_demo_metrika',
        provider: 'WORDSTAT',
        name: 'Yandex Metrika / Wordstat API',
        maskedKey: 'y0_a-****-****-77c1',
        encryption: 'AES-256-GCM',
        status: 'CONNECTED',
        isActive: true,
        date: new Date().toISOString(),
      },
    ];
  }

  @Get('list/:projectId')
  async listConnections(@Param('projectId') projectId: string) {
    return this.getIntegrations(projectId);
  }
}
