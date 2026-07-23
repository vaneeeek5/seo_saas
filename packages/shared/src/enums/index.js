"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentStatus = exports.ProjectStatus = exports.TaskType = exports.TaskStatus = void 0;
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["PENDING"] = "PENDING";
    TaskStatus["QUEUED"] = "QUEUED";
    TaskStatus["PROCESSING"] = "PROCESSING";
    TaskStatus["COMPLETED"] = "COMPLETED";
    TaskStatus["FAILED"] = "FAILED";
    TaskStatus["CANCELLED"] = "CANCELLED";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
var TaskType;
(function (TaskType) {
    TaskType["COLLECT_SEMANTICS"] = "COLLECT_SEMANTICS";
    TaskType["CLUSTERING"] = "CLUSTERING";
    TaskType["GENERATE_CONTENT_PLAN"] = "GENERATE_CONTENT_PLAN";
    TaskType["GENERATE_ARTICLE"] = "GENERATE_ARTICLE";
    TaskType["GENERATE_IMAGE"] = "GENERATE_IMAGE";
    TaskType["PUBLISH_CONTENT"] = "PUBLISH_CONTENT";
    TaskType["ANALYZE_SEO"] = "ANALYZE_SEO";
})(TaskType || (exports.TaskType = TaskType = {}));
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["ACTIVE"] = "ACTIVE";
    ProjectStatus["PAUSED"] = "PAUSED";
    ProjectStatus["ARCHIVED"] = "ARCHIVED";
})(ProjectStatus || (exports.ProjectStatus = ProjectStatus = {}));
var ContentStatus;
(function (ContentStatus) {
    ContentStatus["DRAFT"] = "DRAFT";
    ContentStatus["GENERATING"] = "GENERATING";
    ContentStatus["REVIEW_NEEDED"] = "REVIEW_NEEDED";
    ContentStatus["SCHEDULED"] = "SCHEDULED";
    ContentStatus["PUBLISHED"] = "PUBLISHED";
})(ContentStatus || (exports.ContentStatus = ContentStatus = {}));
//# sourceMappingURL=index.js.map