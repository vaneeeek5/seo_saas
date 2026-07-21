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
      addLog(`[Command Sent] CreateProject -> ID: ${data.projectId}`);
      setProjectName('');
      setDomain('');
    } catch (err: any) {
      addLog(`[Error] ${err.message}`);
    }
  };

  const handleCollectSemantics = async () => {
    try {
      const res = await fetch('http://localhost:4000/semantics/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: 'proj_demo_1', seedKeywords: ['seo saas', 'ai content factory'] })
      });
      const data = await res.json();
      addLog(`[Command Sent] CollectSemantics -> TaskId: ${data.taskId}`);
    } catch (err: any) {
      addLog(`[Error] ${err.message}`);
    }
  };

  const handleGenerateArticle = async () => {
    try {
      const res = await fetch('http://localhost:4000/content/articles/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: 'proj_demo_1', topic: 'Top 10 SEO SaaS Tools in 2026', primaryKeyword: 'seo saas' })
      });
      const data = await res.json();
      addLog(`[Command Sent] GenerateArticle -> TaskId: ${data.taskId}`);
    } catch (err: any) {
      addLog(`[Error] ${err.message}`);
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
      addLog(`[Command Sent] IngestKnowledge -> NodeID: ${data.nodeId}`);
      setKnowledgeTitle('');
      setKnowledgeContent('');
    } catch (err: any) {
      addLog(`[Error] ${err.message}`);
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
      addLog(`[Command Sent] EvaluateDecision -> Recommendation: ${data.recommendedAction}`);
    } catch (err: any) {
      addLog(`[Error] ${err.message}`);
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
      addLog(`[Command Sent] PublishContent -> URL: ${data.externalUrl}`);
    } catch (err: any) {
      addLog(`[Error] ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header */}
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
            Multi-Agent Autonomous SaaS Platform (DDD + CQRS + Event-Driven)
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
            SSE Realtime: {connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </header>

      {/* Analytics Metric Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Organic Monthly Traffic', val: '12,500', sub: '+14% this month', color: '#38bdf8' },
          { label: 'Keywords Ranked', val: '142', sub: '18 in Top 3', color: '#10b981' },
          { label: 'Articles Generated', val: '24', sub: '98% SEO Score', color: '#a855f7' },
          { label: 'Platform Health', val: '94/100', sub: 'Zero Queue Lag', color: '#f59e0b' },
        ].map((m, i) => (
          <div key={i} style={{ background: '#111827', padding: '18px', borderRadius: '10px', border: '1px solid #1f2937' }}>
            <div style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase' }}>{m.label}</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: m.color, margin: '6px 0 2px' }}>{m.val}</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {(['overview', 'semantics', 'content', 'knowledge', 'decision', 'analytics'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13px',
              textTransform: 'capitalize',
              backgroundColor: activeTab === tab ? '#0284c7' : '#1f2937',
              color: activeTab === tab ? '#ffffff' : '#9ca3af'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Grid Interface */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Left Column: Command & Engine Triggers */}
        <div style={{ background: '#111827', borderRadius: '12px', padding: '24px', border: '1px solid #1f2937' }}>
          <h2 style={{ fontSize: '18px', marginTop: 0, color: '#f3f4f6' }}>Command Bus Controls</h2>
          
          {/* Create Project Form */}
          <form onSubmit={handleCreateProject} style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', color: '#38bdf8', marginBottom: '10px' }}>Project Engine</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="Project Name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #374151', background: '#1f2937', color: '#fff' }}
                required
              />
              <input
                type="text"
                placeholder="Domain (e.g. site.com)"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #374151', background: '#1f2937', color: '#fff' }}
                required
              />
            </div>
            <button type="submit" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
              Send CreateProjectCommand
            </button>
          </form>

          <hr style={{ borderColor: '#1f2937', margin: '18px 0' }} />

          {/* RAG Knowledge Ingestion Form */}
          <form onSubmit={handleIngestKnowledge} style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', color: '#a855f7', marginBottom: '10px' }}>RAG Knowledge Engine</h3>
            <input
              type="text"
              placeholder="Knowledge Node Title"
              value={knowledgeTitle}
              onChange={(e) => setKnowledgeTitle(e.target.value)}
              style={{ width: '100%', padding: '10px', marginBottom: '8px', borderRadius: '6px', border: '1px solid #374151', background: '#1f2937', color: '#fff', boxSizing: 'border-box' }}
              required
            />
            <textarea
              placeholder="Knowledge Context Body"
              value={knowledgeContent}
              onChange={(e) => setKnowledgeContent(e.target.value)}
              rows={2}
              style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #374151', background: '#1f2937', color: '#fff', boxSizing: 'border-box' }}
              required
            />
            <button type="submit" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: 'none', background: '#9333ea', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
              Send IngestKnowledgeCommand
            </button>
          </form>

          <hr style={{ borderColor: '#1f2937', margin: '18px 0' }} />

          {/* Quick Engine Triggers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button onClick={handleCollectSemantics} style={{ padding: '12px', borderRadius: '6px', border: 'none', background: '#0d9488', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
              Trigger CollectSemantic
            </button>
            <button onClick={handleGenerateArticle} style={{ padding: '12px', borderRadius: '6px', border: 'none', background: '#4f46e5', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
              Trigger GenerateArticle
            </button>
            <button onClick={handleEvaluateDecision} style={{ padding: '12px', borderRadius: '6px', border: 'none', background: '#ea580c', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
              Evaluate Decision Engine
            </button>
            <button onClick={handlePublishContent} style={{ padding: '12px', borderRadius: '6px', border: 'none', background: '#059669', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
              Publish to CMS
            </button>
          </div>
        </div>

        {/* Right Column: Task Stream & Decision Result */}
        <div style={{ background: '#111827', borderRadius: '12px', padding: '24px', border: '1px solid #1f2937' }}>
          {/* AI Decision Result Box */}
          {decisionResult && (
            <div style={{ background: '#7c2d12', padding: '14px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ea580c' }}>
              <div style={{ fontWeight: 700, color: '#ffedd5', fontSize: '14px' }}>AI Decision Recommendation</div>
              <div style={{ fontSize: '13px', color: '#fed7aa', marginTop: '4px' }}>Action: {decisionResult.recommendedAction}</div>
              <div style={{ fontSize: '12px', color: '#fdba74', marginTop: '2px' }}>Reason: {decisionResult.reason}</div>
            </div>
          )}

          <h2 style={{ fontSize: '18px', marginTop: 0, color: '#f3f4f6' }}>BullMQ Task Engine SSE Stream</h2>
          
          {Object.keys(tasks).length === 0 ? (
            <p style={{ color: '#6b7280', fontSize: '14px' }}>No active tasks streamed yet. Trigger a command to observe live progress.</p>
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

          <h3 style={{ fontSize: '14px', color: '#9ca3af' }}>Live Command Bus Audit Log</h3>
          <div style={{ background: '#030712', padding: '12px', borderRadius: '6px', maxHeight: '150px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '12px', color: '#a7f3d0' }}>
            {log.length === 0 ? (
              <span style={{ color: '#4b5563' }}>Audit log empty...</span>
            ) : (
              log.map((entry, idx) => <div key={idx} style={{ marginBottom: '4px' }}>{entry}</div>)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
