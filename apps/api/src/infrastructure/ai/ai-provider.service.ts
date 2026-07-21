import { Injectable, Logger } from '@nestjs/common';

export interface GeneratedArticleResult {
  title: string;
  outline: string[];
  body: string;
  metaTitle: string;
  metaDescription: string;
  wordCount: number;
}

@Injectable()
export class AiProviderService {
  private readonly logger = new Logger(AiProviderService.name);

  async generateOutline(topic: string, primaryKeyword: string): Promise<string[]> {
    this.logger.log(`[AI Provider] Generating outline for topic: "${topic}"...`);
    return [
      `Introduction to ${primaryKeyword}`,
      `Why ${primaryKeyword} Matters in 2026`,
      `Key Benefits and Features`,
      `Step-by-Step Implementation Guide`,
      `Conclusion & Next Steps`,
    ];
  }

  async generateArticleContent(
    topic: string,
    primaryKeyword: string,
    secondaryKeywords: string[] = [],
    contextKnowledge: string = ''
  ): Promise<GeneratedArticleResult> {
    this.logger.log(`[AI Provider] Generating full article body for: "${topic}"...`);

    const outline = await this.generateOutline(topic, primaryKeyword);

    const body = `
# ${topic}

## Introduction to ${primaryKeyword}
In today's fast-evolving digital ecosystem, understanding **${primaryKeyword}** is essential for sustainable growth. ${contextKnowledge}

## Why ${primaryKeyword} Matters in 2026
Automating workflow processes reduces execution time from days to minutes while keeping quality exceptionally high.

## Key Benefits and Features
- High Scalability: Produce structured SEO assets effortlessly.
- Data-Driven Precision: Targeted cluster analysis and automated keyword integration.
${secondaryKeywords.map((kw) => `- Strategic inclusion of key topic: ${kw}`).join('\n')}

## Step-by-Step Implementation Guide
1. Define project goals and target audience.
2. Collect semantic keyword clusters.
3. Automatically generate structured content assets.
4. Publish directly to your connected CMS.

## Conclusion & Next Steps
By leveraging automated AI workflows, teams can focus on strategic positioning while scaling organic presence rapidly.
    `.trim();

    return {
      title: topic,
      outline,
      body,
      metaTitle: `${topic} | Complete 2026 Guide`,
      metaDescription: `Discover how to master ${primaryKeyword} with our comprehensive 2026 guide and step-by-step implementation.`,
      wordCount: body.split(/\s+/).length,
    };
  }
}
