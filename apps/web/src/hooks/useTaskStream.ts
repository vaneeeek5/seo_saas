import { useEffect, useState } from 'react';
import { getApiBaseUrl } from '../lib/api';

export interface TaskEventPayload {
  taskId: string;
  projectId: string;
  taskType: string;
  status: string;
  progress: number;
  message?: string;
  error?: string;
}

export function useTaskStream(customApiHost?: string) {
  const [tasks, setTasks] = useState<Record<string, TaskEventPayload>>({});
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let retryTimeout: NodeJS.Timeout | null = null;

    const baseUrl = customApiHost || getApiBaseUrl();
    const streamUrl = baseUrl.endsWith('/')
      ? `${baseUrl}tasks/stream`
      : `${baseUrl}/tasks/stream`;

    const connect = () => {
      eventSource = new EventSource(streamUrl);

      eventSource.onopen = () => {
        setConnected(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const payload: TaskEventPayload = JSON.parse(event.data);
          setTasks((prev) => ({
            ...prev,
            [payload.taskId]: payload,
          }));
        } catch (err) {
          console.error('[SSE Client] Failed to parse task event:', err);
        }
      };

      eventSource.onerror = (err) => {
        console.warn('[SSE Client Warning] Connection lost, attempting auto-reconnect in 3s...');
        setConnected(false);
        if (eventSource) {
          eventSource.close();
        }
        retryTimeout = setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      if (retryTimeout) clearTimeout(retryTimeout);
      if (eventSource) eventSource.close();
    };
  }, [customApiHost]);

  return { tasks, connected };
}
