import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { IntegrationController } from './integration.controller';
import { SaveConnectionHandler } from './commands/handlers/save-connection.handler';
import { GetIntegrationsHandler } from './queries/handlers/get-integrations.handler';

@Module({
  imports: [CqrsModule],
  controllers: [IntegrationController],
  providers: [SaveConnectionHandler, GetIntegrationsHandler],
})
export class IntegrationModule {}
