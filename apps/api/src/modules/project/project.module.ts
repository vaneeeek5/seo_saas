import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProjectController } from './project.controller';
import { CreateProjectHandler } from './commands/handlers/create-project.handler';

@Module({
  imports: [CqrsModule],
  controllers: [ProjectController],
  providers: [CreateProjectHandler],
})
export class ProjectModule {}
