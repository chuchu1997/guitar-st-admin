





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
    colors:[],
    sizes:[]
    stock:number;
    images:ImageInterface[],
    categoryId:number;
    reviews:[]
    sku:string;
    storeId:number;
    createdAt?: Date;
    updatedAt?: Date;


}

export interface ProductInterface extends ProductBase{
    id:number;

};
export interface CreateProductInterface extends Partial<Omit<ProductBase, 'createdAt' | 'updatedAt' | 'orderItems' | 'reviews'>> {

}
export interface UpdateProductInterface extends Partial<ProductBase> {
  id: number;
}