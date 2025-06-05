import { CreateStoreInterface, UpdateStoreInterface } from "@/types/store"
import api from "../interceptor"




let url = "/stores"

const StoresAPI = {
    getStoresByUserID:async (userID:string)=>{
        return await api({
            method:'GET',
            url:`${url}/user/${userID}`,
          
        })
        //RETURN LIST STORES !!
    },
    createStore:async({...params}:CreateStoreInterface)=>{
        return await api({
            method:"POST",
            url:url,
            data:{
                name:params.name,
                userID:params.userID
            }
        })

    },

    getStoreRelateWithUser:async(userID:string,storeID:string)=>{
     
        return await api({
            method:"GET",
            url:`${url}/${storeID}`,

            params:{
                userID:userID
            },

        })
    },
    updateStore:async(storeId:string,data:UpdateStoreInterface)=>{
        return await api({
            method:"PATCH",
            url:`${url}/${storeId}`,
            data
        })
    },
    deleteStore:async(storeId:string)=>{
        return await api({
            method:"DELETE",
            url:`${url}/${storeId}`
        })
    }
}


export default StoresAPI