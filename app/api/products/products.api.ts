import { CreateProductInterface, UpdateProductInterface } from "@/types/product";
import api from "../interceptor"
const url = "/products"



export interface GetProductDTO  {
    storeID:number;
    isFeatured?:boolean;
    limit?:number;
    currentPage?:number;
    slug?:string;
    categoryId?:number

}
const ProductAPI = {
    getListProducts: async({storeID,isFeatured = false , limit = 4 , currentPage = 1,slug}:GetProductDTO)=>{
        return await api({
            method:"GET",
            url:url,
            params:{
                storeID,
                isFeatured,
                limit,
                currentPage,
                slug
            }

        })
    },
    
    getProductBySlug:async (slug:string)=>{
        return await api({
            method:"GET",
            url:`${url}/${slug}`

        })
    },
    createProduct:async(data:CreateProductInterface)=>{
        return await api({
            method:"POST",
            url:`${url}`,
            data:data
        })
    },
    updateProduct:async(id:number,data:UpdateProductInterface)=>{
           return await api({
            method:"PATCH",
            url:`${url}/${id}`,
            data:data
        })
    },
    removeProduct:async(id:string)=>{
        return await api({
            method:"DELETE",
            url:`${url}/${id}`
        })
    }
}
export default ProductAPI;
