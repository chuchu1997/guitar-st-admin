








interface CategoryBase { 
    name:string;
    slug:string;
    storeId:number;
    imageBillboard:string;
    description:string;
    parentId?:number|null;
    createdAt?:Date;
    updatedAt?:Date;



}

export interface CategoryInterface extends CategoryBase{
    id:number;

};

export interface CreateCategoryInterface extends Omit<Partial<CategoryBase>, 'createdAt'|'updatedAt'>{
};
export interface UpdateCategoryInterface extends CategoryInterface{}