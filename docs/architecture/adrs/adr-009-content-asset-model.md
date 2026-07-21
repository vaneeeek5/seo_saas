ADR-009
Content Asset Model
Контекст
Архитектура не должна ограничиваться только статьями.
Решение
Ввести универсальную сущность Content Asset.
Типы:
	•	Article
	•	Category Page
	•	Landing Page
	•	FAQ
	•	Glossary
	•	Product Page
	•	Comparison Page
	•	News
Последствия
Все модули работают с Content Asset.
Article становится одним из типов.
Это позволяет расширять платформу без изменения архитектуры.