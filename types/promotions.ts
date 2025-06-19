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

export enum PromotionTypeEnum {
  FLASHSALE = "FLASHSALE", // Giảm giá trong khung giờ giới hạn
  PERCENTAGE = "PERCENTAGE", // Giảm theo phần trăm
  FIXED_AMOUNT = "FIXED_AMOUNT", // Giảm giá theo số tiền cố định
  BUY_ONE_GET_ONE = "BUY_ONE_GET_ONE", // Mua 1 tặng 1
  FREE_SHIPPING = "FREE_SHIPPING", // Miễn phí vận chuyển
  VOUCHER_CODE = "OUCHER_CODE", // Áp dụng mã giảm giá
  QUANTITY_BASED = "QUANTITY_BASED", // Giảm khi mua số lượng lớn
  COMBO = "COMBO", // Giảm khi mua theo combo
}
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
