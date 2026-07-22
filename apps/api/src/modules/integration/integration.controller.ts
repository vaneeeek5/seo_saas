import { Controller, Post, Body, HttpCode, HttpStatus, Get, Param } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SaveConnectionCommand, SaveConnectionDto } from './commands/save-connection.command';

@Controller('integrations')
export class IntegrationController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('save')
  @HttpCode(HttpStatus.CREATED)
  async saveConnection(@Body() dto: SaveConnectionDto) {
    return await this.commandBus.execute(new SaveConnectionCommand(dto));
  }

  @Get('list/:projectId')
  async listConnections(@Param('projectId') projectId: string) {
    return [
      {
        id: 'conn_demo_gemini',
        provider: 'GEMINI',
        name: 'Google Gemini 1.5 Flash API Key',
        maskedKey: 'AIza-****-****-9xK2',
        encryption: 'AES-256-GCM',
        isActive: true,
        date: new Date().toISOString(),
      },
      {
        id: 'conn_demo_wp',
        provider: 'WORDPRESS_CMS',
        name: 'Main WordPress Site REST API',
        maskedKey: 'wp_a-****-****-00ff',
        encryption: 'AES-256-GCM',
        isActive: true,
        date: new Date().toISOString(),
      },
    ];
  }
}
