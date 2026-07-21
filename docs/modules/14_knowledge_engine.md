ГЛАВА 14

ГЛАВА 14
KNOWLEDGE ENGINE SPECIFICATION
Это не просто очередной модуль.
Это ядро всей платформы.

Проблема большинства SEO-сервисов
Практически все работают так:
Keyword

↓

Cluster

↓

Article

↓

Published

После публикации цепочка заканчивается.
Система "забывает", что произошло.
Она не знает:
	•	какие знания уже покрыты;
	•	где есть пробелы;
	•	какие статьи усиливают друг друга;
	•	какие темы являются базовыми;
	•	какие требуют обновления.

Поэтому появляется новый слой
Не Database.
Не Articles.
Не Keywords.
А именно
KNOWLEDGE


Новый принцип архитектуры
Все сервисы работают не друг с другом.
Все работают
через
Knowledge Engine.

Вместо
Semantic

↓

Planning

↓

Content

↓

Analytics

становится
            Knowledge

        ↑      ↑      ↑

Semantic  Content Analytics

        ↓      ↓      ↓

 Planning Publisher AI

Это изменение полностью меняет архитектуру.

Что вообще хранит Knowledge Engine?
Не статьи.
Не ключевые слова.
Он хранит
модель предметной области сайта.

Например.
Тематика
SEO

не статья.
А
Knowledge Node.

Дальше.
Technical SEO

ещё один Node.

Internal Linking

Node.

Schema

Node.

Canonical

Node.

Robots.txt

Node.

Между ними существуют связи.
SEO

├── Technical SEO

├── Content SEO

├── Local SEO

├── Ecommerce SEO

└── Analytics

Это уже Knowledge Graph.

Но этого мало
Теперь каждая статья
не просто Article.
Она становится
реализацией одного или нескольких узлов графа.
Например.
Article

↓

covers

↓

Technical SEO

или
Article

↓

covers

↓

Canonical

↓

Robots

↓

Sitemap


Тогда появляется показатель
Coverage.
Не
150 статей

А
Knowledge Coverage

67%

Это уже совершенно другой уровень аналитики.

Следующий слой
Entity
Я бы вообще отказался считать Keyword главной сущностью.
Главная сущность
не Keyword.
А Entity.
Например.
Google Search Console

Entity.

Canonical URL

Entity.

E-E-A-T

Entity.

301 Redirect

Entity.

PageRank

Entity.

Тогда Keyword становится
одним из способов найти Entity.

То есть
Keyword

↓

Entity

а не наоборот.

Тогда Semantic Engine меняется
Он уже не собирает ключи.
Он строит
Entity Graph.
Например.
robots txt

robots.txt

robot txt

robotstxt

robots file

↓
Entity

ROBOTS_TXT

Вот это очень сильная архитектура.

Следующий слой
Intent.
Сейчас Intent относится к Keyword.
Я бы изменил.
Intent относится к Entity.
Например.
Canonical

↓

Informational

Commercial

Navigational

Transactional


Потом
Topic.
Topic уже становится
не кластером ключей.
А
Knowledge Goal.
Например.
How Canonical Works

закрывает
Canonical URL


Тогда статья становится
Knowledge Asset

А не просто текстом.

Она имеет
Coverage

Authority

Quality

Freshness

Completeness

Evidence


После этого появляется
Topic Authority.
Например.
SEO

83%


Почему?
Потому что
Technical SEO

100%

Content SEO

80%

Local SEO

25%

Analytics

60%

Средний показатель
83%.

Теперь AI знает
что делать дальше.
Не
Напиши статью

а
Усиль Local SEO.

Покрытие слишком маленькое.


Следующий слой
Knowledge Gap.
Он вычисляется автоматически.
Например.
Есть
100 Entity

Покрыто
63

Получаем
Gap

37


Дальше.
Каждый Gap получает
ROI.
Например.
Local SEO

Traffic

9800

Competition

Low

Authority

10%

ROI

95


Planning Engine
получает
не список ключей.
А
Knowledge Gaps

↓

ROI

↓

Priority


Именно так строится стратегия.

Следующий слой
Internal Linking.
Он тоже становится частью Knowledge.
Например.
Canonical

↓

links_to

↓

Robots

↓

Sitemap

AI сам понимает
куда поставить ссылку.

Следующий слой
Freshness.
Каждый Node имеет
Updated

Last Crawled

Last Published

Traffic

CTR

Impressions

Clicks

Если прошло
например
300 дней
Node становится
Stale


AI получает
Refresh Required


Следующий слой
Evidence.
Очень интересная идея.
Каждый Knowledge Node имеет
Evidence

Google Docs

RFC

Google Search Central

Schema.org

Own Articles

То есть AI знает
откуда брать факты.

И вот здесь рождается настоящий интеллект
Не
Write Article

А
Goal

↓

Knowledge Gap

↓

Retrieve Context

↓

Evidence

↓

Prompt Builder

↓

Generate

↓

Validate

↓

Coverage Updated

ГЛАВА 15

ГЛАВА 15
KNOWLEDGE GRAPH ARCHITECTURE SPECIFICATION
Module ID: KNOW-001
Module: Knowledge Engine
Version: 1.0
Status: Approved

15.1 Назначение
Knowledge Graph — это единый источник истины (Single Source of Truth) обо всём, что известно платформе о проекте.
Он описывает:
	•	тематику сайта;
	•	структуру знаний;
	•	связи между сущностями;
	•	покрытие тем;
	•	внутренние связи;
	•	опубликованный контент;
	•	авторитетность разделов;
	•	пробелы знаний.
Все остальные модули читают данные именно отсюда.

15.2 Главный принцип
В платформе запрещено принимать решения на основании только одного источника данных.
Например.
Нельзя решить
написать новую статью
только потому что найден новый Keyword.
Решение должно приниматься после анализа:
	•	Knowledge Graph;
	•	существующего контента;
	•	истории публикаций;
	•	покрытия темы;
	•	аналитики;
	•	бизнес-целей проекта.

15.3 Базовые объекты графа
Graph состоит всего из двух вещей.
Node

Edge

Никаких других объектов граф не знает.

15.4 Node Types
Каждый узел имеет тип.
Project

Domain

Category

Topic

Entity

Concept

Intent

Content Asset

Keyword

SERP Feature

Question

FAQ

Brand

Person

Location

Service

Product

Event

Все новые типы должны регистрироваться в каталоге Node Types.

15.5 Почему Entity важнее Keyword
Keyword —
это только поисковая формулировка.
Entity —
реальный объект знания.
Например.
Keyword

seo canonical

Keyword

canonical url

Keyword

что такое canonical

↓
Все они относятся к
Entity

Canonical URL

Поэтому все вычисления выполняются относительно Entity.

15.6 Edge Types
Связи тоже типизированы.
belongs_to

part_of

parent_of

child_of

related_to

references

depends_on

duplicates

covers

mentions

generated_from

published_as

links_to

supports

contradicts

requires


15.7 Структура Node
id

projectId

type

title

slug

description

language

status

authorityScore

coverageScore

qualityScore

freshnessScore

importance

embeddingId

createdAt

updatedAt


15.8 Структура Edge
id

projectId

fromNode

toNode

relation

weight

confidence

createdAt


15.9 Weight
Каждая связь имеет вес.
Например.
SEO

↓

Technical SEO

0.98

Technical SEO

↓

Canonical

0.82

Canonical

↓

Robots

0.40

Вес используется при:
	•	построении стратегии;
	•	расчёте покрытия;
	•	поиске связанных материалов;
	•	генерации внутренних ссылок.

15.10 Confidence
Кроме веса хранится
достоверность.
Например.
0.99

из официальной документации

или
0.55

получено AI


15.11 Embeddings
Каждый Node обязан иметь embedding.
Он нужен для:
	•	Similarity Search;
	•	Semantic Search;
	•	Retrieval;
	•	AI Context Builder.
Embedding никогда не хранится внутри Firestore.
Firestore содержит только ссылку.

15.12 Similarity
Любые два Node имеют коэффициент похожести.
Например.
Canonical

Robots

0.67

Canonical

Redirect

0.92

Canonical

Google Ads

0.08

Planning Engine использует этот показатель для обнаружения дублирования тем.

15.13 Coverage Model
Самый важный показатель платформы.
Каждый Node имеет
Coverage Score.
Например.
Technical SEO

72%

Он вычисляется из:
	•	количества опубликованных материалов;
	•	глубины раскрытия темы;
	•	полноты подтем;
	•	качества материалов;
	•	внутренней перелинковки;
	•	пользовательских сигналов.

15.14 Authority Score
Каждая тема получает собственный авторитет.
Не Page Authority.
Не Domain Authority.
А внутренний показатель платформы.
Учитываются:
	•	полнота раскрытия темы;
	•	число связанных материалов;
	•	актуальность;
	•	экспертность;
	•	качество источников;
	•	внешние ссылки (в будущих версиях).

15.15 Freshness
Все узлы стареют.
Например.
lastUpdated

lastPublished

lastValidated

lastTraffic

Через заданный период Node автоматически получает понижающий коэффициент.
Это позволяет AI понимать, какие темы требуют обновления.

15.16 Evidence
Каждый Node хранит доказательства.
Google Search Central

Schema.org

RFC

Wikipedia

Official Docs

Own Articles

Customer Docs

AI получает возможность строить ответы на основе проверенных источников, а не только генерации.

15.17 Graph Builder
Knowledge Graph не создаётся сразу.
Он строится постепенно.
Website

↓

Pages

↓

Keywords

↓

Entities

↓

Topics

↓

Relations

↓

Graph

Каждый этап публикует события.

15.18 Graph Update Strategy
Граф никогда не пересоздаётся полностью.
Используется инкрементальное обновление.
Изменение страницы приводит только к пересчёту связанных узлов и рёбер.
Это критично для больших проектов с десятками тысяч страниц.

15.19 Graph Versioning
Каждое значимое изменение создаёт новую версию графа.
Knowledge Graph v15

↓

Knowledge Graph v16

Это позволяет:
	•	откатываться к предыдущим версиям;
	•	сравнивать изменения;
	•	анализировать влияние стратегии на структуру знаний.

15.20 Graph Queries
Knowledge Engine предоставляет собственный API запросов.
Например:
	•	найти все связанные темы;
	•	определить пробелы знаний;
	•	получить соседние узлы;
	•	найти лучший маршрут внутренних ссылок;
	•	определить дубли;
	•	получить рекомендованные материалы для усиления темы.

15.21 Graph Algorithms
Knowledge Engine реализует набор встроенных алгоритмов.
Минимальный набор:
	•	поиск кратчайшего пути;
	•	поиск компонент связности;
	•	обнаружение циклов;
	•	кластеризация;
	•	поиск похожих сущностей;
	•	вычисление центральности узлов;
	•	определение тематических сообществ;
	•	распространение весов по графу.
Эти алгоритмы используются Planning Engine, Content Engine и Analytics Engine.

15.22 Knowledge Events
Knowledge Engine публикует собственные события.
KnowledgeNodeCreated

KnowledgeNodeUpdated

KnowledgeEdgeCreated

KnowledgeGraphUpdated

CoverageCalculated

AuthorityUpdated

KnowledgeGapDetected

InternalLinksSuggested

GraphVersionCreated


15.23 Performance Requirements
	•	Поиск узла — до 50 мс.
	•	Получение соседних узлов — до 100 мс.
	•	Инкрементальное обновление графа — менее 1 секунды.
	•	Полный пересчёт графа — допускается как фоновая задача.
	•	Все сложные вычисления выполняются асинхронно через Task Engine.

Итог главы
После этой главы Knowledge Engine перестаёт быть абстрактной идеей и становится полноценным инженерным модулем с чёткой моделью данных, алгоритмами, событиями и правилами работы.