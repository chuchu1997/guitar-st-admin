import prismadb from "@/lib/primadb";
// import {SizesClient } from "./components/client";
import { ColorsClient } from "./components/client";
import { ColorsColumn } from "./components/column";
import { format } from "date-fns"
interface ColorPageProps {
  params: Promise<{ storeId: string }>;
}

const ColorPage = async (props: ColorPageProps) => {
  const { params } = props;
  const { storeId } = await params;

 
  const colors = await prismadb.color.findMany({
    where:{
      storeId:storeId
    }
  })

  // const formatSizesColumn: SizesColumn[] = billboards.map((item) => ({
  //   id:item.id,
  //   name:item.
  // }));

  const formatColorsColumn:ColorsColumn[] = colors.map((color)=>({
    id:color.id,
    name:color.name,
    hexCode:color.hexCode ?? "",
    createAt:format(color.createdAt,"MM/dd/yyyy")

  }))
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorsClient data={formatColorsColumn} />
      </div>
    </div>
  );
};

export default ColorPage;
