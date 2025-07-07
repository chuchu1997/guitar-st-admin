interface FakeCommentBase {
  productId: number;
  content: string;
  ratingCount: number;
  authorName: string;
  avatarUrl?: string;
}


export interface FakeComment {
  id: number;
  productId: number;
  content: string;
  ratingCount: number;
  authorName: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}


export interface FakeCommentCreate {
  productId: number;
  content: string;
  ratingCount: number;
  authorName: string;
  avatarUrl?: string;
}

