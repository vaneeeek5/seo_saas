import { useEffect, useState } from 'react';

export interface TaskEventPayload {
  taskId: string;
  projectId: string;
  taskType: string;
  status: string;
  progress: number;
  message?: string;
  error?: string;
}

export function useTaskStream(apiHost: string = 'http://localhost:4000') {
  const [tasks, setTasks] = useState<Record<string, TaskEventPayload>>({});
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let retryTimeout: NodeJS.Timeout | null = null;

    const connect = () => {
      eventSource = new EventSource(`${apiHost}/tasks/stream`);

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
  }, [apiHost]);

  return { tasks, connected };
}
