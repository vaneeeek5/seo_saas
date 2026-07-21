import { CreateProjectDto } from '@seo-saas/shared';

export class CreateProjectCommand {
  constructor(public readonly dto: CreateProjectDto) {}
}
