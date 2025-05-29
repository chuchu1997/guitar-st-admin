import prismadb from "@/lib/primadb";
import { OrderForm, ProductWithOrderedQuantity } from "./components/order-form";
// import { CategoryForm } from "./components/category-form";
// import { BillboardsForm } from "./components/billboard-form";
import { Size, Color } from "@prisma/client";

interface OrderPageProps {
  params: Promise<{ id: string; storeId: string }>;
}

const OrderPage = async (props: OrderPageProps) => {
  const { params } = props;
  const { id, storeId } = await params;

  const order = await prismadb.order.findUnique({
    where: {
      id:id,
      storeId: storeId,
    }
    ,
    include:{
      orderItems:{
        include:{
          product:{
            include:{
              images:true
            }
          }
        }
      }

    }
  });

  //MAP STOCK WITH ORDER !!!
  const productsWithOrderedQuantity: ProductWithOrderedQuantity[] = order?.orderItems.map((item) => ({
    ...item.product,
    orderedQuantity: item.quantity,
  })) || [];

 
  return (
    <div className="flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderForm
          initialData={order}
          productOrders={productsWithOrderedQuantity}
        />
      </div>
    </div>
  );
};

export default OrderPage;
