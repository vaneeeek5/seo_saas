import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const orgId = request.headers['x-organization-id'] || request.headers['x-org-id'];

    if (!orgId) {
      // For development/demo convenience, allow fallback org if not explicitly blocked
      request.organizationId = 'org_default';
      return true;
    }

    request.organizationId = orgId;
    return true;
  }
}
