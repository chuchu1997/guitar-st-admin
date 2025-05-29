import prismadb from "@/lib/primadb";
// import {SizesClient } from "./components/client";
import { SizesClient } from "./components/client";
import { SizesColumn } from "./components/column";
import { format } from "date-fns"
interface SizePageProps {
  params: Promise<{ storeId: string }>;
}

const SizesPage = async (props: SizePageProps) => {
  const { params } = props;
  const { storeId } = await params;

 
  const sizes = await prismadb.size.findMany({
    where:{
      storeId:storeId
    }
  })

  // const formatSizesColumn: SizesColumn[] = billboards.map((item) => ({
  //   id:item.id,
  //   name:item.
  // }));

  const formatSizesColumn:SizesColumn[] = sizes.map((size)=>({
    id:size.id,
    name:size.name,
    description:size.description ??""
      ,
      createAt: format(size.createAt, "MM/dd/yyyy")
  }))
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizesClient data={formatSizesColumn} />
      </div>
    </div>
  );
};

export default SizesPage;
