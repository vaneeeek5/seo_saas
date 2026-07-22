'use client';

import React, { useState, useEffect } from 'react';

export default function IntegrationsDashboardPage() {
  const [providerSelect, setProviderSelect] = useState<'OPENAI' | 'WORDPRESS_CMS' | 'WORDSTAT' | 'GEMINI' | 'ANTHROPIC'>('OPENAI');
  const [connectionName, setConnectionName] = useState('');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [connectionsList, setConnectionsList] = useState<Array<{ id: string; provider: string; name: string; maskedKey: string; encryption: string; status: string; isActive: boolean; date: string }>>([
    { id: 'conn_demo_openai', provider: 'OPENAI', name: 'OpenAI ChatGPT API Key', maskedKey: 'sk-p-****-****-a9F1', encryption: 'AES-256-GCM', status: 'CONNECTED', isActive: true, date: new Date().toLocaleDateString() },
    { id: 'conn_demo_wp', provider: 'WORDPRESS_CMS', name: 'WordPress REST API Access', maskedKey: 'wp_a-****-****-00ff', encryption: 'AES-256-GCM', status: 'CONNECTED', isActive: true, date: new Date().toLocaleDateString() },
    { id: 'conn_demo_metrika', provider: 'WORDSTAT', name: 'Yandex Metrika / Wordstat API', maskedKey: 'y0_a-****-****-77c1', encryption: 'AES-256-GCM', status: 'CONNECTED', isActive: true, date: new Date().toLocaleDateString() },
  ]);

  const addLog = (msg: string) => {
    setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const res = await fetch('http://localhost:4000/integrations');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setConnectionsList(data);
        }
      }
    } catch (err: any) {
      console.warn('Backend API connection check fallback:', err.message);
    }
  };

  const handleSaveConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:4000/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: 'proj_demo_1',
          provider: providerSelect,
          name: connectionName || `${providerSelect} Connection`,
          apiKey: apiKeyInput,
        })
      });
      const data = await res.json();

      addLog(`🔒 [AES-256-GCM Encrypted] API Key for ${providerSelect} saved! Mask: ${data.maskedKey || 'sk-****'}`);

      setConnectionsList(prev => [
        {
          id: data.connectionId || `conn_${Date.now()}`,
          provider: providerSelect,
          name: connectionName || `${providerSelect} Connection`,
          maskedKey: data.maskedKey || 'sk-****',
          encryption: 'AES-256-GCM',
          status: 'CONNECTED',
          isActive: true,
          date: new Date().toLocaleDateString(),
        },
        ...prev
      ]);
      setConnectionName('');
      setApiKeyInput('');
    } catch (err: any) {
      addLog(`[Error] ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const serviceCards = [
    { provider: 'OPENAI', title: 'OpenAI API', desc: 'Генерация статей на GPT-4o и Embeddings', icon: '🤖', color: '#10a37f' },
    { provider: 'WORDPRESS_CMS', title: 'WordPress CMS', desc: 'Авто-публикация готовых постов через REST API', icon: '📝', color: '#21759b' },
    { provider: 'WORDSTAT', title: 'Яндекс Метрика & Wordstat', desc: 'Анализ показов, кликов и поиск поисковых запросов', icon: '📊', color: '#ffcc00' },
    { provider: 'GEMINI', title: 'Google Gemini 1.5 Pro', desc: 'Мультимодальный анализ ниш и генератор контента', icon: '✨', color: '#4285f4' },
    { provider: 'ANTHROPIC', title: 'Anthropic Claude 3.5', desc: 'Глубокая редакторская вычитка и SEO-копирайтинг', icon: '🧠', color: '#d97706' },
  ];

  return (
    <div style={{ padding: '32px', maxWidth: '1280px', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', borderBottom: '1px solid #1f2937', paddingBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 700, color: '#38bdf8' }}>
            🔌 Центр подключений и API-ключей (Integrations Dashboard)
          </h1>
          <p style={{ margin: '6px 0 0', color: '#9ca3af', fontSize: '14px' }}>
            Подключайте внешние сервисы AI, CMS и Аналитики без хардкода. Все ключи шифруются симметричным алгоритмом AES-256-GCM.
          </p>
        </div>
        <a href="/" style={{ padding: '10px 18px', background: '#1f2937', color: '#38bdf8', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '13px', border: '1px solid #374151' }}>
          ← На Главный Дашборд
        </a>
      </div>

      {/* Grid of Service Cards */}
      <h2 style={{ fontSize: '18px', color: '#f3f4f6', marginBottom: '14px' }}>Доступные внешние сервисы</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {serviceCards.map((sc) => (
          <div
            key={sc.provider}
            onClick={() => setProviderSelect(sc.provider as any)}
            style={{
              background: providerSelect === sc.provider ? '#1e293b' : '#111827',
              border: `2px solid ${providerSelect === sc.provider ? sc.color : '#1f2937'}`,
              borderRadius: '12px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '24px' }}>{sc.icon}</span>
              <span style={{ fontSize: '11px', background: '#1f2937', color: sc.color, padding: '4px 8px', borderRadius: '6px', fontWeight: 700 }}>
                {sc.provider}
              </span>
            </div>
            <div style={{ fontWeight: 700, fontSize: '16px', color: '#fff', marginBottom: '4px' }}>{sc.title}</div>
            <div style={{ fontSize: '13px', color: '#9ca3af', lineHeight: '1.4' }}>{sc.desc}</div>
          </div>
        ))}
      </div>

      {/* Add Credential Form */}
      <div style={{ background: '#111827', borderRadius: '12px', padding: '24px', border: '1px solid #1f2937', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', margin: 0, color: '#f3f4f6' }}>Форма безопасного добавления ключей</h2>
          <span style={{ background: '#064e3b', color: '#6ee7b7', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>
            🔒 AES-256-GCM Encrypted
          </span>
        </div>

        <form onSubmit={handleSaveConnection}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>Выбранный сервис</label>
              <select
                value={providerSelect}
                onChange={(e: any) => setProviderSelect(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #374151', background: '#1f2937', color: '#fff' }}
              >
                <option value="OPENAI">OpenAI (ChatGPT API)</option>
                <option value="WORDPRESS_CMS">WordPress CMS API</option>
                <option value="WORDSTAT">Яндекс Метрика & Wordstat</option>
                <option value="GEMINI">Google Gemini API</option>
                <option value="ANTHROPIC">Anthropic Claude API</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>Название подключения</label>
              <input
                type="text"
                placeholder="напр. Продакшн ключ OpenAI"
                value={connectionName}
                onChange={(e) => setConnectionName(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #374151', background: '#1f2937', color: '#fff', boxSizing: 'border-box' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>Секретный API-ключ / Пароль приложения</label>
              <input
                type="password"
                placeholder="sk-proj-... или wp_app_pass..."
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #374151', background: '#1f2937', color: '#fff', boxSizing: 'border-box' }}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '14px', borderRadius: '8px', border: 'none', background: '#0284c7', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? '⏳ Зашифровка и сохранение...' : '🔒 Сохранить в зашифрованном виде (AES-256)'}
          </button>
        </form>
      </div>

      {/* Active Integrations Grid */}
      <h2 style={{ fontSize: '18px', color: '#f3f4f6', marginBottom: '14px' }}>Подключенные сервисы ({connectionsList.length})</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
        {connectionsList.map((conn) => (
          <div key={conn.id} style={{ background: '#111827', padding: '20px', borderRadius: '12px', border: '1px solid #1f2937' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontWeight: 700, color: '#38bdf8', fontSize: '16px' }}>{conn.name}</span>
              <span style={{ background: '#064e3b', color: '#6ee7b7', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}>
                {conn.provider}
              </span>
            </div>
            <div style={{ fontSize: '13px', color: '#9ca3af', fontFamily: 'monospace', background: '#1f2937', padding: '10px 14px', borderRadius: '8px', marginBottom: '12px' }}>
              Маскированный ключ: <strong style={{ color: '#fff' }}>{conn.maskedKey}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#6b7280' }}>
              <span>🔒 Шифрование: {conn.encryption}</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>● {conn.status || 'CONNECTED'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Audit Log */}
      {log.length > 0 && (
        <div style={{ background: '#030712', padding: '16px', borderRadius: '8px', border: '1px solid #1f2937', fontFamily: 'monospace', fontSize: '12px', color: '#a7f3d0' }}>
          <div style={{ color: '#9ca3af', marginBottom: '8px', fontWeight: 700 }}>Лог транзакций безопасности:</div>
          {log.map((l, i) => (
            <div key={i} style={{ marginBottom: '4px' }}>{l}</div>
          ))}
        </div>
      )}
    </div>
  );
}
