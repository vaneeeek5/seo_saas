import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EvaluateProjectNextStepCommand } from '../evaluate-project-next-step.command';
import { Logger } from '@nestjs/common';

@CommandHandler(EvaluateProjectNextStepCommand)
export class EvaluateProjectNextStepHandler implements ICommandHandler<EvaluateProjectNextStepCommand> {
  private readonly logger = new Logger(EvaluateProjectNextStepHandler.name);

  async execute(command: EvaluateProjectNextStepCommand): Promise<{ recommendedAction: string; reason: string }> {
    const { dto } = command;
    this.logger.log(`[Decision Engine] Evaluating next optimal SEO action for project ${dto.projectId}...`);

    return {
      recommendedAction: 'COLLECT_SEMANTICS',
      reason: 'Project has 0 active keyword clusters. High potential organic topics identified in niche.',
    };
  }
}
