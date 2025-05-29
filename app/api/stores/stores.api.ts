import { CreateStoreInterface } from "@/types/store"
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
    }
}


export default StoresAPI