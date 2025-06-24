import { OrderForm} from "./components/order-form";
// import { CategoryForm } from "./components/category-form";
// import { BillboardsForm } from "./components/billboard-form";

interface OrderPageProps {
  params: Promise<{ id: string; storeId: string }>;
}

const OrderPage = async (props: OrderPageProps) => {
  const { params } = props;
  const { id, storeId } = await params;



  //MAP STOCK WITH ORDER !!!
  // const productsWithOrderedQuantity: ProductWithOrderedQuantity[] = order?.orderItems.map((item) => ({
  //   ...item.product,
  //   orderedQuantity: item.quantity,
  // })) || [];

 
  return (
    <div className="flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderForm
          initialData={null}
          // productOrders={[]}
        />
      </div>
    </div>
  );
};

export default OrderPage;
