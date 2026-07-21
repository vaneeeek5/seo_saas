import * as fs from 'fs';
import * as path from 'path';

const API_MODULES_DIR = path.join(__dirname, '../apps/api/src/modules');

console.log('--------------------------------------------------');
console.log('🤖 [Agent-Critic] Starting Architectural Audit...');
console.log('--------------------------------------------------');

let totalViolations = 0;

function auditControllers(dir: string) {
  const files = fs.readdirSync(dir, { recursive: true }) as string[];
  const controllerFiles = files.filter(f => f.endsWith('.controller.ts'));

  controllerFiles.forEach(relPath => {
    const fullPath = path.join(dir, relPath);
    const content = fs.readFileSync(fullPath, 'utf-8');

    console.log(`\n🔍 Auditing Controller: ${relPath}`);

    // Check 1: Controller must import CommandBus, QueryBus or return Stream
    if (!content.includes('CommandBus') && !content.includes('QueryBus') && !content.includes('Sse') && !content.includes('Stream')) {
      console.error(`  ❌ [Rule Violation] Controller does not use CommandBus, QueryBus or Stream for CQRS isolation.`);
      totalViolations++;
    } else {
      console.log(`  ✅ [Rule Check] CQRS CommandBus or SSE Stream present.`);
    }

    // Check 2: Controller must not contain direct Prisma / DB Repository access
    if (content.includes('prisma') || content.includes('repository') || content.includes('Repository')) {
      console.error(`  ❌ [Rule Violation] Direct Database access detected in HTTP Controller! Business logic must reside in Command Handler.`);
      totalViolations++;
    } else {
      console.log(`  ✅ [Rule Check] Zero direct DB access inside Controller.`);
    }

    // Check 3: Controller must not make direct LLM or HTTP calls
    if (content.includes('openai') || content.includes('anthropic') || content.includes('fetch(')) {
      console.error(`  ❌ [Rule Violation] Synchronous AI call detected! All heavy operations must go to BullMQ queue.`);
      totalViolations++;
    } else {
      console.log(`  ✅ [Rule Check] Queue First compliance verified.`);
    }
  });
}

if (fs.existsSync(API_MODULES_DIR)) {
  auditControllers(API_MODULES_DIR);
} else {
  console.error(`Error: Directory ${API_MODULES_DIR} not found.`);
  process.exit(1);
}

console.log('\n--------------------------------------------------');
if (totalViolations === 0) {
  console.log('🎉 [Agent-Critic Audit PASSED] All controllers comply with CQRS, DDD & Queue First!');
  console.log('--------------------------------------------------');
  process.exit(0);
} else {
  console.error(`💥 [Agent-Critic Audit FAILED] Found ${totalViolations} architectural violation(s).`);
  console.log('--------------------------------------------------');
  process.exit(1);
}
