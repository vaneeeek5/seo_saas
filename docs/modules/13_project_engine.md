Глава 13 — Module Specification.
Это будет самый объёмный раздел всей документации. Для каждого модуля платформы (Project, Website Engine, Semantic Engine, Knowledge Engine, Planning Engine, Content Engine, Humanizer, Media, Publisher, Analytics, AI Orchestrator, Task Engine и других) будет создана отдельная спецификация объёмом 15–30 страниц с описанием:
	•	назначения и зоны ответственности;
	•	внутренней архитектуры;
	•	публичного API;
	•	команд и событий;
	•	модели данных;
	•	бизнес-правил;
	•	конфигурации;
	•	алгоритмов;
	•	последовательностей выполнения;
	•	требований к производительности;
	•	стратегии тестирования;
	•	метрик и мониторинга.
Именно этот раздел станет основным руководством для реализации каждого модуля платформы.

ГЛАВА 13

ГЛАВА 13
PROJECT MODULE SPECIFICATION
Module ID: CORE-001
Module: Project Engine
Version: 1.0
Status: Approved

13.1 Назначение
Project Engine — центральный модуль платформы.
Каждый объект системы существует только внутри Project.
Project является:
	•	единицей хранения данных;
	•	единицей безопасности;
	•	единицей масштабирования;
	•	единицей аналитики;
	•	единицей AI-контекста.
Никакой бизнес-объект не может существовать без Project.

13.2 Ответственность
Project Engine отвечает за:
	•	создание проектов;
	•	жизненный цикл проекта;
	•	настройки проекта;
	•	язык;
	•	регион;
	•	CMS;
	•	статус проекта;
	•	текущий этап Pipeline;
	•	разрешения модулей.
Project Engine не занимается:
	•	обходом сайта;
	•	генерацией контента;
	•	публикацией;
	•	аналитикой.

13.3 Aggregate Root
Главный Aggregate.
Project

Все изменения проходят исключительно через него.

13.4 Domain Model
Project

├── Website
├── Settings
├── Pipeline
├── Integrations
├── Statistics
├── Permissions
└── Metadata


13.5 Структура Project
id

organizationId

name

description

domain

language

region

timezone

cms

status

pipelineStage

knowledgeVersion

settingsId

statisticsId

createdBy

createdAt

updatedAt

archivedAt


13.6 Pipeline Stage
Pipeline определяет текущее состояние проекта.
Draft

↓

Website Connected

↓

Website Crawled

↓

Semantic Ready

↓

Knowledge Ready

↓

Content Planned

↓

Content Generated

↓

Images Ready

↓

Publishing

↓

Growing

↓

Monitoring

Pipeline изменяется только Project Engine.

13.7 Project Status
Статусы жизненного цикла.
Draft

Active

Paused

Archived

Deleted (logical)

Физического удаления нет.

13.8 Commands
Поддерживаемые команды.
CreateProject

UpdateProject

ArchiveProject

RestoreProject

PauseProject

ResumeProject

ChangeLanguage

ChangeRegion

ChangeCMS


13.9 Queries
GetProject

GetProjects

GetProjectDashboard

GetPipelineStatus

GetProjectSettings


13.10 Events
Project Engine публикует.
ProjectCreated

ProjectUpdated

ProjectArchived

ProjectRestored

PipelineChanged

ProjectPaused

ProjectResumed


13.11 Входящие события
Project Engine подписывается на события других модулей.
WebsiteConnected

WebsiteCrawled

SemanticCollected

KnowledgeGraphBuilt

ContentPlanCreated

ArticleGenerated

ImagesGenerated

PublicationCompleted

После получения событий Project обновляет Pipeline.

13.12 Pipeline Rules
Pipeline меняется автоматически.
Например.
WebsiteConnected

↓

Pipeline = Website Connected

SemanticCollected

↓

Pipeline = Semantic Ready

PublicationCompleted

↓

Pipeline = Growing


13.13 Business Rules
Создание проекта невозможно:
	•	без Organization;
	•	без владельца;
	•	без домена;
	•	без языка.

Запрещено:
сменить CMS
если уже существует опубликованный контент.

Архивирование проекта:
останавливает
	•	Task Engine;
	•	AI;
	•	Publisher;
	•	Crawl.

13.14 Statistics
Project хранит агрегированные показатели.
pages

keywords

clusters

topics

articles

published

images

traffic

tasks

lastActivity

Это Read Model.

13.15 Permissions
Project хранит список ролей.
Owner

Admin

Editor

Viewer


Разрешения.
Action
Owner
Admin
Editor
Viewer
Edit Project
✅
✅
❌
❌
Crawl
✅
✅
✅
❌
Generate Content
✅
✅
✅
❌
Publish
✅
✅
✅
❌
Archive
✅
❌
❌
❌

13.16 Settings
Каждый Project имеет собственные настройки.
language

country

timezone

cms

defaultModel

defaultPublisher

defaultImageModel

publishSchedule

notificationSettings


13.17 Integrations
Project знает только список интеграций.
WordPress

Tilda

Custom API

Google Search Console

Google Analytics

Yandex Wordstat

OpenRouter

Gemini

Конкретная реализация находится в соответствующих контекстах.

13.18 Dashboard Model
Для интерфейса формируется агрегированная модель.
Project Dashboard

Project

Pipeline

Statistics

Recent Tasks

Recent Publications

Recent Notifications

Health Score


13.19 Health Score
Каждый проект получает внутреннюю оценку состояния.
Формируется из:
	•	доступности сайта;
	•	успешности обходов;
	•	полноты семантики;
	•	покрытия Knowledge Graph;
	•	качества контента;
	•	процента опубликованных материалов;
	•	количества ошибок;
	•	состояния интеграций.
Шкала:
0–39   Critical

40–59  Poor

60–79  Good

80–100 Excellent

Этот показатель используется в интерфейсе и для рекомендаций AI.

13.20 Project Snapshot
Перед любыми массовыми изменениями создаётся снимок состояния проекта.
Snapshot включает:
	•	настройки;
	•	статистику;
	•	текущий Pipeline;
	•	версии Knowledge Graph;
	•	версии Content Plan;
	•	список активных задач.
Это позволяет восстановить состояние проекта после критических ошибок или неудачных миграций.

13.21 Project Locking
Во время выполнения критических операций Project может быть временно заблокирован.
Например:
	•	массовая генерация контента;
	•	миграция структуры данных;
	•	полная переиндексация сайта.
Lock предотвращает запуск конфликтующих операций и автоматически снимается после завершения задачи или по таймауту.

13.22 Метрики
Project Engine публикует следующие технические метрики:
	•	время создания проекта;
	•	среднее время смены этапа Pipeline;
	•	количество активных проектов;
	•	количество архивных проектов;
	•	число ошибок изменения состояния;
	•	среднее время загрузки Dashboard.

13.23 Требования к производительности
	•	Создание проекта — до 500 мс.
	•	Получение Dashboard — до 300 мс при использовании Read Model.
	•	Обновление Pipeline — до 100 мс после получения события.
	•	Массовое получение списка проектов — с использованием cursor pagination.

13.24 Стратегия тестирования
Обязательные виды тестов:
	•	Unit-тесты для бизнес-правил Project.
	•	Integration-тесты для обработки событий.
	•	Contract-тесты для API.
	•	Permission-тесты для проверки ролей.
	•	Performance-тесты для Dashboard и списка проектов.

Итог модуля
Project Engine — это координационный центр платформы. Он не выполняет SEO-задачи, а управляет жизненным циклом проекта, фиксирует состояние, агрегирует информацию и обеспечивает единый контекст для всех остальных модулей.