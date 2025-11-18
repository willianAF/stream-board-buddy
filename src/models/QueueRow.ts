export interface QueueRow {
  userName: string;
  queueTime: Date;
}

export interface QueueList {
  queue: QueueRow[];
}
