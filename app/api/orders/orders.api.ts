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
}