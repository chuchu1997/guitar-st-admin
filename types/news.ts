/** @format */

interface ArticleBaseInterface {
  title: string;
  slug: string;
  description: string;
  imageUrl?: string;
  storeId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateNewArticleInterface
  extends Partial<Omit<ArticleBaseInterface, "createdAt" | "updatedAt">> {}

export interface ArticleInterface extends ArticleBaseInterface {
  id: number;
}

export interface UpdateArticleInterface
  extends Partial<Omit<ArticleInterface, "id">> {
  updatedAt: Date;
}
