



// export interface StoreInterface { 
//      id?:number;
//      name:string;
//      userID:number;
//      products?:[];
//      categories?:[];
//      news?:[]
//     //  user

import { SeoType } from "./seo";

// }
export enum SocialType {
  FACEBOOK="FACEBOOK",
  TIKTOK="TIKTOK",
  ZALO="ZALO",
  YOUTUBE="YOUTUBE",
  SHOPEE="SHOPEE",
  TIKI="TIKI",
  LAZADA="LAZADA"
}


export interface StoreSocials  {
    id?:number;
    type:SocialType
    url:string;
    storeId:number;
}
interface StoreBase { 
    name:string;
    userID:number;
    products:[],
    categories:[],
    news:[]
    description?:string;
    email?:string;
    phone?:string;
    address?:string;
    logo?:string;
    favicon?:string;
    socials:StoreSocials[]
    seo?:SeoType
    
}

export interface CreateStoreInterface extends Omit<Partial<StoreBase>, 'products' | 'categories' | 'news' > {
    name:string;
    userID:number;
}

export interface StoreInterface extends StoreBase{
    id:number;

}

export interface UpdateStoreInterface extends Partial<Omit<StoreInterface, 'id'>> {
    updatedAt:Date
}