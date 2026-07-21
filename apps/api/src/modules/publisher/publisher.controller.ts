import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { PublishContentCommand, PublishContentDto } from './commands/publish-content.command';

@Controller('publishers')
export class PublisherController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('publish')
  @HttpCode(HttpStatus.OK)
  async publishContent(@Body() dto: PublishContentDto) {
    return await this.commandBus.execute(new PublishContentCommand(dto));
  }
}
