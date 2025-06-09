








interface CategoryBase { 
    name:string;
    slug:string;
    storeId:number;
    imageUrl:string;
    description:string;
    parentId?:number|null;
    createdAt?:Date;
    updatedAt?:Date;

}

export interface CategoryInterface extends CategoryBase{
    id:number;
};

export interface CreateCategoryInterface extends Omit<CategoryBase,"createdAt"|"updatedAt">{
};
export interface UpdateCategoryInterface extends Omit<CategoryInterface,"id">{
    updatedAt:Date;

}