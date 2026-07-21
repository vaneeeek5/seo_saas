export interface RecordMetricDto {
  projectId: string;
  metricName: string;
  value: number;
  unit?: string;
}

export class RecordMetricCommand {
  constructor(public readonly dto: RecordMetricDto) {}
}
