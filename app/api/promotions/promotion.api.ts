import { CreateProductInterface, UpdateProductInterface } from "@/types/product";
import api from "../interceptor"
import { CreatePromotionInterface, PromotionTypeEnum, UpdatePromotionInterface } from "@/types/promotions";
const url = "/promotion"

export interface GetPromotionDTO  {
    storeID:number;
    limit?:number;
    currentPage?:number;
    promotionType?:PromotionTypeEnum
  


}
export const PromotionAPI = {




    getPromotionByID: async(id:number)=>{
            return await api({
            method:"GET",
            url:`${url}/${id}`,
           
        })
    },
    deletePromotion:async(id:number)=>{
        return await api({
            method:"DELETE",
            url:`${url}/${id}`
        })
    },
    updatePromotion:async(id:number,updateParams:UpdatePromotionInterface)=>{
            return await api({
                method:"PATCH",
                url:`${url}/${id}`,
                data:updateParams
            })
    },
    createPromotion:async(createParams:CreatePromotionInterface)=>{
        return await api({
            method:"POST",
            url:url,
            data:createParams
        })
    },
    getAllPromotionsFromStore: async({storeID,currentPage =1 , limit = 4 ,promotionType}:GetPromotionDTO)=>{
        return await api({
            method:"GET",
            url:`${url}`,
            params:{
               storeID:storeID,
               currentPage,
               limit,
               promotionType
            }
        })
    },
    
  
}

