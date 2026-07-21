export interface CreateOrganizationDto {
  name: string;
  billingEmail?: string;
}

export class CreateOrganizationCommand {
  constructor(public readonly dto: CreateOrganizationDto) {}
}
