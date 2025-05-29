import prismadb from "@/lib/primadb";
import { CategoryClient } from "./components/client";
import { format } from "date-fns";
import { CategoryColumn as CategoriesColumn } from "./components/column";
import { Suspense } from "react";
import Loading from "@/components/loading";
import CategoryWrapper from "./components/categories-wrapper";

interface SubCategoriesPage {
  params: Promise<{ storeId: string }>;
}

const SubCategoryPage = async (props: SubCategoriesPage) => {
  const { params } = props;
  const { storeId } = await params;


  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
      <Suspense fallback={<Loading/>}>
      <CategoryWrapper storeId={storeId}/>
      </Suspense>
        {/* <BillboardClient data={formatBillboardColumn} /> */}
      </div>
    </div>
  );
};
export default SubCategoryPage;
