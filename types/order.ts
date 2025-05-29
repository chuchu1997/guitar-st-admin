export interface OrderItemInput {
    productId: string;
    quantity: number;
  }
  
 export interface CreateOrderInput {
    customerID:string;
    isPaid: boolean;
    phone: string;
    username: string;
    address: string;
    note?: string;
    paymentMethod?: string;
    orderItems: OrderItemInput[];
    totalPrice:number;

  }


