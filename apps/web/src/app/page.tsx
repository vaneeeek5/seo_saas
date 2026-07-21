'use client';

import React, { useState } from 'react';
import { useTaskStream } from '../hooks/useTaskStream';

export default function DashboardPage() {
  const { tasks, connected } = useTaskStream('http://localhost:4000');
  const [projectName, setProjectName] = useState('');
  const [domain, setDomain] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'semantics' | 'content' | 'tasks'>('overview');
  const [log, setLog] = useState<string[]>([]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: projectName,
          domain: domain,
          organizationId: 'org_demo_1'
        })
      });
      const data = await res.json();
      setLog((prev) => [`[Command Sent] CreateProject -> ${JSON.stringify(data)}`, ...prev]);
      setProjectName('');
      setDomain('');
    } catch (err: any) {
      setLog((prev) => [`[Error] ${err.message}`, ...prev]);
    }
  };

  const handleCollectSemantics = async () => {
    try {
      const res = await fetch('http://localhost:4000/semantics/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: 'proj_demo_1',
          seedKeywords: ['seo automation', 'ai content generator']
        })
      });
      const data = await res.json();
      setLog((prev) => [`[Command Sent] CollectSemantics -> TaskId: ${data.taskId}`, ...prev]);
    } catch (err: any) {
      setLog((prev) => [`[Error] ${err.message}`, ...prev]);
    }
  };

  const handleGenerateArticle = async () => {
    try {
      const res = await fetch('http://localhost:4000/content/articles/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: 'proj_demo_1',
          topic: 'Top 10 SEO SaaS Tools in 2026',
          primaryKeyword: 'seo saas tools'
        })
      });
      const data = await res.json();
      setLog((prev) => [`[Command Sent] GenerateArticle -> TaskId: ${data.taskId}`, ...prev]);
    } catch (err: any) {
      setLog((prev) => [`[Error] ${err.message}`, ...prev]);
    }
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #1f2937',
        paddingBottom: '20px',
        marginBottom: '32px'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: '#38bdf8' }}>
            SEO Content Factory OS
          </h1>
          <p style={{ margin: '4px 0 0', color: '#9ca3af', fontSize: '14px' }}>
            Multi-Agent Autonomous Execution Engine
          </p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
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

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        {(['overview', 'semantics', 'content', 'tasks'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              textTransform: 'capitalize',
              backgroundColor: activeTab === tab ? '#0284c7' : '#1f2937',
              color: activeTab === tab ? '#ffffff' : '#9ca3af'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Left Column: Command Triggers */}
        <div style={{ background: '#111827', borderRadius: '12px', padding: '24px', border: '1px solid #1f2937' }}>
          <h2 style={{ fontSize: '18px', marginTop: 0, color: '#f3f4f6' }}>Command Bus Interface</h2>
          
          <form onSubmit={handleCreateProject} style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '14px', color: '#38bdf8', marginBottom: '12px' }}>Create Project</h3>
            <input
              type="text"
              placeholder="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                borderRadius: '6px',
                border: '1px solid #374151',
                background: '#1f2937',
                color: '#fff',
                boxSizing: 'border-box'
              }}
              required
            />
            <input
              type="text"
              placeholder="Domain (e.g. example.com)"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '12px',
                borderRadius: '6px',
                border: '1px solid #374151',
                background: '#1f2937',
                color: '#fff',
                boxSizing: 'border-box'
              }}
              required
            />
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: 'none',
                background: '#2563eb',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Send CreateProjectCommand
            </button>
          </form>

          <hr style={{ borderColor: '#1f2937', margin: '20px 0' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={handleCollectSemantics}
              style={{
                padding: '12px',
                borderRadius: '6px',
                border: 'none',
                background: '#0d9488',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Trigger CollectSemanticCommand
            </button>

            <button
              onClick={handleGenerateArticle}
              style={{
                padding: '12px',
                borderRadius: '6px',
                border: 'none',
                background: '#7c3aed',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Trigger GenerateArticleCommand
            </button>
          </div>
        </div>

        {/* Right Column: Real-time Task Stream */}
        <div style={{ background: '#111827', borderRadius: '12px', padding: '24px', border: '1px solid #1f2937' }}>
          <h2 style={{ fontSize: '18px', marginTop: 0, color: '#f3f4f6' }}>Active Task Engine Stream</h2>
          
          {Object.keys(tasks).length === 0 ? (
            <p style={{ color: '#6b7280', fontSize: '14px' }}>No active tasks streamed yet. Send a command above to trigger tasks.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.values(tasks).map((task) => (
                <div
                  key={task.taskId}
                  style={{
                    background: '#1f2937',
                    padding: '14px',
                    borderRadius: '8px',
                    borderLeft: `4px solid ${task.status === 'COMPLETED' ? '#10b981' : '#3b82f6'}`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 600, fontSize: '14px', color: '#f9fafb' }}>{task.taskType}</span>
                    <span style={{ fontSize: '12px', color: '#9ca3af' }}>{task.status}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#d1d5db' }}>{task.message}</div>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '6px' }}>Task ID: {task.taskId}</div>
                </div>
              ))}
            </div>
          )}

          <hr style={{ borderColor: '#1f2937', margin: '20px 0' }} />

          <h3 style={{ fontSize: '14px', color: '#9ca3af' }}>Command Execution Audit Log</h3>
          <div style={{
            background: '#030712',
            padding: '12px',
            borderRadius: '6px',
            maxHeight: '180px',
            overflowY: 'auto',
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#a7f3d0'
          }}>
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
