ГЛАВА 10

ГЛАВА 10
API ARCHITECTURE SPECIFICATION
Version: 1.0
Status: Approved

10.1 Назначение
Настоящий документ определяет единственный допустимый публичный API платформы SEO OS.
Любой интерфейс платформы работает исключительно через API.
К API относятся:
	•	Web Application
	•	CLI
	•	Mobile Application (будущее)
	•	SDK
	•	Внешние интеграции
	•	AI Agents
Прямой доступ к базе данных запрещён.

10.2 Архитектурные принципы
API-001
API First
Новая функция сначала появляется в API.
Только после этого реализуется пользовательский интерфейс.

API-002
REST First
MVP использует REST API.
В будущем допускается GraphQL только как дополнительный слой.
REST остаётся основным контрактом системы.

API-003
JSON Only
Все запросы и ответы используют JSON.
Исключения:
	•	экспорт файлов;
	•	загрузка изображений;
	•	импорт документов.

API-004
Stateless
Каждый запрос полностью независим.
Сервер не хранит пользовательское состояние между запросами.

API-005
Project Scope
Все операции выполняются в рамках Project.
Практически каждый endpoint содержит Project ID.

10.3 Общая структура API
/api/v1

    /auth

    /organizations

    /users

    /projects

    /website

    /crawl

    /keywords

    /clusters

    /knowledge

    /topics

    /content-plan

    /content

    /media

    /publications

    /analytics

    /tasks

    /events

    /notifications

    /settings

    /prompts

    /ai


10.4 Versioning
Каждая версия API имеет собственный namespace.
/api/v1

/api/v2

Изменение структуры ответа без увеличения версии запрещено.

10.5 Authentication
Используется JWT.
Authorization:

Bearer <token>

Все защищённые endpoints требуют токен.

10.6 Общий формат ответа
Успешный ответ
{
  "success": true,
  "data": {},
  "meta": {},
  "requestId": "...",
  "timestamp": "..."
}

Ошибка
{
  "success": false,
  "error": {
    "code": "PROJECT_NOT_FOUND",
    "message": "Project not found"
  },
  "requestId": "...",
  "timestamp": "..."
}


10.7 Error Codes
Стандартизированные ошибки.
AUTH_INVALID_TOKEN

AUTH_FORBIDDEN

PROJECT_NOT_FOUND

PROJECT_ARCHIVED

WEBSITE_NOT_CONNECTED

CONTENT_NOT_FOUND

TASK_NOT_FOUND

PUBLICATION_FAILED

AI_PROVIDER_UNAVAILABLE

RATE_LIMIT_EXCEEDED

VALIDATION_ERROR

INTERNAL_ERROR


10.8 Projects API

POST /projects
Создание проекта.
Request
{
  "name": "",
  "domain": "",
  "language": "",
  "region": "",
  "cms": ""
}


Response
{
  "id": "",
  "status": "Draft"
}


Events
После успешного выполнения публикуется
ProjectCreated


GET /projects
Возвращает список проектов пользователя.
Поддерживает:
	•	пагинацию;
	•	сортировку;
	•	фильтрацию;
	•	поиск.

GET /projects/{id}
Возвращает полную информацию о проекте.

PATCH /projects/{id}
Редактирование проекта.

DELETE /projects/{id}
Архивирование проекта.
Физическое удаление запрещено.

10.9 Website API

POST /projects/{id}/website/connect
Подключение сайта.
Request
{
  "url": "",
  "cms": ""
}

После успешного подключения публикуются события:
WebsiteConnected

WebsiteValidationStarted


POST /website/crawl
Запуск обхода.
Ответ
{
  "taskId": ""
}

Никогда не ожидает завершения обхода.

GET /website/pages
Возвращает страницы сайта.
Фильтры:
	•	статус;
	•	индексируемость;
	•	глубина;
	•	ошибки.

10.10 Semantic API

POST /semantic/collect
Создание задачи сбора семантики.
Ответ
{
  "taskId": ""
}


GET /keywords
Фильтры
	•	cluster
	•	intent
	•	frequency
	•	language
	•	priority

GET /clusters
Возвращает дерево кластеров.

GET /knowledge
Возвращает Knowledge Graph.

10.11 Planning API

POST /content-plan/generate
Создать контент-план.
Ответ
{
  "taskId": ""
}


GET /content-plan
Возвращает стратегию проекта.

10.12 Content API

POST /content/generate
Создание статьи.
{
  "topicId": ""
}

Ответ
{
  "taskId": ""
}


GET /content
Получить список Content Assets.
Фильтры
	•	type
	•	status
	•	quality
	•	published

GET /content/{id}
Полный контент.

PATCH /content/{id}
Редактирование.
Создаёт новую версию.

GET /content/{id}/versions
История версий.

POST /content/{id}/approve
Подтверждение статьи.
Публикуется
ContentApproved


10.13 Media API

POST /media/generate
Создание изображений.
Ответ
{
  "taskId": ""
}


GET /media
Все изображения.

DELETE /media/{id}
Удаление изображения.

10.14 Publisher API

POST /publish
Публикация.
Request
{
  "assetId": "",
  "target": ""
}

Ответ
{
  "taskId": ""
}


GET /publications
История публикаций.

POST /publish/schedule
Отложенная публикация.

10.15 Analytics API

GET /analytics
Сводная аналитика.

GET /analytics/content
Статистика контента.

GET /analytics/keywords
Статистика семантики.

10.16 Tasks API

GET /tasks
Все задачи.

GET /tasks/{id}
Подробности.

POST /tasks/{id}/cancel
Отмена.

POST /tasks/{id}/retry
Повторный запуск.

10.17 Events API

GET /events
Журнал событий.

GET /events/{id}
Подробности события.

10.18 AI API

POST /ai/generate
Универсальная точка входа.
Используется внутренними сервисами.
Не предназначена для пользователя.

GET /prompts
Получить шаблоны промптов.

10.19 Pagination
Используется Cursor Pagination.
Request
GET /content?cursor=...

Ответ
{
  "items": [],
  "nextCursor": "",
  "hasMore": true
}


10.20 Filtering
Все списки используют единый синтаксис.
Пример
GET /content

?status=Published

&type=Article

&limit=50

&sort=createdAt

&order=desc


10.21 Async Operations
Любая длительная операция возвращает Task.
Пример
POST

↓

TaskCreated

↓

202 Accepted

↓

taskId

Клиент далее получает состояние через:
GET /tasks/{id}

Это правило обязательно для:
	•	AI;
	•	публикации;
	•	обхода сайта;
	•	генерации изображений;
	•	генерации статей;
	•	аналитики.

10.22 API Security
Каждый endpoint определяет:
	•	Required Role
	•	Permissions
	•	Rate Limit
	•	Authentication
	•	Audit Logging
Например:
Endpoint
Role
GET /projects
Editor
POST /projects
Owner
DELETE /projects
Owner
POST /publish
Editor
GET /analytics
Editor

10.23 API Observability
Каждый запрос обязан иметь:
Request-ID

Correlation-ID

User-Agent

API-Version

Все запросы журналируются.

10.24 API Compatibility
Запрещено:
	•	изменять структуру ответа;
	•	переименовывать поля;
	•	удалять поля;
	•	менять типы данных.
Изменения выполняются только через новую версию API.

Архитектурный комментарий
На этом этапе спецификация начинает переходить от уровня "архитектуры" к уровню "контрактов". Но здесь есть важный момент: текущий REST API хорошо подходит для MVP, однако для платформы, которую ты строишь, этого будет недостаточно.
В документе уже появились Project, Task, Event и Knowledge Graph. Это признаки того, что ядро системы должно строиться вокруг команд (Commands) и событий (Events), а REST становится лишь внешним транспортом. Если мы оставим API только в виде набора REST-эндпоинтов, через год его придется существенно перерабатывать.
Поэтому я предлагаю следующую главу сделать не про отдельные модули, а про Command Bus & Query Bus (CQRS). Это изменит архитектуру в правильную сторону: пользовательский интерфейс, AI-агенты, CLI и будущие автоматизации будут отправлять одинаковые команды (GenerateArticle, PublishContent, CollectSemantic), а система уже будет сама решать, какие задачи запускать и какие события публиковать. Это станет настоящим ядром платформы и избавит от необходимости постоянно расширять REST API при появлении новых возможностей.