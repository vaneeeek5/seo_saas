'use client';

import React, { useState } from 'react';
import { useTaskStream } from '../hooks/useTaskStream';

export default function DashboardPage() {
  const { tasks, connected } = useTaskStream('http://localhost:4000');
  const [projectName, setProjectName] = useState('');
  const [domain, setDomain] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'semantics' | 'content' | 'knowledge' | 'decision' | 'analytics'>('overview');
  const [log, setLog] = useState<string[]>([]);

  // Knowledge Form State
  const [knowledgeTitle, setKnowledgeTitle] = useState('');
  const [knowledgeContent, setKnowledgeContent] = useState('');

  // Decision State
  const [decisionResult, setDecisionResult] = useState<any>(null);

  const addLog = (msg: string) => {
    setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: projectName, domain, organizationId: 'org_demo_1' })
      });
      const data = await res.json();
      addLog(`[Команда отправлена] CreateProject -> ID Проекта: ${data.projectId}`);
      setProjectName('');
      setDomain('');
    } catch (err: any) {
      addLog(`[Ошибка] ${err.message}`);
    }
  };

  const handleCollectSemantics = async () => {
    try {
      const res = await fetch('http://localhost:4000/semantics/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: 'proj_demo_1', seedKeywords: ['seo продвижение saas', 'генерация контента ai'] })
      });
      const data = await res.json();
      addLog(`[Команда отправлена] CollectSemantics -> Задача: ${data.taskId}`);
    } catch (err: any) {
      addLog(`[Ошибка] ${err.message}`);
    }
  };

  const handleGenerateArticle = async () => {
    try {
      const res = await fetch('http://localhost:4000/content/articles/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: 'proj_demo_1', topic: 'Топ 10 Инструментов SEO Автоматизации в 2026 году', primaryKeyword: 'seo автоматизация' })
      });
      const data = await res.json();
      addLog(`[Команда отправлена] GenerateArticle -> Задача: ${data.taskId}`);
    } catch (err: any) {
      addLog(`[Ошибка] ${err.message}`);
    }
  };

  const handleIngestKnowledge = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/knowledge/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: 'proj_demo_1', title: knowledgeTitle, content: knowledgeContent })
      });
      const data = await res.json();
      addLog(`[Команда отправлена] IngestKnowledge -> Узел знаний: ${data.nodeId}`);
      setKnowledgeTitle('');
      setKnowledgeContent('');
    } catch (err: any) {
      addLog(`[Ошибка] ${err.message}`);
    }
  };

  const handleEvaluateDecision = async () => {
    try {
      const res = await fetch('http://localhost:4000/decision/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: 'proj_demo_1' })
      });
      const data = await res.json();
      setDecisionResult(data);
      addLog(`[Команда отправлена] EvaluateDecision -> Рекомендация: ${data.recommendedAction}`);
    } catch (err: any) {
      addLog(`[Ошибка] ${err.message}`);
    }
  };

  const handlePublishContent = async () => {
    try {
      const res = await fetch('http://localhost:4000/publishers/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: 'proj_demo_1', contentAssetId: 'art_demo_101' })
      });
      const data = await res.json();
      addLog(`[Команда отправлена] PublishContent -> Опубликовано: ${data.externalUrl}`);
    } catch (err: any) {
      addLog(`[Ошибка] ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Шапка */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #1f2937',
        paddingBottom: '20px',
        marginBottom: '28px'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: '#38bdf8' }}>
            SEO Content Factory OS
          </h1>
          <p style={{ margin: '4px 0 0', color: '#9ca3af', fontSize: '14px' }}>
            Мультиагентная автономная платформа управления SEO-контентом
          </p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: '#111827',
          padding: '8px 16px',
          borderRadius: '9999px',
          border: '1px solid #374151'
        }}>
          <span style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: connected ? '#10b981' : '#ef4444'
          }} />
          <span style={{ fontSize: '13px', color: '#d1d5db' }}>
            SSE Стрим: {connected ? 'Подключено (Live)' : 'Отключено'}
          </span>
        </div>
      </header>

      {/* Аналитические виджеты */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Органический трафик', val: '12,500', sub: '+14% за последний месяц', color: '#38bdf8' },
          { label: 'Ключевых слов в ТОП-3', val: '18 из 142', sub: 'Рост видимости +22%', color: '#10b981' },
          { label: 'Сгенерировано статей', val: '24 статьи', sub: '98% Качество SEO', color: '#a855f7' },
          { label: 'Здоровье системы', val: '94 / 100', sub: 'Очередь без задержек', color: '#f59e0b' },
        ].map((m, i) => (
          <div key={i} style={{ background: '#111827', padding: '18px', borderRadius: '10px', border: '1px solid #1f2937' }}>
            <div style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase' }}>{m.label}</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: m.color, margin: '6px 0 2px' }}>{m.val}</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Навигация по вкладкам */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {[
          { id: 'overview', name: 'Главная панель' },
          { id: 'semantics', name: 'Семантика' },
          { id: 'content', name: 'Генерация статей' },
          { id: 'knowledge', name: 'База знаний RAG' },
          { id: 'decision', name: 'AI-Решения' },
          { id: 'analytics', name: 'Аналитика' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13px',
              backgroundColor: activeTab === tab.id ? '#0284c7' : '#1f2937',
              color: activeTab === tab.id ? '#ffffff' : '#9ca3af'
            }}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Основная сетка */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Левая колонка: Управление и команды */}
        <div style={{ background: '#111827', borderRadius: '12px', padding: '24px', border: '1px solid #1f2937' }}>
          <h2 style={{ fontSize: '18px', marginTop: 0, color: '#f3f4f6' }}>Панель отправки команд (Command Bus)</h2>
          
          {/* Форма создания проекта */}
          <form onSubmit={handleCreateProject} style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', color: '#38bdf8', marginBottom: '10px' }}>Управление Проектами</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="Название проекта"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #374151', background: '#1f2937', color: '#fff' }}
                required
              />
              <input
                type="text"
                placeholder="Домен (напр. mysite.ru)"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #374151', background: '#1f2937', color: '#fff' }}
                required
              />
            </div>
            <button type="submit" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
              Создать проект (CreateProjectCommand)
            </button>
          </form>

          <hr style={{ borderColor: '#1f2937', margin: '18px 0' }} />

          {/* Форма RAG Базы Знаний */}
          <form onSubmit={handleIngestKnowledge} style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', color: '#a855f7', marginBottom: '10px' }}>Индексация в Базу Знаний (RAG Engine)</h3>
            <input
              type="text"
              placeholder="Заголовок документа / знаний"
              value={knowledgeTitle}
              onChange={(e) => setKnowledgeTitle(e.target.value)}
              style={{ width: '100%', padding: '10px', marginBottom: '8px', borderRadius: '6px', border: '1px solid #374151', background: '#1f2937', color: '#fff', boxSizing: 'border-box' }}
              required
            />
            <textarea
              placeholder="Текст или правила бренда для AI..."
              value={knowledgeContent}
              onChange={(e) => setKnowledgeContent(e.target.value)}
              rows={2}
              style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #374151', background: '#1f2937', color: '#fff', boxSizing: 'border-box' }}
              required
            />
            <button type="submit" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: 'none', background: '#9333ea', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
              Добавить в базу знаний (IngestKnowledgeCommand)
            </button>
          </form>

          <hr style={{ borderColor: '#1f2937', margin: '18px 0' }} />

          {/* Движки и триггеры */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button onClick={handleCollectSemantics} style={{ padding: '12px', borderRadius: '6px', border: 'none', background: '#0d9488', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
              Сбор семантики
            </button>
            <button onClick={handleGenerateArticle} style={{ padding: '12px', borderRadius: '6px', border: 'none', background: '#4f46e5', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
              Сгенерировать статью
            </button>
            <button onClick={handleEvaluateDecision} style={{ padding: '12px', borderRadius: '6px', border: 'none', background: '#ea580c', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
              Выработать AI-решение
            </button>
            <button onClick={handlePublishContent} style={{ padding: '12px', borderRadius: '6px', border: 'none', background: '#059669', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
              Опубликовать в CMS
            </button>
          </div>
        </div>

        {/* Правая колонка: Реалтайм поток задач и лог */}
        <div style={{ background: '#111827', borderRadius: '12px', padding: '24px', border: '1px solid #1f2937' }}>
          {/* Карточка AI Решения */}
          {decisionResult && (
            <div style={{ background: '#7c2d12', padding: '14px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ea580c' }}>
              <div style={{ fontWeight: 700, color: '#ffedd5', fontSize: '14px' }}>Рекомендация AI-Движка Decisions</div>
              <div style={{ fontSize: '13px', color: '#fed7aa', marginTop: '4px' }}>Рекомендуемое действие: {decisionResult.recommendedAction}</div>
              <div style={{ fontSize: '12px', color: '#fdba74', marginTop: '2px' }}>Причина: {decisionResult.reason}</div>
            </div>
          )}

          <h2 style={{ fontSize: '18px', marginTop: 0, color: '#f3f4f6' }}>Реалтайм Поток Задач BullMQ (SSE Stream)</h2>
          
          {Object.keys(tasks).length === 0 ? (
            <p style={{ color: '#6b7280', fontSize: '14px' }}>Задачи пока не выполняются. Нажмите любую кнопку слева для запуска процесса.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '220px', overflowY: 'auto' }}>
              {Object.values(tasks).map((task) => (
                <div key={task.taskId} style={{ background: '#1f2937', padding: '12px', borderRadius: '8px', borderLeft: `4px solid ${task.status === 'COMPLETED' ? '#10b981' : '#3b82f6'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, fontSize: '13px', color: '#f9fafb' }}>{task.taskType}</span>
                    <span style={{ fontSize: '11px', color: '#9ca3af' }}>{task.status} ({task.progress}%)</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#d1d5db' }}>{task.message}</div>
                </div>
              ))}
            </div>
          )}

          <hr style={{ borderColor: '#1f2937', margin: '20px 0' }} />

          <h3 style={{ fontSize: '14px', color: '#9ca3af' }}>Лог вызовов шины Command Bus</h3>
          <div style={{ background: '#030712', padding: '12px', borderRadius: '6px', maxHeight: '150px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '12px', color: '#a7f3d0' }}>
            {log.length === 0 ? (
              <span style={{ color: '#4b5563' }}>Лог команд пуст...</span>
            ) : (
              log.map((entry, idx) => <div key={idx} style={{ marginBottom: '4px' }}>{entry}</div>)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
