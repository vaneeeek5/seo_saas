import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateProjectDto } from '@seo-saas/shared';
import { CreateProjectCommand } from './commands/create-project.command';

@Controller('projects')
export class ProjectController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProject(@Body() dto: CreateProjectDto) {
    // Controller ONLY validates & sends command to Command Bus (CQRS Rule)
    return await this.commandBus.execute(new CreateProjectCommand(dto));
  }
}
