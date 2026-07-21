ADR-006
AI Orchestrator
Контекст
Необходимо обеспечить независимость системы от конкретной AI-модели.
Решение
Все обращения к языковым моделям выполняются через AI Orchestrator.
Последствия
Content Engine не знает о Gemini.
Humanizer не знает о GPT.
Media Engine не знает о Nano Banana.
Все они обращаются к одному интерфейсу.