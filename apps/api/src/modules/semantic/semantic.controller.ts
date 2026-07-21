import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CollectSemanticDto } from '@seo-saas/shared';
import { CollectSemanticCommand } from './commands/collect-semantic.command';

@Controller('semantics')
export class SemanticController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('collect')
  @HttpCode(HttpStatus.ACCEPTED)
  async collectSemantics(@Body() dto: CollectSemanticDto) {
    // Only accepts DTO and sends Command to Bus (Queue First + CQRS)
    return await this.commandBus.execute(new CollectSemanticCommand(dto));
  }
}
