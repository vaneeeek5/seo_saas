ГЛАВА 16

ГЛАВА 16
DECISION ENGINE SPECIFICATION
Module ID: DEC-001
Module: Decision Engine
Version: 1.0
Status: Approved

16.1 Назначение
Decision Engine — это модуль принятия решений.
Он не генерирует контент.
Он не вызывает LLM.
Он не публикует статьи.
Он принимает единственное решение:
Что платформа должна сделать дальше?
Все остальные сервисы только исполняют это решение.

16.2 Главный принцип
В платформе запрещено запускать действия напрямую.
Например.
Нельзя написать:
Keyword найден

↓

Generate Article

Это слишком примитивно.
Правильно:
Keyword найден

↓

Knowledge обновился

↓

Decision Engine

↓

Generate Article


16.3 Decision Sources
Decision Engine использует несколько независимых источников информации.
Knowledge Graph

Analytics

Website

Project Settings

Business Goals

Content Plan

Budget

AI Cost

User Rules

History

Только после анализа всех источников принимается решение.

16.4 Decision Types
Каждое решение имеет тип.
Generate Content

Refresh Content

Delete Content

Create Internal Links

Generate Images

Publish

Delay Publication

Rebuild Knowledge

Collect Semantic

Re-Crawl

Wait

Notify User

Nothing

Самое важное решение — Nothing. Система должна уметь ничего не делать, если изменений не требуется.

16.5 Decision Object
Все решения оформляются единым объектом.
id

projectId

decisionType

priority

reason

confidence

createdAt

expiresAt

status

generatedBy

approvedBy


16.6 Confidence Score
Каждое решение имеет степень уверенности.
0–30

Недостаточно данных

30–60

Нужна проверка пользователя

60–85

Можно рекомендовать

85–100

Можно выполнять автоматически

Автоматический режим платформы использует этот показатель как основной критерий.

16.7 Decision Reasons
Любое решение должно объясняться.
Например.
Coverage низкий

↓

Generate Article

или
Traffic падает

↓

Refresh Content

или
High Competition

↓

Delay Publication

Решения без объяснения запрещены.

16.8 Decision Strategy
Решение никогда не принимается по одному фактору.
Используется набор правил.
Например.
Coverage

+

Traffic

+

CTR

+

Freshness

+

Authority

+

Competition

+

ROI

↓

Decision


16.9 Business Goals
Decision Engine всегда учитывает цели проекта.
Например.
Goal

Increase Traffic

или
Goal

Generate Leads

или
Goal

Improve EEAT

Одни и те же данные могут приводить к разным решениям в зависимости от цели.

16.10 Priority Score
Каждое решение получает приоритет.
Он вычисляется по нескольким сигналам:
	•	потенциальный трафик;
	•	конкуренция;
	•	стоимость реализации;
	•	текущая полнота покрытия темы;
	•	влияние на стратегию проекта;
	•	сезонность;
	•	бизнес-ценность.

16.11 ROI Score
Каждое потенциальное действие оценивается по ожидаемой эффективности.
Пример:
Generate Article

Cost: 1.2$

Expected Traffic: 3500

Competition: Low

ROI: 94

или
Refresh Old Article

Cost: 0.4$

Traffic Recovery: 1200

ROI: 97

Decision Engine может выбрать обновление статьи вместо создания новой, если ожидаемая отдача выше.

16.12 Rule Engine
Decision Engine содержит набор декларативных правил.
Примеры:
	•	если Coverage < 60% и ROI высокий → предложить новую тему;
	•	если статья устарела и трафик падает → обновить;
	•	если внутренние ссылки недостаточны → построить рекомендации;
	•	если стоимость генерации превышает бюджет → отложить задачу.
Правила должны храниться отдельно от кода и поддерживать версионирование.

16.13 Learning Loop
После выполнения решения система анализирует результат.
Например:
Decision

↓

Generate Article

↓

Published

↓

Traffic

↓

ROI

↓

Decision Quality

Так Decision Engine постепенно накапливает статистику эффективности собственных решений.

16.14 Decision History
Все решения сохраняются.
Для каждого хранится:
	•	причина;
	•	входные данные;
	•	итоговое действие;
	•	исполнитель;
	•	результат;
	•	фактическая эффективность.
Это позволяет анализировать, какие стратегии работают лучше.

16.15 Conflict Resolution
Иногда одновременно возникают противоречивые рекомендации.
Например:
	•	создать новую статью;
	•	обновить существующую;
	•	усилить внутреннюю перелинковку.
Decision Engine обязан разрешить конфликт.
Для этого используется приоритет, ROI и бизнес-цели проекта.

16.16 Human Approval
Не все решения выполняются автоматически.
Поддерживаются режимы:
	•	Manual — только рекомендации;
	•	Assisted — рекомендации с подтверждением;
	•	Automatic — выполнение без участия пользователя.
Режим задаётся в настройках проекта.

16.17 Decision Events
Decision Engine публикует события:
DecisionCreated

DecisionApproved

DecisionRejected

DecisionExecuted

DecisionExpired

DecisionFailed


16.18 Decision Queue
После утверждения решение автоматически преобразуется в одну или несколько команд.
Например:
Decision

↓

Generate Article

↓

Command

↓

GenerateArticle

↓

Task Engine

Или:
Decision

↓

Improve Internal Linking

↓

GenerateLinks

↓

UpdateContent

↓

Publish


16.19 Performance Requirements
	•	Формирование решения — до 200 мс без AI.
	•	Комплексный анализ проекта — выполняется асинхронно.
	•	Повторный анализ запускается после существенных изменений Knowledge Graph или Analytics.
	•	Decision Engine не должен блокировать пользовательский интерфейс.

16.20 Инварианты
Decision Engine:
	•	не изменяет данные напрямую;
	•	не вызывает внешние API;
	•	не обращается к LLM;
	•	не публикует контент;
	•	не выполняет задачи.
Он только принимает решения и создаёт команды.

Почему эта глава важнее многих других
На этом этапе платформа перестаёт быть просто цепочкой автоматизаций.
Архитектура становится трёхуровневой:
Knowledge Engine
        │
        ▼
Decision Engine
        │
        ▼
Execution Layer
(Task Engine + AI + Publisher + Analytics)

Такое разделение даёт несколько преимуществ:
	•	Knowledge Engine отвечает за понимание состояния проекта.
	•	Decision Engine отвечает за выбор оптимального действия.
	•	Execution Layer отвечает только за выполнение.
Это позволяет независимо развивать "память", "мышление" и "исполнение" системы.