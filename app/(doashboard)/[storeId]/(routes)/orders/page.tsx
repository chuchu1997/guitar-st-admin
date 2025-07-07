import { OrderClient } from "./components/client";
import { format } from "date-fns";
import { OrderColumn } from "./components/column";


const OrderPage =  () => {

 
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 ">
        <OrderClient  />
      </div>
    </div>
  );
};
export default OrderPage;
