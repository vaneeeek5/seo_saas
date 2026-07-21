ГЛАВА 9

ГЛАВА 9
TASK ENGINE SPECIFICATION
Version: 1.0
Status: Approved

9.1 Назначение
Task Engine является центральной системой исполнения платформы.
Любая операция, которая:
	•	занимает более 1 секунды;
	•	обращается к внешним сервисам;
	•	требует AI;
	•	требует обхода сайта;
	•	может быть повторена;
должна выполняться исключительно через Task Engine.
HTTP API никогда не выполняет подобную работу самостоятельно.

9.2 Архитектурная роль
Task Engine отвечает за:
	•	создание задач;
	•	планирование;
	•	постановку в очередь;
	•	выбор Worker;
	•	повторные попытки;
	•	обработку ошибок;
	•	мониторинг;
	•	журнал выполнения.
Task Engine не содержит бизнес-логики.
Он только управляет выполнением.

9.3 Основные принципы
TASK-001
Everything is Task
Любое длительное действие — задача.
Например:
	•	Crawl Website
	•	Collect Keywords
	•	Cluster Keywords
	•	Generate Article
	•	Humanize Content
	•	Generate Images
	•	Publish Content
	•	Update Analytics
	•	Rebuild Knowledge Graph

TASK-002
Tasks are Stateless
Worker может быть остановлен в любой момент.
После перезапуска выполнение продолжается по данным Task.

TASK-003
Retry Safe
Каждая задача обязана поддерживать безопасный повторный запуск.
Если задача выполнена повторно, результат не должен дублироваться.

TASK-004
Observable
Каждая задача имеет историю выполнения и метрики.

9.4 Жизненный цикл задачи
Created
    │
    ▼
Validated
    │
    ▼
Queued
    │
    ▼
Reserved
    │
    ▼
Running
    │
    ├──────────────┐
    ▼              │
Completed          │
                   │
Failed ────────────┘
    │
    ▼
Retry Scheduled
    │
    ▼
Queued

Также возможны состояния:
Cancelled

Paused

Expired

Dead Letter


9.5 Структура Task
Task

id: UUID

projectId

type

status

priority

worker

payload

result

attempt

maxAttempts

createdAt

scheduledAt

startedAt

finishedAt

duration

error

retryAt

correlationId

causationId


9.6 Типы задач
Website Engine
WEBSITE_VALIDATE

WEBSITE_CRAWL

WEBSITE_RECRAWL

SITEMAP_PARSE

ROBOTS_PARSE


Semantic Engine
COLLECT_KEYWORDS

NORMALIZE_KEYWORDS

REMOVE_DUPLICATES

CLUSTER_KEYWORDS

DETECT_INTENT

BUILD_SEMANTIC_GRAPH


Planning Engine
BUILD_CONTENT_PLAN

PRIORITIZE_TOPICS

GENERATE_STRATEGY


Content Engine
GENERATE_OUTLINE

GENERATE_ARTICLE

GENERATE_META

GENERATE_SCHEMA

REVIEW_CONTENT


Humanizer
HUMANIZE_CONTENT

CHECK_READABILITY

REMOVE_AI_PATTERNS


Media
GENERATE_IMAGE

GENERATE_ALT

GENERATE_OG

OPTIMIZE_IMAGE


Publisher
PUBLISH_CONTENT

UPDATE_CONTENT

DELETE_CONTENT

VERIFY_PUBLICATION


Analytics
UPDATE_ANALYTICS

IMPORT_GSC

IMPORT_GA4

CHECK_INDEXING


9.7 Приоритеты
Каждая задача имеет приоритет.
Critical

High

Normal

Low

Background

Worker всегда выбирает наиболее приоритетную задачу.

9.8 Очереди
Используются независимые очереди.
Website Queue

Semantic Queue

Planning Queue

Content Queue

Media Queue

Publishing Queue

Analytics Queue

AI Queue

Notification Queue

Это исключает ситуацию, когда генерация изображений блокирует публикацию.

9.9 Workers
Каждый Worker отвечает только за один тип задач.
Пример:
Content Worker

↓

GENERATE_ARTICLE

Media Worker

↓

GENERATE_IMAGE

Worker не должен выполнять задачи других доменов.

9.10 Retry Policy
При возникновении ошибки задача автоматически повторяется.
Стратегия:
Attempt 1

↓

30 sec

↓

Attempt 2

↓

2 min

↓

Attempt 3

↓

10 min

↓

Attempt 4

↓

30 min

↓

Dead Letter Queue

Количество попыток задаётся типом задачи.

9.11 Dead Letter Queue
Если задача исчерпала лимит повторов, она переносится в отдельную очередь.
Dead Letter Queue

Для каждой такой задачи сохраняются:
	•	причина ошибки;
	•	стек выполнения;
	•	номер попытки;
	•	Worker;
	•	входные данные;
	•	время выполнения.
Задачи из Dead Letter Queue могут быть повторно запущены вручную.

9.12 Scheduled Tasks
Task Engine поддерживает отложенное выполнение.
Пример:
scheduledAt:
2026-08-15 12:00

До наступления времени задача не будет помещена в рабочую очередь.

9.13 Batch Tasks
Некоторые операции требуют обработки большого количества объектов.
Например:
Generate 500 Articles

Такая задача автоматически разбивается.
Parent Task

↓

500 Child Tasks

После завершения всех дочерних задач создаётся событие:
BatchCompleted


9.14 Dependency Graph
Задачи могут зависеть друг от друга.
Например:
Website Crawl

↓

Collect Keywords

↓

Build Clusters

↓

Generate Plan

↓

Generate Article

↓

Generate Images

↓

Publish

Если предыдущая задача завершилась ошибкой, последующие не запускаются.

9.15 Cancellation
Любая задача может быть отменена.
Статус:
Cancelled

Worker обязан периодически проверять статус задачи и корректно завершать выполнение.

9.16 Timeout
Каждый тип задач имеет максимальное время выполнения.
Пример:
Task
Timeout
Crawl Website
15 min
Generate Article
5 min
Generate Image
3 min
Publish
2 min
Analytics Update
10 min
После превышения лимита задача считается неуспешной и переводится в Retry.

9.17 Progress Reporting
Worker обязан регулярно обновлять прогресс.
progress

0

25

50

75

100

Дополнительно может передаваться этап выполнения:
stage

Collecting

Generating

Publishing

Completed


9.18 Metrics
Для каждой задачи рассчитываются:
	•	время ожидания в очереди;
	•	время выполнения;
	•	число повторных запусков;
	•	процент успешных завершений;
	•	процент ошибок;
	•	среднее время выполнения по типу;
	•	загрузка Worker;
	•	количество задач в очереди.

9.19 Monitoring
Task Engine публикует события:
TaskCreated

TaskQueued

TaskStarted

TaskProgressChanged

TaskCompleted

TaskFailed

TaskCancelled

TaskExpired

Все события фиксируются в Event Log.

9.20 Ограничения
Task Engine запрещено:
	•	выполнять бизнес-логику;
	•	обращаться напрямую к Firestore других модулей;
	•	изменять данные без вызова соответствующего доменного сервиса;
	•	публиковать контент напрямую;
	•	обращаться к AI-моделям без AI Orchestrator.

9.21 Масштабирование
Task Engine должен поддерживать горизонтальное масштабирование.
Требования:
	•	несколько Worker одного типа могут работать одновременно;
	•	один Worker не должен блокировать другие;
	•	обработка задач должна быть идемпотентной;
	•	распределение нагрузки должно происходить автоматически.

Итог главы
Task Engine является исполнительным ядром платформы. Все длительные операции проходят через него, а взаимодействие с другими модулями осуществляется через события и очереди. Такая архитектура обеспечивает масштабируемость, отказоустойчивость и возможность безопасной параллельной обработки большого количества задач.