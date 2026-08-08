export interface InboxMessage {
  _id: string;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  category?: "reward_reply" | "general";
}
