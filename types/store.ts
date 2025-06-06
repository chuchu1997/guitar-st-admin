



// export interface StoreInterface { 
//      id?:number;
//      name:string;
//      userID:number;
//      products?:[];
//      categories?:[];
//      news?:[]
//     //  user
// }
interface StoreBase { 
    name:string;
    userID:number;
    products:[],
    categories:[],
    news:[]
    description?:string;
  
    


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