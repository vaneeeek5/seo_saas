export interface BaseDomainEvent {
    eventId: string;
    eventType: string;
    aggregateId: string;
    timestamp: string;
    payload: Record<string, any>;
}
export declare const DomainEventTypes: {
    readonly PROJECT_CREATED: "project.created";
    readonly WEBSITE_CONNECTED: "website.connected";
    readonly SEMANTIC_COLLECTION_STARTED: "semantic.collection.started";
    readonly SEMANTIC_READY: "semantic.ready";
    readonly CLUSTERS_READY: "semantic.clusters.ready";
    readonly CONTENT_PLAN_GENERATED: "content.plan.generated";
    readonly ARTICLE_GENERATION_STARTED: "content.article.generation.started";
    readonly ARTICLE_GENERATED: "content.article.generated";
    readonly PUBLICATION_COMPLETED: "publication.completed";
    readonly TASK_STATUS_CHANGED: "task.status.changed";
};
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
