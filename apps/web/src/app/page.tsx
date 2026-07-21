'use client';

import React, { useState } from 'react';
import { useTaskStream } from '../hooks/useTaskStream';

export default function DashboardPage() {
  const { tasks, connected } = useTaskStream('http://localhost:4000');
  const [activeTab, setActiveTab] = useState<'overview' | 'semantics' | 'content' | 'knowledge' | 'decision' | 'analytics'>('overview');
  const [log, setLog] = useState<string[]>([]);

  // Project State
  const [projectName, setProjectName] = useState('');
  const [domain, setDomain] = useState('');
  const [createdProjects, setCreatedProjects] = useState<Array<{ id: string; name: string; domain: string; date: string }>>([
    { id: 'proj_demo_1', name: 'SEO SaaS Platform', domain: 'seo-saas.com', date: new Date().toLocaleDateString() }
  ]);

  // Semantics State
  const [seedKeywordsInput, setSeedKeywordsInput] = useState('');
  const [keywordsList, setKeywordsList] = useState<Array<{ id: string; term: string; vol: number; diff: number; cluster: string }>>([
    { id: 'kw_1', term: 'seo автоматизация', vol: 4800, diff: 34, cluster: 'Автоматизация SEO' },
    { id: 'kw_2', term: 'генератор статей ai', vol: 3200, diff: 42, cluster: 'AI Контент' },
    { id: 'kw_3', term: 'автоматический поиск семантики', vol: 1400, diff: 28, cluster: 'Автоматизация SEO' },
  ]);

  // Content Generation State
  const [topicInput, setTopicInput] = useState('');
  const [primaryKwInput, setPrimaryKwInput] = useState('');
  const [generatedArticles, setGeneratedArticles] = useState<Array<{ id: string; title: string; kw: string; words: number; status: string; body: string }>>([
    {
      id: 'art_demo_101',
      title: 'Топ 10 Инструментов SEO Автоматизации в 2026 году',
      kw: 'seo автоматизация',
      words: 1850,
      status: 'Опубликовано',
      body: '# Топ 10 Инструментов SEO Автоматизации в 2026 году\n\nВ современном мире SEO продвижение требует комплексного автоматического подхода...'
    }
  ]);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  // RAG Knowledge State
  const [knowledgeTitle, setKnowledgeTitle] = useState('');
  const [knowledgeContent, setKnowledgeContent] = useState('');
  const [knowledgeNodes, setKnowledgeNodes] = useState<Array<{ id: string; title: string; content: string; date: string }>>([
    { id: 'knode_1', title: 'Глоссарий бренда и tone of voice', content: 'Использовать профессиональный стиль, фокусироваться на метриках окупаемости.', date: new Date().toLocaleDateString() }
  ]);

  // Decision Engine State
  const [decisionResult, setDecisionResult] = useState<any>(null);

  const addLog = (msg: string) => {
    setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
  };

  // Handlers
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: projectName, domain, organizationId: 'org_demo_1' })
      });
      const data = await res.json();
      addLog(`[Команда отправлена] CreateProject -> ID: ${data.projectId}`);
      setCreatedProjects(prev => [{ id: data.projectId, name: projectName, domain, date: new Date().toLocaleDateString() }, ...prev]);
      setProjectName('');
      setDomain('');
    } catch (err: any) {
      addLog(`[Ошибка] ${err.message}`);
    }
  };

  const handleCollectSemantics = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      const seeds = seedKeywordsInput ? seedKeywordsInput.split(',').map(s => s.trim()) : ['seo продвижение', 'ai генератор'];
      const res = await fetch('http://localhost:4000/semantics/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: 'proj_demo_1', seedKeywords: seeds })
      });
      const data = await res.json();
      addLog(`[Команда отправлена] CollectSemantics -> Задача: ${data.taskId}`);

      // Add fresh keywords
      seeds.forEach((seed, idx) => {
        setKeywordsList(prev => [
          { id: `kw_${Date.now()}_${idx}`, term: seed, vol: Math.floor(Math.random() * 3000) + 500, diff: Math.floor(Math.random() * 40) + 15, cluster: 'Новый Кластер' },
          ...prev
        ]);
      });
      setSeedKeywordsInput('');
    } catch (err: any) {
      addLog(`[Ошибка] ${err.message}`);
    }
  };

  const handleGenerateArticle = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const topic = topicInput || 'Автоматизация SEO в 2026 году';
    const primaryKw = primaryKwInput || 'seo автоматизация';

    try {
      const res = await fetch('http://localhost:4000/content/articles/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: 'proj_demo_1', topic, primaryKeyword: primaryKw })
      });
      const data = await res.json();
      addLog(`[Команда отправлена] GenerateArticle -> Задача: ${data.taskId}`);

      const newArticle = {
        id: `art_${Date.now()}`,
        title: topic,
        kw: primaryKw,
        words: 1650,
        status: 'Сгенерировано',
        body: `# ${topic}\n\n## Введение в ${primaryKw}\nВ современном цифровом мире автоматизация процессов позволяет масштабировать трафик...`
      };
      setGeneratedArticles(prev => [newArticle, ...prev]);
      setSelectedArticle(newArticle);
      setTopicInput('');
      setPrimaryKwInput('');
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
      addLog(`[Команда отправлена] IngestKnowledge -> Узел: ${data.nodeId}`);
      setKnowledgeNodes(prev => [{ id: data.nodeId, title: knowledgeTitle, content: knowledgeContent, date: new Date().toLocaleDateString() }, ...prev]);
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
      addLog(`[Команда отправлена] EvaluateDecision -> ${data.recommendedAction}`);
    } catch (err: any) {
      addLog(`[Ошибка] ${err.message}`);
    }
  };

  const handlePublishContent = async (articleId: string) => {
    try {
      const res = await fetch('http://localhost:4000/publishers/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: 'proj_demo_1', contentAssetId: articleId })
      });
      const data = await res.json();
      addLog(`[Команда отправлена] PublishContent -> URL: ${data.externalUrl}`);
      setGeneratedArticles(prev => prev.map(a => a.id === articleId ? { ...a, status: 'Опубликовано' } : a));
    } catch (err: any) {
      addLog(`[Ошибка] ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1360px', margin: '0 auto' }}>
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
            Мультиагентная интерактивная платформа управления SEO-контентом
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

      {/* Переключатель вкладок */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {[
          { id: 'overview', name: '📊 Главная панель' },
          { id: 'semantics', name: '🔍 Семантика' },
          { id: 'content', name: '✍️ Генерация статей' },
          { id: 'knowledge', name: '📚 База знаний RAG' },
          { id: 'decision', name: '🧠 AI-Решения' },
          { id: 'analytics', name: '📈 Аналитика' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '12px 20px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              backgroundColor: activeTab === tab.id ? '#0284c7' : '#111827',
              color: activeTab === tab.id ? '#ffffff' : '#9ca3af',
              borderStyle: 'solid',
              borderWidth: '1px',
              borderColor: activeTab === tab.id ? '#38bdf8' : '#1f2937',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* ============================================================ */}
      {/* ВКЛАДКА 1: ГЛАВНАЯ ПАНЕЛЬ (OVERVIEW) */}
      {/* ============================================================ */}
      {activeTab === 'overview' && (
        <div>
          {/* Метрики */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
            {[
              { label: 'Органический трафик', val: '12,500', sub: '+14% за месяц', color: '#38bdf8' },
              { label: 'Ключевых слов в ТОП-3', val: '18 из 142', sub: 'Рост видимости +22%', color: '#10b981' },
              { label: 'Сгенерировано статей', val: `${generatedArticles.length} статей`, sub: '98% Качество SEO', color: '#a855f7' },
              { label: 'Здоровье системы', val: '94 / 100', sub: 'Очередь без задержек', color: '#f59e0b' },
            ].map((m, i) => (
              <div key={i} style={{ background: '#111827', padding: '20px', borderRadius: '12px', border: '1px solid #1f2937' }}>
                <div style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase' }}>{m.label}</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: m.color, margin: '8px 0 4px' }}>{m.val}</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>{m.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Форма быстрого создания проекта */}
            <div style={{ background: '#111827', borderRadius: '12px', padding: '24px', border: '1px solid #1f2937' }}>
              <h2 style={{ fontSize: '18px', marginTop: 0, color: '#f3f4f6' }}>Быстрое управление проектами</h2>
              <form onSubmit={handleCreateProject} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <input
                    type="text"
                    placeholder="Название проекта"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #374151', background: '#1f2937', color: '#fff' }}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Домен (напр. mysite.ru)"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #374151', background: '#1f2937', color: '#fff' }}
                    required
                  />
                </div>
                <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#0284c7', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
                  Отправить CreateProjectCommand
                </button>
              </form>

              <h3 style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '12px' }}>Активные проекты ({createdProjects.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {createdProjects.map(p => (
                  <div key={p.id} style={{ background: '#1f2937', padding: '12px 16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#f3f4f6', fontSize: '14px' }}>{p.name}</div>
                      <div style={{ fontSize: '12px', color: '#38bdf8' }}>{p.domain}</div>
                    </div>
                    <span style={{ fontSize: '11px', color: '#9ca3af', background: '#111827', padding: '4px 8px', borderRadius: '4px' }}>ID: {p.id}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SSE Стрим и Логи */}
            <div style={{ background: '#111827', borderRadius: '12px', padding: '24px', border: '1px solid #1f2937' }}>
              <h2 style={{ fontSize: '18px', marginTop: 0, color: '#f3f4f6' }}>Реалтайм Поток Задач BullMQ (SSE)</h2>
              {Object.keys(tasks).length === 0 ? (
                <div style={{ padding: '20px', background: '#1f2937', borderRadius: '8px', color: '#9ca3af', fontSize: '13px', textAlign: 'center' }}>
                  Задачи в реальном времени появятся здесь при отправке команд.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                  {Object.values(tasks).map((task) => (
                    <div key={task.taskId} style={{ background: '#1f2937', padding: '12px', borderRadius: '8px', borderLeft: `4px solid ${task.status === 'COMPLETED' ? '#10b981' : '#3b82f6'}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 600, fontSize: '13px', color: '#fff' }}>{task.taskType}</span>
                        <span style={{ fontSize: '11px', color: '#9ca3af' }}>{task.status} ({task.progress}%)</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#d1d5db', marginTop: '4px' }}>{task.message}</div>
                    </div>
                  ))}
                </div>
              )}

              <hr style={{ borderColor: '#1f2937', margin: '20px 0' }} />
              <h3 style={{ fontSize: '14px', color: '#9ca3af', margin: '0 0 10px' }}>Лог вызовов шины Command Bus</h3>
              <div style={{ background: '#030712', padding: '12px', borderRadius: '6px', maxHeight: '160px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '12px', color: '#a7f3d0' }}>
                {log.length === 0 ? <span style={{ color: '#4b5563' }}>Ожидание команд...</span> : log.map((e, i) => <div key={i} style={{ marginBottom: '4px' }}>{e}</div>)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ВКЛАДКА 2: СЕМАНТИКА (SEMANTICS) */}
      {/* ============================================================ */}
      {activeTab === 'semantics' && (
        <div style={{ background: '#111827', borderRadius: '12px', padding: '24px', border: '1px solid #1f2937' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#38bdf8' }}>🔍 Модуль сбора и кластеризации семантики (Semantic Engine)</h2>
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>Автоматический сбор ключевых слов, анализ частотности и кластеризация для контент-плана.</p>

          <form onSubmit={handleCollectSemantics} style={{ margin: '20px 0 28px', background: '#1f2937', padding: '20px', borderRadius: '10px' }}>
            <h3 style={{ fontSize: '15px', color: '#fff', marginTop: 0 }}>Запустить сбор семантики</h3>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                placeholder="Введение базовых ключей через запятую (напр. seo продвижение, ai контент)"
                value={seedKeywordsInput}
                onChange={(e) => setSeedKeywordsInput(e.target.value)}
                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #374151', background: '#111827', color: '#fff' }}
              />
              <button type="submit" style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', background: '#0d9488', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
                Запустить CollectSemanticCommand
              </button>
            </div>
          </form>

          <h3 style={{ fontSize: '16px', color: '#f3f4f6', marginBottom: '14px' }}>Собраные ключевые слова и кластеры ({keywordsList.length})</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#1f2937', borderRadius: '8px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: '#111827', color: '#9ca3af', textAlign: 'left', fontSize: '13px' }}>
                <th style={{ padding: '12px 16px' }}>Ключевая фраза</th>
                <th style={{ padding: '12px 16px' }}>Частотность (Поисков/мес)</th>
                <th style={{ padding: '12px 16px' }}>Сложность (Difficulty)</th>
                <th style={{ padding: '12px 16px' }}>Кластер</th>
              </tr>
            </thead>
            <tbody>
              {keywordsList.map((kw) => (
                <tr key={kw.id} style={{ borderBottom: '1px solid #374151', color: '#e5e7eb', fontSize: '14px' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{kw.term}</td>
                  <td style={{ padding: '12px 16px', color: '#38bdf8' }}>{kw.vol.toLocaleString()}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: kw.diff > 35 ? '#7f1d1d' : '#064e3b', color: kw.diff > 35 ? '#fca5a5' : '#6ee7b7', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                      {kw.diff} / 100
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#a855f7' }}>{kw.cluster}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ============================================================ */}
      {/* ВКЛАДКА 3: ГЕНЕРАЦИЯ СТАТЕЙ (CONTENT) */}
      {/* ============================================================ */}
      {activeTab === 'content' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Форма создания */}
          <div style={{ background: '#111827', borderRadius: '12px', padding: '24px', border: '1px solid #1f2937' }}>
            <h2 style={{ fontSize: '20px', marginTop: 0, color: '#4f46e5' }}>✍️ Модуль генерации статей (Content Engine)</h2>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>Мультистадийное создание контента с оптимизацией под поисковые запросы.</p>

            <form onSubmit={handleGenerateArticle} style={{ margin: '20px 0' }}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>Тема статьи</label>
                <input
                  type="text"
                  placeholder="напр. Автоматизация SEO продвижения в 2026 году"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #374151', background: '#1f2937', color: '#fff', boxSizing: 'border-box' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>Главный ключевой запрос</label>
                <input
                  type="text"
                  placeholder="напр. seo автоматизация"
                  value={primaryKwInput}
                  onChange={(e) => setPrimaryKwInput(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #374151', background: '#1f2937', color: '#fff', boxSizing: 'border-box' }}
                  required
                />
              </div>
              <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#4f46e5', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
                Сгенерировать статью (GenerateArticleCommand)
              </button>
            </form>

            <h3 style={{ fontSize: '15px', color: '#f3f4f6', marginBottom: '12px' }}>Список статей ({generatedArticles.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {generatedArticles.map((art) => (
                <div
                  key={art.id}
                  onClick={() => setSelectedArticle(art)}
                  style={{
                    background: selectedArticle?.id === art.id ? '#1e1b4b' : '#1f2937',
                    border: `1px solid ${selectedArticle?.id === art.id ? '#6366f1' : '#374151'}`,
                    padding: '14px',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 600, color: '#fff', fontSize: '14px' }}>{art.title}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#9ca3af' }}>{art.words} слов | Ключ: {art.kw}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handlePublishContent(art.id); }}
                      style={{ padding: '6px 12px', borderRadius: '4px', border: 'none', background: art.status === 'Опубликовано' ? '#059669' : '#0284c7', color: '#fff', fontSize: '12px', cursor: 'pointer' }}
                    >
                      {art.status}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Редактор / Предпросмотр статьи */}
          <div style={{ background: '#111827', borderRadius: '12px', padding: '24px', border: '1px solid #1f2937' }}>
            <h2 style={{ fontSize: '18px', marginTop: 0, color: '#f3f4f6' }}>Предпросмотр контента</h2>
            {selectedArticle ? (
              <div>
                <div style={{ background: '#1f2937', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>Статус: <strong style={{ color: '#10b981' }}>{selectedArticle.status}</strong></div>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>Объем: {selectedArticle.words} слов</div>
                  </div>
                  <button onClick={() => handlePublishContent(selectedArticle.id)} style={{ padding: '8px 16px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
                    Опубликовать в CMS
                  </button>
                </div>
                <div style={{ background: '#030712', padding: '20px', borderRadius: '8px', fontFamily: 'sans-serif', whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#d1d5db', fontSize: '14px', maxHeight: '420px', overflowY: 'auto' }}>
                  {selectedArticle.body}
                </div>
              </div>
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
                Выберите статью из списка слева для предпросмотра.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ВКЛАДКА 4: БАЗА ЗНАНИЙ RAG (KNOWLEDGE) */}
      {/* ============================================================ */}
      {activeTab === 'knowledge' && (
        <div style={{ background: '#111827', borderRadius: '12px', padding: '24px', border: '1px solid #1f2937' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#a855f7' }}>📚 Модуль Базы Знаний RAG (Knowledge Engine)</h2>
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>Индексация уникальных знаний бренда, правил и контекста компании для контекстной подсказки AI.</p>

          <form onSubmit={handleIngestKnowledge} style={{ margin: '20px 0 28px', background: '#1f2937', padding: '20px', borderRadius: '10px' }}>
            <h3 style={{ fontSize: '15px', color: '#fff', marginTop: 0 }}>Индексировать новый узел знаний</h3>
            <input
              type="text"
              placeholder="Заголовок узла (напр. Tone of Voice компании)"
              value={knowledgeTitle}
              onChange={(e) => setKnowledgeTitle(e.target.value)}
              style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #374151', background: '#111827', color: '#fff', boxSizing: 'border-box' }}
              required
            />
            <textarea
              placeholder="Содержимое знаний для подмешивания в промпты AI..."
              value={knowledgeContent}
              onChange={(e) => setKnowledgeContent(e.target.value)}
              rows={3}
              style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #374151', background: '#111827', color: '#fff', boxSizing: 'border-box' }}
              required
            />
            <button type="submit" style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', background: '#9333ea', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
              Отправить IngestKnowledgeCommand
            </button>
          </form>

          <h3 style={{ fontSize: '16px', color: '#f3f4f6', marginBottom: '14px' }}>Проиндексированные узлы знаний ({knowledgeNodes.length})</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {knowledgeNodes.map(node => (
              <div key={node.id} style={{ background: '#1f2937', padding: '16px', borderRadius: '10px', border: '1px solid #374151' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600, color: '#e9d5ff', fontSize: '15px' }}>{node.title}</span>
                  <span style={{ fontSize: '11px', color: '#a855f7', background: '#3b0764', padding: '2px 8px', borderRadius: '4px' }}>{node.id}</span>
                </div>
                <div style={{ fontSize: '13px', color: '#d1d5db', lineHeight: '1.5' }}>{node.content}</div>
                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '10px' }}>Добавлено: {node.date}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ВКЛАДКА 5: AI-РЕШЕНИЯ (DECISION ENGINE) */}
      {/* ============================================================ */}
      {activeTab === 'decision' && (
        <div style={{ background: '#111827', borderRadius: '12px', padding: '24px', border: '1px solid #1f2937' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#ea580c' }}>🧠 Модуль автономного принятия решений (Decision Engine)</h2>
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>Автономный анализ текущих проблем сайта и выработка приоритетных целевых действий.</p>

          <div style={{ margin: '24px 0' }}>
            <button onClick={handleEvaluateDecision} style={{ padding: '14px 28px', borderRadius: '8px', border: 'none', background: '#ea580c', color: '#fff', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}>
              Запустить анализ сайта и выработать решение (EvaluateProjectNextStepCommand)
            </button>
          </div>

          {decisionResult ? (
            <div style={{ background: '#1f2937', border: '1px solid #ea580c', padding: '24px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{ background: '#ea580c', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}>AI ВЕРДИКТ</span>
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#ffedd5' }}>Рекомендуемое действие: {decisionResult.recommendedAction}</span>
              </div>
              <div style={{ fontSize: '14px', color: '#fed7aa', marginBottom: '16px' }}>Причина: {decisionResult.reason}</div>
              <button onClick={() => { setActiveTab('semantics'); handleCollectSemantics(); }} style={{ padding: '10px 20px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
                Выполнить рекомендованное действие
              </button>
            </div>
          ) : (
            <div style={{ padding: '30px', background: '#1f2937', borderRadius: '8px', color: '#9ca3af', fontSize: '14px', textAlign: 'center' }}>
              Нажмите кнопку выше для запуски анализа и формирования рекомендаций.
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* ВКЛАДКА 6: АНАЛИТИКА (ANALYTICS) */}
      {/* ============================================================ */}
      {activeTab === 'analytics' && (
        <div style={{ background: '#111827', borderRadius: '12px', padding: '24px', border: '1px solid #1f2937' }}>
          <h2 style={{ fontSize: '20px', marginTop: 0, color: '#10b981' }}>📈 Модуль аналитики и отчетов (Analytics Engine)</h2>
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>Отслеживание позиций ключевых слов, трафика и эффективности контента.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', margin: '24px 0' }}>
            <div style={{ background: '#1f2937', padding: '20px', borderRadius: '10px', borderLeft: '4px solid #38bdf8' }}>
              <div style={{ fontSize: '13px', color: '#9ca3af' }}>Проиндексировано страниц</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff', margin: '6px 0' }}>45 страниц</div>
              <div style={{ fontSize: '12px', color: '#10b981' }}>100% покрытие роботом</div>
            </div>
            <div style={{ background: '#1f2937', padding: '20px', borderRadius: '10px', borderLeft: '4px solid #10b981' }}>
              <div style={{ fontSize: '13px', color: '#9ca3af' }}>Средняя позиция в поиске</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff', margin: '6px 0' }}>8.4</div>
              <div style={{ fontSize: '12px', color: '#10b981' }}>Улучшение на +3.2 пункта</div>
            </div>
            <div style={{ background: '#1f2937', padding: '20px', borderRadius: '10px', borderLeft: '4px solid #a855f7' }}>
              <div style={{ fontSize: '13px', color: '#9ca3af' }}>Конверсия в целевое действие</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff', margin: '6px 0' }}>3.8%</div>
              <div style={{ fontSize: '12px', color: '#a855f7' }}>+470 лидов с статей</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
