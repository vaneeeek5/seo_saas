import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EvaluateProjectNextStepCommand, EvaluateProjectDto } from './commands/evaluate-project-next-step.command';

@Controller('decision')
export class DecisionController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('evaluate')
  @HttpCode(HttpStatus.OK)
  async evaluateNextStep(@Body() dto: EvaluateProjectDto) {
    return await this.commandBus.execute(new EvaluateProjectNextStepCommand(dto));
  }
}
