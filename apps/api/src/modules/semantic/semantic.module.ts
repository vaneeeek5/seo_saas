import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SemanticController } from './semantic.controller';
import { CollectSemanticHandler } from './commands/handlers/collect-semantic.handler';

@Module({
  imports: [CqrsModule],
  controllers: [SemanticController],
  providers: [CollectSemanticHandler],
})
export class SemanticModule {}
