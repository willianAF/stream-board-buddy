export interface Message {
  id: string;
  text: string;
  active: boolean;
}

export interface MessageList {
  messages: Message[];
}