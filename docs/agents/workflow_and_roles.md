# Архитектурный план и состав команды (Ревизия 2: TS/NestJS + CQRS)

## ШАГ 1: АНАЛИЗ
- **Парадигма:** Project First.
- **Архитектура:** Modular Monolith, DDD, CQRS, Event-Driven, Queue First, API First, Reactive UI.
- **Стек:** TypeScript, NestJS, Next.js, PostgreSQL, Redis, BullMQ.

## ШАГ 2: ФАЗЫ РАЗРАБОТКИ (WORKFLOW)
**Фаза 1: Инфраструктура и CQRS Foundation**
[Agent-Core] инициализирует NestJS, БД, BullMQ, `Command Bus` и `Event Bus`. [Agent-Critic] проверяет "тупость" контроллеров.

**Фаза 2: Бизнес-логика (Домены)**
[Agent-AI] создает домены и пишет Command Handlers. Каждое завершение задачи генерирует событие в `Event Bus`. [Agent-Critic] блокирует прямые вызовы между доменами.

**Фаза 3: Реактивный Frontend**
[Agent-UI] строит интерфейс, слушает SSE (Server-Sent Events) для получения статусов задач (`taskId`).

**Фаза 4: Оркестрация и E2E Аудит**
Сквозное тестирование всего флоу.
