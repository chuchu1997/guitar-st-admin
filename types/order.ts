

 export enum OrderStatus { 
  ORDERED   ="ORDERED"   ,     // Đã đặt hàng
  AWAITING_SHIPMENT="AWAITING_SHIPMENT" ,// Chờ chuyển phát
  IN_TRANSIT  ="IN_TRANSIT"   ,   // Đang trung chuyển
  DELIVERED  ="DELIVERED"  ,      // Đã giao đơn hàng
  CANCELED ="CANCELED"     ,     // Đã hủy
}

export interface Payment  {
   id:number;
   method:PaymentMethod,
   status:PaymentStatus,
   isPaid:boolean;
   bankName?:string; // Tên ngân hàng (nếu chuyển khoản)
   payerName?:string; // Tên người chuyển
   transactionId?:string; // Mã giao dịch
   orderId:number;
   createdAt?:Date;
   updatedAt?:Date;


}
export enum PaymentMethod {
  COD  ="COD",            // Thanh toán khi nhận hàng
  BANK_TRANSFER ="BANK_TRANSFER"    // Chuyển khoản ngân hàng
}
export enum PaymentStatus {
  PENDING ="PENDING",     // Đang chờ thanh toán
  COMPLETED ="COMPLETED",   // Đã thanh toán
  FAILED  ="FAILED",
  CANCELED  ="CANCELED"   // Đã hủy thanh toán
}


export interface OrderItemBase  { 
  
  quantity:number;
  unitPrice:number;
  subtotal:number;
  productId:number;
  orderId:number;
}
export interface CreateOrderItem extends Omit<OrderItemBase,"createdAt"|"updatedAt">{};
export interface UpdateOrderItem extends Omit<OrderInterface,"id">{};

interface OrderItem extends OrderItemBase{ 
   id:number;
}



interface OrderBase { 
  userId:number;
  total:number;
  user:{
    name:string;
    address:string;
    phone:string;
    
  }
  status:OrderStatus,
  items:OrderItem[],
  payment?:Payment,
  createdAt?:Date;
  updateAt?:Date;
}

export interface OrderInterface extends OrderBase{
  id:number;

}
export interface CreateNewOrder extends Omit<OrderBase,"createdAt"|"updatedAt">{};


export interface UpdateOrder extends Omit<OrderBase,"id">{
  updatedAt:Date;

};











