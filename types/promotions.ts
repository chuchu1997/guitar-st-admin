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

export interface PromotionType {
  id: number;
  name: String;

  isActive: Boolean;
  products: ProductInterface[];
  discountValue: Number; // Percentage (0-100) or fixed amount
  startDate: Date;
  endDate: Date;
  createdAt?: Date;
}
