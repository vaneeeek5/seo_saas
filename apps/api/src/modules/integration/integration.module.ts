import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { IntegrationController } from './integration.controller';
import { SaveConnectionHandler } from './commands/handlers/save-connection.handler';

@Module({
  imports: [CqrsModule],
  controllers: [IntegrationController],
  providers: [SaveConnectionHandler],
})
export class IntegrationModule {}
