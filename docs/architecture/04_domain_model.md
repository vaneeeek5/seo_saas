ГЛАВА 4

Глава 4. Domain Model
Цель
Определить все сущности платформы, их жизненный цикл и связи.
После утверждения этой главы мы не будем менять названия сущностей, иначе потом придется переделывать API, базу данных, UI и бизнес-логику.

4.1 Главный объект системы
Самое важное архитектурное решение:
Главной сущностью платформы является Project.
Не статья.
Не ключ.
Не сайт.
Именно проект.
Всё остальное существует внутри проекта.
Organization
│
└── Project
    ├── Website
    ├── Semantic
    ├── Content
    ├── Publishing
    ├── Analytics
    ├── Tasks
    └── Settings


4.2 Domain Tree
Полная модель предметной области.
Organization
│
├── Users
│
├── Projects
│   │
│   ├── Website
│   │
│   ├── Crawl
│   │
│   ├── Semantic
│   │   ├── Keywords
│   │   ├── Clusters
│   │   ├── Search Intent
│   │   └── Competitors
│   │
│   ├── Content Plan
│   │
│   ├── Articles
│   │
│   ├── Images
│   │
│   ├── Publications
│   │
│   ├── Analytics
│   │
│   ├── Tasks
│   │
│   └── Settings
│
└── Billing


4.3 Главные сущности
Organization
Представляет владельца проектов.
Поля:
	•	id
	•	name
	•	owner
	•	createdAt
	•	status

User
Пользователь платформы.
Поля:
	•	id
	•	email
	•	role
	•	organizationId

Project
Главная бизнес-сущность.
Проект объединяет:
	•	сайт;
	•	семантику;
	•	статьи;
	•	публикации;
	•	аналитику;
	•	настройки.
Поля:
	•	id
	•	organizationId
	•	name
	•	domain
	•	language
	•	region
	•	cms
	•	status
	•	createdAt
	•	updatedAt
Статусы:
	•	Draft
	•	Active
	•	Paused
	•	Archived

Website
Описание подключенного сайта.
Поля:
	•	projectId
	•	url
	•	cms
	•	robots
	•	sitemap
	•	pagesCount
	•	crawlStatus

Crawl
Результат обхода сайта.
Хранит:
	•	найденные страницы;
	•	структуру;
	•	внутренние ссылки;
	•	ошибки;
	•	метаданные.

Keyword
Отдельный поисковый запрос.
Поля:
	•	phrase
	•	frequency
	•	competition
	•	intent
	•	priority

Cluster
Группа связанных запросов.
Поля:
	•	title
	•	keywords
	•	parentCluster
	•	searchIntent

Topic
Будущая единица контент-плана.
Одна тема может включать несколько кластеров.

Content Plan
План публикаций.
Содержит:
	•	темы;
	•	очередность;
	•	приоритет;
	•	дедлайн публикации.

Article
Материал.
Поля:
	•	title
	•	slug
	•	content
	•	status
	•	meta
	•	schema
	•	wordCount
	•	aiVersion
Статусы:
	•	Draft
	•	Generated
	•	Humanized
	•	Approved
	•	Published
	•	Archived

Image
Изображение статьи.
Поля:
	•	prompt
	•	model
	•	url
	•	alt
	•	caption

Publication
Факт публикации.
Поля:
	•	target
	•	publishedUrl
	•	publishedAt
	•	status
	•	version

Analytics
Агрегированные показатели проекта.
На первом этапе:
	•	опубликовано статей;
	•	создано статей;
	•	кластеров;
	•	ключей;
	•	ошибок публикации.
Позже добавятся:
	•	позиции;
	•	показы;
	•	CTR;
	•	трафик.

Task
Очень важная сущность.
Все долгие операции оформляются как задачи.
Типы задач:
	•	Crawl
	•	Semantic
	•	Cluster
	•	Generate Article
	•	Generate Images
	•	Publish
	•	Refresh Analytics
Статусы:
	•	Pending
	•	Running
	•	Completed
	•	Failed
	•	Cancelled

4.4 Жизненный цикл статьи
Topic
   │
   ▼
Article Created
   │
   ▼
Generated
   │
   ▼
Humanized
   │
   ▼
Images Ready
   │
   ▼
Approved
   │
   ▼
Published
   │
   ▼
Updated


4.5 Жизненный цикл проекта
Draft
   │
   ▼
Website Connected
   │
   ▼
Crawled
   │
   ▼
Semantic Ready
   │
   ▼
Content Plan Ready
   │
   ▼
Content Generated
   │
   ▼
Publishing
   │
   ▼
Growth


4.6 Инварианты
Некоторые правила никогда не должны нарушаться:
	•	У каждого Project ровно один Website.
	•	Keyword принадлежит только одному Project.
	•	Cluster принадлежит только одному Project.
	•	Topic принадлежит только одному Content Plan.
	•	Article создается только из Topic.
	•	Publication всегда ссылается на одну версию Article.
	•	Любая длительная операция оформляется через Task.
	•	Все внешние интеграции работают только через Adapter.