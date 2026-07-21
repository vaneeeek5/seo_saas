ГЛАВА 8

ГЛАВА 8
DATABASE ARCHITECTURE SPECIFICATION
Version: 1.0
Status: Approved

8.1 Назначение
Настоящий документ определяет единственную допустимую структуру хранения данных платформы SEO OS.
Все модули, API, события и AI работают исключительно через данную модель данных.
Изменение структуры базы данных допускается только после внесения изменений в настоящую спецификацию и утверждения нового ADR.

8.2 Общие принципы
DB-001
Project Isolation
Все данные принадлежат Project.
Никакая бизнес-сущность не существует вне проекта.
Обязательное поле:
projectId


DB-002
Organization Isolation
Все проекты принадлежат Organization.
Organization

↓

Projects

↓

Everything Else


DB-003
Immutable IDs
ID документа никогда не меняется.
Даже если меняется URL сайта, название статьи или домен.

DB-004
Soft Delete
Физическое удаление запрещено.
Документы получают
status: Archived
deletedAt
deletedBy


DB-005
Versioning
Каждая изменяемая сущность имеет
version
createdAt
updatedAt


DB-006
Audit
Каждое изменение фиксируется.
createdBy
updatedBy


8.3 Firestore Collections
Корневая структура базы данных.
organizations

users

projects

websites

pages

crawl_sessions

keywords

clusters

knowledge_nodes

knowledge_edges

topics

content_plans

content_assets

article_versions

media_assets

publications

tasks

events

analytics

notifications

settings

prompt_templates

ai_requests

logs

Каждая коллекция имеет собственный жизненный цикл.

8.4 Collection Specification

organizations
Назначение
Владельцы проектов.
Document
id

name

ownerId

plan

status

createdAt

updatedAt


users
Назначение
Пользователи платформы.
Document
id

organizationId

email

displayName

avatar

role

status

lastLogin

createdAt

updatedAt


projects
Главная сущность системы.
Document
id

organizationId

name

domain

language

region

cms

status

currentPipelineStage

knowledgeVersion

createdAt

updatedAt


Индексы
organizationId

status

domain


websites
Описание подключенного сайта.
id

projectId

url

cms

robotsUrl

sitemapUrl

canonicalHost

language

pagesCount

crawlStatus

lastCrawlAt

createdAt


pages
Самая важная коллекция Website Engine.
Каждая страница сайта хранится отдельно.
id

projectId

url

title

description

h1

statusCode

canonical

indexable

depth

contentHash

lastModified

crawlSessionId


Индексы
projectId

url

contentHash


crawl_sessions
Каждый обход сайта — отдельная сущность.
id

projectId

startedAt

finishedAt

pagesVisited

errors

duration

status


keywords
Каждый поисковый запрос.
id

projectId

phrase

normalized

language

region

frequency

competition

intent

priority

source

status


Индексы
projectId

phrase

intent

priority


clusters
Группы ключевых слов.
id

projectId

name

parentCluster

intent

priority

keywordsCount

status


knowledge_nodes
Главная коллекция Knowledge Layer.
Каждая сущность графа хранится отдельно.
id

projectId

type

title

slug

parent

importance

coverageScore

status

Типы:
Topic

Category

Article

FAQ

Glossary

Landing

Product

Tag


knowledge_edges
Связи графа знаний.
id

projectId

from

to

relation

weight


Типы связей
belongs_to

related_to

depends_on

expands

duplicates

references

links_to


topics
Будущие материалы.
id

projectId

clusterId

knowledgeNodeId

title

priority

estimatedTraffic

difficulty

status


content_plans
Контентная стратегия.
id

projectId

name

generatedBy

topicsCount

estimatedTraffic

status

createdAt


content_assets
Это центральная коллекция контента.
Не Article.
Именно Content Asset.
id

projectId

type

topicId

currentVersion

status

qualityScore

published

createdAt

updatedAt


Типы
Article

Category

Landing

FAQ

Product

Comparison

News

Glossary


article_versions
Контент никогда не перезаписывается.
Каждая генерация создаёт новую версию.
id

assetId

version

title

content

metaTitle

metaDescription

schema

promptVersion

llm

humanizerVersion

createdAt


media_assets
Все изображения.
id

assetId

provider

prompt

width

height

alt

caption

og

status


publications
История публикаций.
id

assetId

target

cms

adapter

publishedUrl

publishedVersion

status

publishedAt


tasks
Основа платформы.
id

projectId

type

priority

worker

status

attempt

maxAttempts

startedAt

finishedAt

duration

error


events
Журнал событий.
id

projectId

eventType

version

producer

payload

status

occurredAt


analytics
На MVP.
id

projectId

articles

published

keywords

clusters

pages

errors

updatedAt

Во второй версии сюда будут добавлены:
	•	Search Console;
	•	GA4;
	•	Метрика;
	•	позиции;
	•	CTR;
	•	показы;
	•	клики.

notifications
id

projectId

type

title

message

read

createdAt


settings
id

projectId

language

timezone

publishDefaults

aiDefaults

notifications


prompt_templates
Все промпты платформы.
id

name

version

purpose

template

variables

status


ai_requests
История запросов к моделям.
id

projectId

provider

model

tokensInput

tokensOutput

cost

duration

cacheHit

status


logs
Технические журналы.
id

service

level

message

traceId

createdAt


8.5 Data Ownership
Каждая коллекция имеет владельца.
Collection
Owner Module
organizations
Identity
users
Identity
projects
Projects
websites
Website Engine
pages
Website Engine
crawl_sessions
Website Engine
keywords
Semantic Engine
clusters
Semantic Engine
knowledge_nodes
Knowledge Engine
knowledge_edges
Knowledge Engine
topics
Planning Engine
content_plans
Planning Engine
content_assets
Content Engine
article_versions
Content Engine
media_assets
Media Engine
publications
Publisher
analytics
Analytics
tasks
Task Engine
events
Event Bus
ai_requests
AI Orchestrator
prompt_templates
AI Orchestrator
notifications
Notification Service

8.6 Database Rules
Запрещается:
	•	изменять документы других модулей напрямую;
	•	хранить большие бинарные данные в Firestore;
	•	хранить HTML изображений или файлов в документах;
	•	использовать одну коллекцию для разных бизнес-сущностей;
	•	изменять историю публикаций;
	•	изменять версии контента.

8.7 Object Storage
Все большие файлы хранятся вне Firestore.
Используется Cloud Storage.
Типы объектов:
images/

generated/

uploads/

exports/

backups/

logs/

Firestore хранит только ссылки на объекты.

8.8 Versioning Strategy
Версионируются:
	•	Content Asset;
	•	Prompt Template;
	•	Publication;
	•	Event Schema;
	•	API Contract.
Версии никогда не удаляются.
Новая версия создаётся как новый документ или новая запись, сохраняя полную историю изменений.