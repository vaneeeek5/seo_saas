export interface EvaluateProjectDto {
  projectId: string;
}

export class EvaluateProjectNextStepCommand {
  constructor(public readonly dto: EvaluateProjectDto) {}
}
