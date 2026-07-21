import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DecisionController } from './decision.controller';
import { EvaluateProjectNextStepHandler } from './commands/handlers/evaluate-project-next-step.handler';

@Module({
  imports: [CqrsModule],
  controllers: [DecisionController],
  providers: [EvaluateProjectNextStepHandler],
})
export class DecisionModule {}
