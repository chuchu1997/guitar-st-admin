import prismadb from "@/lib/primadb";
import { OrderClient } from "./components/client";
import { format } from "date-fns";
import { OrderColumn } from "./components/column";

interface OrderpageProps {
  params: Promise<{ storeId: string }>;
}

const OrderPage = async (props: OrderpageProps) => {
  const { params } = props;
  const { storeId } = await params;


  const orders = await prismadb.order.findMany({
    where:{
      storeId
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  })


  const formattedOrders: OrderColumn[] = orders.map((order) => ({
    id: order.id,
    address:order.address,
    username: order.username,
    phone: order.phone,
    totalPrice:order.totalPrice,
    createdAt: format(order.createAt, "MMMM do, yyyy"),
    items: order.orderItems.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price, // fallback nếu chưa snapshot giá
    })),
  }));

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};
export default OrderPage;
