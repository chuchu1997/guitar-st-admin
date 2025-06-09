





export interface ImageInterface { 
    url:string;

}

interface ProductBase { 
    name:string;
    description:string;
    price:number;
    isFeatured:boolean;
    slug:string;
    discount:number;
    viewCount:number;
    ratingCount:number;
    orderItems:[];
    colors:ProductColorInterface[],
    sizes:ProductSizeInterface[]
    stock:number;
    images:ImageInterface[],
    categoryId:number;
    reviews:[]
    sku:string;
    storeId:number;
    createdAt?: Date;
    updatedAt?: Date;


}

export interface ProductColorInterface {
    id?:number;
    name:string;
    productId?:number;
    hex:string;
    price?:number;
    stock:number;
}
export interface ProductSizeInterface {  
    id?:number;
    name:string;
    productId?:number;
    price?:number;
    stock:number;

}


export interface ProductInterface extends ProductBase{
    id:number

};
export interface CreateProductInterface extends Partial<Omit<ProductBase, 'createdAt' | 'updatedAt' | 'orderItems' | 'reviews'>> {

}
export interface UpdateProductInterface extends Partial<Omit<ProductInterface,"id">> {
  updatedAt:Date;
  
}