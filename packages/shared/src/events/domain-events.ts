export interface BaseDomainEvent {
  eventId: string;
  eventType: string;
  aggregateId: string;
  timestamp: string;
  payload: Record<string, any>;
}

export const DomainEventTypes = {
  PROJECT_CREATED: 'project.created',
  WEBSITE_CONNECTED: 'website.connected',
  SEMANTIC_COLLECTION_STARTED: 'semantic.collection.started',
  SEMANTIC_READY: 'semantic.ready',
  CLUSTERS_READY: 'semantic.clusters.ready',
  CONTENT_PLAN_GENERATED: 'content.plan.generated',
  ARTICLE_GENERATION_STARTED: 'content.article.generation.started',
  ARTICLE_GENERATED: 'content.article.generated',
  PUBLICATION_COMPLETED: 'publication.completed',
  TASK_STATUS_CHANGED: 'task.status.changed'
} as const;

export interface ProjectCreatedEvent extends BaseDomainEvent {
  eventType: typeof DomainEventTypes.PROJECT_CREATED;
  payload: {
    projectId: string;
    organizationId: string;
    name: string;
    domain: string;
  };
}

export interface TaskStatusChangedEvent extends BaseDomainEvent {
  eventType: typeof DomainEventTypes.TASK_STATUS_CHANGED;
  payload: {
    taskId: string;
    projectId: string;
    taskType: string;
    status: string;
    progress: number;
    message?: string;
    error?: string;
  };
}

export interface SemanticReadyEvent extends BaseDomainEvent {
  eventType: typeof DomainEventTypes.SEMANTIC_READY;
  payload: {
    projectId: string;
    keywordCount: number;
  };
}

export interface ArticleGeneratedEvent extends BaseDomainEvent {
  eventType: typeof DomainEventTypes.ARTICLE_GENERATED;
  payload: {
    articleId: string;
    projectId: string;
    title: string;
    slug: string;
  };
}
