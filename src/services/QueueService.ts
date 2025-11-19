import type { QueueRow, QueueList } from '@/models/QueueRow';
import { useStreamerBotClient } from '@/hooks/useStreamerBotClient';

export function useQueueService() {
  const { getGlobal, doAction, onEvent } = useStreamerBotClient();

  const getPlayersQueue = async (): Promise<QueueRow[]> => {
    try {
      const response: any = await getGlobal('PlayersQueue', false);
        
      if (!response || response.error) return [];
      
      const parsed: QueueList = JSON.parse(response.variable.value);
      return parsed.queue?.map((x) => ({
        ...x,
        queueTime: new Date(x.queueTime),
      })) ?? [];
    } catch {
      return [];
    }
  };

  const addPlayerToQueue = (userName: string) =>
    doAction('AddPlayerToQueue', { userName, externalApp: true });

  const removePlayerFromQueue = (userName: string) =>
    doAction('RemovePlayerFromQueue', { userName });

  const onPlayerQueueChanges = (callback: () => void) =>
    onEvent('Command.Triggered', (data) => {
      if (data.data.name === 'Queue') {
        setTimeout(callback, 500);
      }
    });

  return {
    getPlayersQueue,
    addPlayerToQueue,
    removePlayerFromQueue,
    onPlayerQueueChanges,
  };
}
