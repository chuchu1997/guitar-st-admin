/** @format */

import { ProductInterface } from "./product";

// export interface SeoType {
//   title: String;
//   description: String;
//   keywords: String[];
//   openGraphTitle?: String;
//   // Tiêu đề OpenGraph (cho chia sẻ mạng xã hội)
//   openGraphDescription?: String; // Mô tả OpenGraph
//   openGraphImage?: String; // Hình ảnh OpenGraph

//   url: String; // URL của đối tượng (Product, Category, Blog)
// }

export enum discountTypeEnum {
  PERCENT = "PERCENT",
  FIXED = "FIXED",
}

export interface PromotionTypeBase {
  name: String;
  slug: String;
  isActive: Boolean;
  promotionProducts: ProductPromotion[];
  startDate: Date;
  endDate: Date;
  storeId: number;
  createdAt?: Date;
}
export interface ProductPromotion {
  promotionId?: number;
  productId?: number;
  discountType: discountTypeEnum;
  discount: number;
  product: ProductInterface;
}

export interface PromotionType extends PromotionTypeBase {
  id: number;
}

export interface CreatePromotionInterface
  extends Partial<Omit<PromotionTypeBase, "createdAt" | "updatedAt">> {}
export interface UpdatePromotionInterface
  extends Partial<Omit<PromotionType, "id">> {
  updatedAt: Date;
}
