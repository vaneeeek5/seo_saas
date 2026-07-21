ГЛАВА 11

ГЛАВА 11
APPLICATION ARCHITECTURE (CQRS + COMMAND BUS)
Version: 1.0
Status: Approved

11.1 Назначение
Все действия внутри платформы выполняются через команды (Commands).
REST API, CLI, AI Agent, Scheduler, Webhooks являются только источниками команд.
Никакая бизнес-логика не должна находиться в HTTP Controller.
Контроллер только:
	•	принимает запрос;
	•	валидирует;
	•	создаёт Command;
	•	отправляет её в Command Bus.

11.2 Общая схема
                   Web UI
                       │
CLI ───────────────────┤
                       │
AI Agent ──────────────┤
                       │
REST API ──────────────┤
                       │
Scheduler ─────────────┘
                       │
               Command Bus
                       │
        ┌──────────────┴──────────────┐
        │                             │
Command Handler              Command Handler
        │                             │
        └──────────────┬──────────────┘
                       │
                 Domain Services
                       │
                 Domain Events
                       │
                    Event Bus
                       │
                Task Engine
                       │
                    Workers


11.3 Основные принципы
APP-001
Everything is Command
Любое действие пользователя — команда.
Например:
CreateProject

ConnectWebsite

CollectSemantic

GeneratePlan

GenerateArticle

GenerateImages

PublishContent

ArchiveProject


APP-002
Read != Write
Чтение и изменение данных разделены.
Используется CQRS.
Write

↓

Commands

↓

Domain

↓

Events

↓

Read Model


APP-003
Commands mutate state
Команда изменяет состояние системы.

APP-004
Queries never mutate state
Query никогда ничего не изменяет.
Она только читает.

11.4 Command Catalog
Projects
CreateProject

UpdateProject

ArchiveProject

RestoreProject


Website
ConnectWebsite

ValidateWebsite

CrawlWebsite

RecrawlWebsite


Semantic
CollectSemantic

NormalizeKeywords

ClusterKeywords

BuildKnowledgeGraph


Planning
GenerateContentPlan

PrioritizeTopics

GenerateStrategy


Content
GenerateOutline

GenerateArticle

HumanizeArticle

ApproveContent

RejectContent


Media
GenerateImages

GenerateOG

GenerateALT


Publisher
PublishContent

SchedulePublication

UpdatePublication

DeletePublication


Analytics
RefreshAnalytics

ImportSearchConsole

ImportGA4

CalculateMetrics


11.5 Command Structure
Все команды используют единый контракт.
Command

commandId

commandType

projectId

userId

payload

createdAt

correlationId

causationId


11.6 Command Handler
Каждая команда имеет единственный обработчик.
GenerateArticle

↓

GenerateArticleHandler

Других обработчиков быть не может.

11.7 Handler Responsibilities
Handler обязан:
	•	проверить права;
	•	проверить бизнес-правила;
	•	вызвать Domain Service;
	•	сохранить изменения;
	•	опубликовать события.
Handler не должен:
	•	обращаться к AI;
	•	публиковать напрямую;
	•	выполнять HTTP;
	•	работать с очередями.

11.8 Domain Services
Domain Service содержит бизнес-логику.
Например
ArticleService

↓

Create Draft

↓

Validate

↓

Save

↓

Publish Event

Именно здесь принимаются решения.

11.9 Repository
Каждый агрегат имеет Repository.
Например
ProjectRepository

ArticleRepository

TopicRepository

KeywordRepository

Repository ничего не знает про HTTP.

11.10 Queries
Queries читают данные.
Например
GetProject

GetProjects

GetKeywords

GetClusters

GetArticles

GetAnalytics

Они не создают события.

11.11 Query Handler
GET /projects

↓

GetProjectsQuery

↓

GetProjectsHandler

↓

Firestore

↓

Response


11.12 Aggregate Roots
Каждый домен имеет Aggregate Root.
Organization

Project

Content Asset

Publication

Task

Все изменения проходят через Aggregate Root.
Запрещено изменять дочерние сущности напрямую.

11.13 Domain Events
После изменения Aggregate публикует события.
Например
CreateProject

↓

Project

↓

ProjectCreated


11.14 Event Flow
Полный цикл выглядит так.
Command

↓

Handler

↓

Domain Service

↓

Repository

↓

Commit

↓

Domain Event

↓

Event Bus

↓

Task Engine

↓

Workers

↓

Read Model Updated


11.15 Read Models
Для быстрого отображения интерфейса используются отдельные модели чтения.
Например
Project Dashboard

Content Dashboard

Analytics Dashboard

Task Dashboard

Они обновляются событиями.

11.16 Business Rules
Все правила находятся внутри домена.
Пример.
Нельзя публиковать контент.
Почему?
Потому что недостаточно прав?
Контент не утверждён?
Нет изображений?
Все эти проверки находятся внутри Domain Service.
Не в Controller.

11.17 Transactions
Все изменения Aggregate являются атомарными.
Если публикация события не удалась — изменения не считаются завершёнными.
Используется Transactional Outbox Pattern.

11.18 Idempotency
Каждая команда должна иметь уникальный commandId.
Повторная отправка одной и той же команды не должна приводить к повторному выполнению.

11.19 Observability
Каждая команда журналируется.
Для неё сохраняются:
	•	commandId;
	•	userId;
	•	projectId;
	•	duration;
	•	handler;
	•	результат;
	•	опубликованные события.

11.20 Запрещено
В архитектуре запрещено:
	•	бизнес-логика в Controller;
	•	SQL/Firestore-запросы из Controller;
	•	обращение Controller к AI;
	•	вызов Publisher напрямую;
	•	обращение одного модуля к внутренним классам другого.
Все взаимодействие проходит через команды, события и публичные интерфейсы.

Итог главы
После введения Command Bus архитектура платформы приобретает чёткое разделение ответственности:
	•	REST API становится транспортным слоем;
	•	Command Bus — точкой входа для всех изменений состояния;
	•	Domain Services — единственным местом бизнес-логики;
	•	Event Bus — механизмом взаимодействия между модулями;
	•	Task Engine — системой выполнения длительных операций;
	•	Read Models — оптимизированным слоем для интерфейса и аналитики.
Это позволяет в будущем без изменения архитектуры добавить CLI, AI-агентов, автоматические сценарии и внешние интеграции — все они будут использовать один и тот же механизм команд.