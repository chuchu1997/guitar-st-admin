import { CreateProductInterface, UpdateProductInterface } from "@/types/product";
import api from "../interceptor"
import { CreatePromotionInterface } from "@/types/promotions";
const url = "/promotion"

export interface GetPromotionDTO  {
 
    storeID:number;
    limit?:number;
    currentPage?:number;
  


}
export const PromotionAPI = {




    getPromotionByID: async(id:number)=>{
            return await api({
            method:"GET",
            url:`${url}/${id}`,
           
        })
    },

    createPromotion:async(createParams:CreatePromotionInterface)=>{
        return await api({
            method:"POST",
            url:url,
            data:createParams
        })
    },
    getAllPromotionsFromStore: async({storeID, limit = 4 , currentPage = 1}:GetPromotionDTO)=>{
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

