import { CreateCategoryInterface, UpdateCategoryInterface } from "@/types/categories";
import api from "../interceptor"




const url = "/categories"

const CategoryAPI = {

    createCategory:async({...data}:CreateCategoryInterface)=>{
        return await api({
            method:"POST",
            url,
            data
        })
    },
    getCategoriesRelateWithStoreID: async ({justGetParent,storeID}:{justGetParent:boolean,storeID:number})=>{
        return await api({
            method:"GET",
            url:url,
            params:{
                justGetParent,
                storeID
            }
        })
    },
    updateCategory:async(categoryUpdate:UpdateCategoryInterface)=>{
        return await api({
            method:"PATCH",
            url:`${url}/${categoryUpdate.id}`,
            data:categoryUpdate
        })
    },

    deleteCategoryFromID: async (id:number,storeID:number)=>{
        return await api({
            method:"DELETE",
            url:`${url}/${id}`,
            params:{
                storeID
            }
        })
    }
}
export default CategoryAPI;
