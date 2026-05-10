export interface ForumPost {
  id:           number;
  parent_id:    number | null;
  root_id:      number | null;
  pseudonym:    string;
  body:         string;
  upvotes:      number;
  reposts:      number;
  shares:       number;
  views:        number;
  reply_count:  number;
  user_vote?:   1 | -1 | 0 | null;
  is_reposted?: boolean;
  is_author?:   boolean;
  reposted_by?: string;
  quoted_post?: ForumPost | null;
  tags?:        { label: string; direction: 'up' | 'down' | 'neutral' }[];
  created_at:   string;
  expires_at:   string;
}

export type ForumTab = 'para-ti' | 'siguiendo' | 'utn-ba' | 'tendencias';

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

export type ForumView = 'feed' | 'thread';

export interface CreatePostPayload  { body: string; }
export interface CreateReplyPayload { body: string; parentId: number; }

export interface ForumBanner {
  id:           number;
  title:        string;
  description:  string;
  redirect_url: string;
  svg_content:  string;
  banner_color: string;
  is_active:    number;   // 0 | 1
  created_at:   string;
  updated_at:   string;
}
