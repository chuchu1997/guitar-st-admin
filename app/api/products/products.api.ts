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
    }
}
export default ProductAPI;
