import { OrderStatus, UpdateOrderItem } from "@/types/order";
import api from "../interceptor"









const url  = "/orders"


export interface OrderGetParams  { 
    isCanceled?:boolean;
    isCompleted?:boolean;
    isSend?:boolean;
    limit:number;
    currentPage:number;



}
export const OrderAPI =  { 

    getAllOrders:async (params:OrderGetParams)=>{
        return api({
            method:"GET",
            url:url,
            params:params
        })
    }
,
    onUpdateOrder:async(orderId:number,data:UpdateOrderItem)=>{
      
        return api({
            method:"Patch",
            url:`${url}/${orderId}`,
            data:data
        })

    }
    ,
    deleteOrder:async(orderId:number)=>{
        return api({
            method:"DELETE",
            url:`${url}/${orderId}`
        })
    }
}