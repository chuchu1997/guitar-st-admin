/** @format */

export interface ArticleBaseInterface {
  title: string;
  slug: string;
  description: string;
  imageUrl?: string;
  storeId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ArticleInterface extends ArticleBaseInterface {
  id: number;
}

export interface CreateNewArticleInterface
  extends Omit<ArticleBaseInterface, "createdAt" | "updatedAt"> {}

export interface UpdateNewArticleInterface
  extends Omit<ArticleInterface, "id"> {
  updatedAt: Date;
}
