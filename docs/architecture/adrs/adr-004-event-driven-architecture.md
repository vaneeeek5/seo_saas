ADR-004
Event Driven Architecture
Контекст
Длинные цепочки вызовов плохо масштабируются.
Решение
Все процессы запускаются событиями.
Пример
WebsiteCrawled

↓

SemanticStarted

↓

SemanticCompleted

↓

PlanningStarted

↓

PlanningCompleted

↓

ContentGenerationStarted

↓

ContentGenerated

Последствия
Каждый модуль публикует события.
Каждый модуль подписывается только на необходимые события.