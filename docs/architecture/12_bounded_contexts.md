ГЛАВА 12

ГЛАВА 12
BOUNDED CONTEXT ARCHITECTURE
Version: 1.0
Status: Approved

12.1 Назначение
Платформа SEO OS разделяется на независимые бизнес-контексты (Bounded Contexts).
Каждый контекст:
	•	владеет своими данными;
	•	владеет своей бизнес-логикой;
	•	публикует собственные события;
	•	имеет собственный API;
	•	не изменяет данные других контекстов напрямую.
Границы контекстов являются архитектурным контрактом и не могут нарушаться.

12.2 Карта контекстов
                               SEO OS

                                   │

 ┌─────────────────────────────────────────────────────────────┐
 │                                                             │
 │                     Identity Context                        │
 │                                                             │
 └─────────────────────────────────────────────────────────────┘
                    │
                    ▼
 ┌─────────────────────────────────────────────────────────────┐
 │                                                             │
 │                     Project Context                         │
 │                                                             │
 └─────────────────────────────────────────────────────────────┘
      │            │              │               │
      ▼            ▼              ▼               ▼

 Website      Semantic      Planning      Notification

      │
      ▼

 Knowledge Layer

      │
      ▼

 Content

      │
      ▼

 Humanizer

      │
      ▼

 Media

      │
      ▼

 Publisher

      │
      ▼

 Analytics


12.3 Identity Context
Назначение
Управление пользователями.
Владеет
	•	Organization
	•	User
	•	Roles
	•	JWT
	•	Sessions

Публикует
OrganizationCreated

UserCreated

UserUpdated

RoleChanged


Подписывается
Нет.

Может обращаться к
Ни к одному бизнес-модулю.
Identity полностью независим.

12.4 Project Context
Самый главный контекст системы.
Он владеет:
	•	Project
	•	Settings
	•	Pipeline
	•	Status

Только Project Context может
создать Project
изменить Project
архивировать Project

Публикует
ProjectCreated

ProjectUpdated

ProjectArchived


Использует
Identity

Используется
Практически всеми.

12.5 Website Context
Назначение
Изучение сайта.

Владеет
	•	Website
	•	Pages
	•	Crawl
	•	Sitemap
	•	Robots

Публикует
WebsiteConnected

WebsiteValidated

WebsiteCrawled

WebsiteUpdated


Использует
Project

Никогда не обращается к
Semantic
Content
Publisher

12.6 Semantic Context
Самостоятельный бизнес-домен.
Владеет
	•	Keywords
	•	Clusters
	•	Search Intent
	•	Frequency
	•	Competitors

Публикует
SemanticCollected

ClustersBuilt

KeywordUpdated


Использует
Website

Никогда не знает
Publisher
Analytics
Media

12.7 Knowledge Context
Новый контекст.
Именно здесь живёт интеллект платформы.
Владеет
	•	Knowledge Nodes
	•	Knowledge Edges
	•	Coverage
	•	Topic Relations
	•	Internal Link Graph

Получает
Semantic
Content
Analytics

Публикует
KnowledgeGraphBuilt

CoverageUpdated

TopicGapDetected

InternalLinksSuggested


Никто не изменяет граф знаний напрямую.

12.8 Planning Context
Владеет
	•	Strategy
	•	Content Plan
	•	Priority
	•	Calendar

Получает
Knowledge Graph

Создает
Topics

Публикует
ContentPlanCreated

TopicPrioritized

StrategyUpdated


12.9 Content Context
Самый большой домен.
Владеет
	•	Content Assets
	•	Versions
	•	Drafts
	•	Schema
	•	Meta

Не знает
CMS
WordPress
Tilda

Публикует
ArticleGenerated

ArticleApproved

ContentUpdated


12.10 Humanizer Context
Очень маленький контекст.
Отвечает только за улучшение текста.
Он никогда ничего не публикует.
Он никогда не пишет статьи.
Он только получает Draft.

Публикует
HumanizerCompleted


12.11 Media Context
Владеет
	•	Images
	•	ALT
	•	Caption
	•	OG Image

Получает
Content

Никогда не знает
Publisher

Публикует
ImagesGenerated


12.12 Publisher Context
Полностью изолирован.
Владеет
	•	Publication
	•	Adapter
	•	Publish Queue

Он не знает
Semantic
Planning
Knowledge

Получает
Content Asset

Публикует
PublicationCompleted

PublicationFailed


12.13 Analytics Context
Получает
Практически все события платформы.

Создает
Read Models
Dashboards
Metrics
Reports

Никогда не изменяет
Project
Content
Publication

12.14 AI Context
Отдельный контекст.
Владеет
	•	Prompt Builder
	•	Context Builder
	•	Model Router
	•	Prompt Templates
	•	AI Requests
	•	Cost Control

Получает
Запросы от остальных контекстов.

Никогда не знает
WordPress
Publisher
Analytics

12.15 Notification Context
Самостоятельный модуль.
Владеет
	•	Notifications
	•	Email
	•	Telegram
	•	Webhooks

Получает
Domain Events

Не изменяет бизнес-сущности.

12.16 Task Context
Task Engine также является отдельным контекстом.
Владеет
	•	Tasks
	•	Queues
	•	Workers
	•	Scheduling
	•	Retry

Не знает
Project
Content
Semantic

Он выполняет задачи.
Не принимает бизнес-решений.

12.17 Context Ownership
Context
Owner
Identity
Identity Team
Projects
Core Team
Website
Crawl Team
Semantic
SEO Team
Knowledge
AI Team
Planning
SEO Team
Content
AI Team
Humanizer
AI Team
Media
AI Team
Publisher
Integration Team
Analytics
Analytics Team
Tasks
Platform Team
Notifications
Platform Team
Даже если сначала проект разрабатывает один человек, распределение ответственности по командам фиксируется заранее. Это позволяет масштабировать разработку без переработки архитектуры.

12.18 Communication Rules
Контексты взаимодействуют только через:
	•	Public API;
	•	Domain Events;
	•	Command Bus.
Запрещено:
	•	импортировать внутренние классы другого контекста;
	•	читать коллекции Firestore другого контекста напрямую;
	•	изменять документы другого контекста;
	•	вызывать внутренние сервисы другого контекста.

12.19 Anti-Corruption Layer (ACL)
Все внешние интеграции проходят через слой адаптации (ACL).
WordPress
      │
WordPress Adapter
      │
Publisher Context

Tilda
      │
Tilda Adapter
      │
Publisher Context

Gemini
      │
Gemini Adapter
      │
AI Context

Wordstat
      │
Wordstat Adapter
      │
Semantic Context

ACL защищает внутреннюю модель платформы от изменений внешних API.

12.20 Контекстные инварианты
Для каждого контекста определяются неизменяемые правила.
Project Context
	•	Только он изменяет статус проекта.
	•	Только он создаёт проекты.
Content Context
	•	Только он создаёт и версионирует контент.
	•	Никто другой не изменяет текст статьи.
Publisher Context
	•	Только он публикует материалы.
	•	Публикация невозможна без утверждённой версии контента.
Knowledge Context
	•	Только он управляет графом знаний.
	•	Остальные контексты могут только читать его через публичные интерфейсы.
Analytics Context
	•	Только читает события и формирует производные модели.
	•	Никогда не изменяет первичные бизнес-данные.

Итог главы
После утверждения этой главы границы ответственности между модулями считаются окончательно определёнными. Это позволит независимо развивать каждый контекст, масштабировать команды разработки и избежать сильной связанности между частями системы.

Следующая глава