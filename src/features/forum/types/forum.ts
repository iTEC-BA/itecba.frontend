// src/features/forum/types/forum.ts
 
export interface ForumPost {
  id:          number;
  parent_id:   number | null;
  pseudonym:   string;
  body:        string;
  upvotes:     number;
  reply_count: number;
  user_vote?:  1 | -1 | 0 | null;
  created_at:  string;
  replies?:    ForumPost[];
}
 
export interface ForumFeedResponse {
  posts:    ForumPost[];
  total:    number;
  page:     number;
  pageSize: number;
  hasMore:  boolean;
}
 
export interface ForumThreadResponse {
  post:    ForumPost;
  replies: ForumPost[];
}
 
export type ForumView = "feed" | "thread";
 
export interface CreatePostPayload {
  body: string;
}
 
export interface CreateReplyPayload {
  body:     string;
  parentId: number;
}
