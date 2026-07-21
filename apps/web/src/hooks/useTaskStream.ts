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
    const eventSource = new EventSource(`${apiHost}/tasks/stream`);

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
        console.error('Failed to parse SSE task event:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE connection error:', err);
      setConnected(false);
    };

    return () => {
      eventSource.close();
    };
  }, [apiHost]);

  return { tasks, connected };
}
