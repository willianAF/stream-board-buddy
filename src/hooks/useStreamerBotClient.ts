import { useCallback, useEffect, useRef, useState } from 'react';
import { StreamerbotClient } from '@streamerbot/client';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

export function useStreamerBotClient() {
  const clientRef = useRef<StreamerbotClient | null>(null);
  const connectPromiseRef = useRef<Promise<void> | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const isConnectedRef = useRef(false);

  useEffect(() => {
    setStatus('connecting');

    let resolveConnect!: () => void;
    connectPromiseRef.current = new Promise<void>((resolve) => {
      resolveConnect = resolve;
    });

    const client = new StreamerbotClient({
      onConnect: () => {
        isConnectedRef.current = true;
        setStatus('connected');
        resolveConnect();
      },
      onDisconnect: () => {
        isConnectedRef.current = false;
        setStatus('disconnected');
      },
      onError: (err) => console.error('[StreamerBot] Error:', err),
    });

    clientRef.current = client;

    return () => {
      client?.disconnect();
      clientRef.current = null;
      connectPromiseRef.current = null;
    };
  }, []);

  const waitForConnection = useCallback(async () => {
    if (status === 'connected') return;
    if (connectPromiseRef.current) await connectPromiseRef.current;
  }, [status]);

  const getGlobal = async (name: string, persisted: boolean = true) => {
    await waitForConnection();
    const client = clientRef.current;
    if (!client) return null;
    return await client.getGlobal(name, persisted);
  };

  const doAction = async (action: string, payload: any) => {
    await waitForConnection();
    const client = clientRef.current;
    if (!client) return null;
    return await client.doAction({ name: action }, payload);
  };

  const onEvent = async (event: any, fn: (data: any) => void) => {
    await waitForConnection();
    const client = clientRef.current;
    if (!client) return;
    client.on(event, fn);
  };

  return {
    status,
    getGlobal,
    doAction,
    onEvent,
  };
}
