import { CreateProductInterface, UpdateProductInterface } from "@/types/product";
import api from "../interceptor"
const url = "/promotions"

export interface GetProductDTO  {
 
    storeID:number;
    limit?:number;
    currentPage?:number;
  


}
export const PromotionAPI = {

    getListPromotions: async({storeID, limit = 4 , currentPage = 1}:GetProductDTO)=>{
        return await api({
            method:"GET",
            url:`${url}`,
            params:{
                storeID,
                limit,
                currentPage,
            }
        })
    },
    
  
}

