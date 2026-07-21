export interface PublishContentDto {
  projectId: string;
  contentAssetId: string;
  targetCmsUrl?: string;
  cmsType?: string;
}

export class PublishContentCommand {
  constructor(public readonly dto: PublishContentDto) {}
}
