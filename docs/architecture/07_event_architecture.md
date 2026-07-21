ГЛАВА 7

ГЛАВА 7
EVENT ARCHITECTURE SPECIFICATION
Version: 1.0
Status: Approved

7.1 Назначение
Взаимодействие между модулями платформы осуществляется исключительно через доменные события (Domain Events).
Событие отражает факт, который уже произошёл.
Например:
	•	проект создан;
	•	сайт подключён;
	•	обход завершён;
	•	семантика собрана;
	•	статья сгенерирована;
	•	публикация завершена.
События являются основным механизмом взаимодействия между независимыми модулями платформы.

7.2 Общие правила
Каждое событие обязано соответствовать следующим требованиям.
EVT-001
Event Immutable
После публикации событие никогда не изменяется.

EVT-002
Past Tense
Название события всегда описывает завершившееся действие.
Правильно
ProjectCreated
WebsiteConnected
SemanticCollected
ArticleGenerated
PublicationCompleted

Неправильно
CreateProject
GenerateArticle
Publish

Команды и события — разные сущности.

EVT-003
Versioned
Каждое событие имеет собственную версию.
Например
ArticleGenerated

version: 1

В дальнейшем
version: 2

без нарушения совместимости.

EVT-004
Idempotent
Повторная обработка события не должна менять итоговый результат.
Если событие пришло дважды, система должна корректно его обработать.

EVT-005
Traceable
Каждое событие содержит идентификаторы трассировки.
Обязательные поля:
eventId
correlationId
causationId
projectId
occurredAt
version


7.3 Базовая структура события
Все события используют единый контракт.
Event:
  eventId: UUID
  eventType: string
  version: integer

  occurredAt: datetime

  projectId: UUID

  correlationId: UUID

  causationId: UUID

  producer: string

  payload: object


7.4 Жизненный цикл проекта
Полный жизненный цикл проекта выглядит следующим образом.
ProjectCreated

↓

WebsiteConnected

↓

WebsiteValidated

↓

WebsiteCrawled

↓

SemanticCollectionStarted

↓

SemanticCollected

↓

ClustersBuilt

↓

KnowledgeGraphBuilt

↓

ContentPlanCreated

↓

ContentGenerationStarted

↓

ContentGenerated

↓

MediaGenerated

↓

PublicationCompleted

↓

AnalyticsUpdated

↓

OptimizationCompleted

Это основной Event Flow платформы.

7.5 Каталог событий
Все события разделены по доменам.

Projects
ProjectCreated
Издатель
Projects
Подписчики
	•	Website Engine
	•	Analytics
Payload
projectId
organizationId
domain
language
cms


ProjectUpdated
Издатель
Projects
Подписчики
Analytics

ProjectArchived
Издатель
Projects
Подписчики
Все модули

Website Engine

WebsiteConnected
Издатель
Website Engine
Подписчики
Semantic Engine
Analytics

WebsiteValidated
Payload
cms
robots
sitemap
status


WebsiteCrawled
Payload
pagesCount
internalLinks
errors
crawlDuration

Подписчики
Semantic Engine

Semantic Engine

SemanticCollectionStarted

SemanticCollected
Payload
keywords

frequency

language

region


ClustersBuilt
Payload
clustersCount

topicsCount


KnowledgeGraphBuilt
Payload
nodes

edges

coverage

Подписчики
Planning Engine

Planning Engine

ContentPlanCreated
Payload
topics

priority

estimatedArticles

Подписчики
Content Engine

Content Engine

ArticleGenerationStarted

OutlineGenerated

DraftGenerated

ArticleGenerated
Payload
articleId

assetId

words

readingTime


HumanizerCompleted

SeoOptimizationCompleted

ContentApproved

Media Engine

ImageGenerationStarted

ImagesGenerated
Payload
count

provider

duration


OgImageGenerated

AltGenerated

Publisher

PublicationScheduled

PublicationStarted

PublicationCompleted
Payload
publicationId

url

cms

publishedAt


PublicationFailed
Payload
reason

retryable


Analytics

IndexingDetected

PositionsUpdated

TrafficUpdated

CTRUpdated

ConversionUpdated

AI

PromptBuilt

ContextPrepared

ModelSelected

CompletionGenerated

ValidationPassed

ValidationFailed

Tasks

TaskCreated

TaskQueued

TaskStarted

TaskProgressChanged

TaskCompleted

TaskFailed

TaskCancelled

Notifications

NotificationCreated

NotificationSent

NotificationRead

7.6 Event Naming Standard
Каждое событие должно называться по единому правилу.
<Entity><PastVerb>

Примеры
ArticleGenerated

ProjectCreated

ImagesGenerated

PublicationCompleted

AnalyticsUpdated

Запрещено
GenerateArticle

CreateProject

DoPublish


7.7 Event Versioning
Каждое изменение структуры события приводит к увеличению версии.
Например
ArticleGenerated v1

↓
ArticleGenerated v2

При этом старые обработчики продолжают работать.

7.8 Event Storage
Все опубликованные события записываются в коллекцию
events

Структура документа
eventId

eventType

version

projectId

producer

payload

occurredAt

processedAt

status

События являются неизменяемыми.
Редактирование запрещено.

7.9 Event Processing Guarantees
Для всех событий платформы устанавливаются следующие гарантии:
Правило
Требование
Delivery
At Least Once
Ordering
Within Aggregate (Project)
Retry
Exponential Backoff
Dead Letter Queue
Да
Idempotency
Обязательно
Timeout
Настраивается для каждого обработчика
Versioning
Обязательно
Correlation ID
Обязательно
Audit Log
Обязательно

Итог главы
После утверждения этой главы все взаимодействие между модулями платформы должно строиться только через описанные события и их контракты. Любое новое событие должно быть зарегистрировано в каталоге событий, получить уникальный идентификатор, версию и описание издателей, подписчиков и структуры данных.