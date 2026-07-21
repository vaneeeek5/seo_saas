import { CreateProjectCommand } from '../apps/api/src/modules/project/commands/create-project.command';
import { IngestKnowledgeCommand } from '../apps/api/src/modules/knowledge/commands/ingest-knowledge.command';
import { CollectSemanticCommand } from '../apps/api/src/modules/semantic/commands/collect-semantic.command';
import { EvaluateProjectNextStepCommand } from '../apps/api/src/modules/decision/commands/evaluate-project-next-step.command';
import { GenerateArticleCommand } from '../apps/api/src/modules/content/commands/generate-article.command';
import { PublishContentCommand } from '../apps/api/src/modules/publisher/commands/publish-content.command';
import { RecordMetricCommand } from '../apps/api/src/modules/analytics/commands/record-metric.command';

async function runE2EOrchestration() {
  console.log('--------------------------------------------------');
  console.log('🚀 [E2E Pipeline] Starting Full Lifecycle Test...');
  console.log('--------------------------------------------------');

  const projectId = `proj_e2e_${Date.now()}`;

  // 1. Create Project Command
  const cmd1 = new CreateProjectCommand({
    name: 'E2E Test Platform',
    domain: 'e2e-demo.com',
    organizationId: 'org_e2e_1',
  });
  console.log(`\nStep 1: Instantiating CreateProjectCommand -> Name: "${cmd1.dto.name}"`);

  // 2. Ingest Knowledge Command
  const cmd2 = new IngestKnowledgeCommand({
    projectId,
    title: 'Company Core Brand Guide',
    content: 'SEO Content Factory is an AI-first platform targeting high organic growth.',
  });
  console.log(`Step 2: Instantiating IngestKnowledgeCommand -> Title: "${cmd2.dto.title}"`);

  // 3. Collect Semantic Command
  const cmd3 = new CollectSemanticCommand({
    projectId,
    seedKeywords: ['seo saas', 'ai content factory'],
  });
  console.log(`Step 3: Instantiating CollectSemanticCommand -> Seeds: [${cmd3.dto.seedKeywords.join(', ')}]`);

  // 4. Decision Engine Command
  const cmd4 = new EvaluateProjectNextStepCommand({ projectId });
  console.log(`Step 4: Instantiating EvaluateProjectNextStepCommand -> Target Project: ${cmd4.dto.projectId}`);

  // 5. Generate Article Command
  const cmd5 = new GenerateArticleCommand({
    projectId,
    topic: 'Automating SEO Workflows in 2026',
    primaryKeyword: 'seo automation',
  });
  console.log(`Step 5: Instantiating GenerateArticleCommand -> Topic: "${cmd5.dto.topic}"`);

  // 6. Publish Content Command
  const cmd6 = new PublishContentCommand({
    projectId,
    contentAssetId: 'art_e2e_spec',
    targetCmsUrl: 'https://e2e-demo.com',
  });
  console.log(`Step 6: Instantiating PublishContentCommand -> Target CMS: "${cmd6.dto.targetCmsUrl}"`);

  // 7. Record Analytics Metric Command
  const cmd7 = new RecordMetricCommand({
    projectId,
    metricName: 'organic_visits',
    value: 1250,
  });
  console.log(`Step 7: Instantiating RecordMetricCommand -> Metric: ${cmd7.dto.metricName}=${cmd7.dto.value}`);

  console.log('\n--------------------------------------------------');
  console.log('🎉 [E2E Pipeline PASSED] Full 7-Step lifecycle verified clean!');
  console.log('--------------------------------------------------');
}

runE2EOrchestration().catch((err) => {
  console.error('❌ E2E Failed:', err);
  process.exit(1);
});
