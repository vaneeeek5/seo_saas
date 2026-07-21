import { CommandBus } from '@nestjs/cqrs';
import { CreateProjectCommand } from './modules/project/commands/create-project.command';
import { CollectSemanticCommand } from './modules/semantic/commands/collect-semantic.command';
import { GenerateArticleCommand } from './modules/content/commands/generate-article.command';

async function runCli() {
  const args = process.argv.slice(2);
  const action = args[0];

  console.log('--------------------------------------------------');
  console.log('🛠 SEO Content Factory Admin CLI');
  console.log('--------------------------------------------------');

  if (!action) {
    console.log('Usage:');
    console.log('  npm run cli project:create -- <name> <domain>');
    console.log('  npm run cli semantic:collect -- <projectId> <keyword>');
    console.log('  npm run cli content:generate -- <projectId> <topic>');
    process.exit(0);
  }

  console.log(`Action requested: ${action}`);
  process.exit(0);
}

runCli();
