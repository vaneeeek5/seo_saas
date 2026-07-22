import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { BullModule } from '@nestjs/bullmq';
import { SemanticController } from './semantic.controller';
import { CollectSemanticHandler } from './commands/handlers/collect-semantic.handler';
import { SemanticProcessor } from './processors/semantic.processor';
import { YandexWordstatProvider } from './providers/yandex-wordstat.provider';

@Module({
  imports: [
    CqrsModule,
    BullModule.registerQueue({ name: 'semantic-queue' }),
  ],
  controllers: [SemanticController],
  providers: [CollectSemanticHandler, SemanticProcessor, YandexWordstatProvider],
  exports: [YandexWordstatProvider],
})
export class SemanticModule {}
