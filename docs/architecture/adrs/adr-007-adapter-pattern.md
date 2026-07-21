ADR-007
Adapter Pattern
Контекст
Поддержка нескольких CMS и внешних сервисов.
Решение
Все интеграции реализуются через адаптеры.
Publisher

↓

Publisher Adapter

↓

WordPress

Publisher

↓

Publisher Adapter

↓

Tilda

Publisher

↓

Publisher Adapter

↓

Custom API

Последствия
Добавление новой CMS не требует изменения Publisher.