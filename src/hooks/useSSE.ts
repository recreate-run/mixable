import { useState, useEffect, useRef } from 'react';
import { apiClient } from '@/lib/api-client';

export type SSEEventType =
  | 'connected'
  | 'status'
  | 'claude_message'
  | 'file_added'
  | 'file_changed'
  | 'file_deleted'
  | 'dev_server_ready'
  | 'preview_ready'
  | 'error';

export interface SSEMessage {
  type: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp: number;
  data?: any;
}

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface UseSSEResult {
  messages: SSEMessage[];
  status: ConnectionStatus;
  error: string | null;
  addMessage: (message: SSEMessage) => void;
  clearMessages: () => void;
}

export function useSSE(projectId: string | null): UseSSEResult {
  const [messages, setMessages] = useState<SSEMessage[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!projectId) {
      setStatus('disconnected');
      return;
    }

    const url = apiClient.getSSEUrl(projectId);

    try {
      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setStatus('connected');
        setError(null);
      };

      eventSource.onerror = () => {
        setStatus('error');
        setError('Connection lost. Reconnecting...');
      };

      // Handle 'connected' event
      eventSource.addEventListener('connected', (e: MessageEvent) => {
        const data = JSON.parse(e.data);
        if (!data.heartbeat) {
          // Initial connection
          addMessageInternal({
            type: 'system',
            content: 'Connected to build server',
            timestamp: Date.now(),
          });
        }
      });

      // Handle 'status' event
      eventSource.addEventListener('status', (e: MessageEvent) => {
        const data = JSON.parse(e.data);
        addMessageInternal({
          type: 'assistant',
          content: data.message || data.status,
          timestamp: Date.now(),
          data,
        });
      });

      // Handle 'claude_message' event
      eventSource.addEventListener('claude_message', (e: MessageEvent) => {
        const data = JSON.parse(e.data);
        addMessageInternal({
          type: 'assistant',
          content: data.content,
          timestamp: Date.now(),
          data,
        });
      });

      // Handle 'file_added' event
      eventSource.addEventListener('file_added', (e: MessageEvent) => {
        const data = JSON.parse(e.data);
        addMessageInternal({
          type: 'system',
          content: `Created ${data.path}`,
          timestamp: Date.now(),
          data,
        });
      });

      // Handle 'file_changed' event
      eventSource.addEventListener('file_changed', (e: MessageEvent) => {
        const data = JSON.parse(e.data);
        addMessageInternal({
          type: 'system',
          content: `Modified ${data.path}`,
          timestamp: Date.now(),
          data,
        });
      });

      // Handle 'file_deleted' event
      eventSource.addEventListener('file_deleted', (e: MessageEvent) => {
        const data = JSON.parse(e.data);
        addMessageInternal({
          type: 'system',
          content: `Deleted ${data.path}`,
          timestamp: Date.now(),
          data,
        });
      });

      // Handle 'preview_ready' event
      eventSource.addEventListener('preview_ready', (e: MessageEvent) => {
        const data = JSON.parse(e.data);
        addMessageInternal({
          type: 'system',
          content: data.message || 'Preview is ready!',
          timestamp: Date.now(),
          data,
        });
      });

      // Handle 'error' event
      eventSource.addEventListener('error', (e: MessageEvent) => {
        const data = JSON.parse(e.data);
        addMessageInternal({
          type: 'error',
          content: data.message || 'An error occurred',
          timestamp: Date.now(),
          data,
        });
      });

    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Unknown error');
    }

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [projectId]);

  const addMessageInternal = (message: SSEMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  const addMessage = (message: SSEMessage) => {
    addMessageInternal(message);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    status,
    error,
    addMessage,
    clearMessages,
  };
}
