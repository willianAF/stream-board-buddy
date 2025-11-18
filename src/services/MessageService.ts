import type { Message, MessageList } from '@/models/Message';
import type { CreateMessage } from '@/models/CreateMessage';
import type { UpdateMessage } from '@/models/UpdateMessage';
import { useStreamerBotClient } from '@/hooks/useStreamerBotClient';

export function useMessageService() {
  const { getGlobal, doAction } = useStreamerBotClient();

  const getMessages = async (): Promise<Message[]> => {
    try {
        const response: any = await getGlobal('Messages');
        if (!response || response.error) return [];

      const parsed: MessageList = JSON.parse(response.variable.value);
      return parsed.messages ?? [];
    } catch {
      return [];
    }
  };

  const createMessage = async (msg: CreateMessage) =>
    doAction('CreateMessage', { message: JSON.stringify(msg) });

  const updateMessage = async (msg: UpdateMessage) =>
    doAction('UpdateMessage', { message: JSON.stringify(msg) });

  const deleteMessage = async (id: string) =>
    doAction('DeleteMessage', { messageId: id });

  return {
    getMessages,
    createMessage,
    updateMessage,
    deleteMessage,
  };
}
