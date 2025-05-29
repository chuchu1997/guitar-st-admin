import prismadb from "@/lib/primadb";
import { BillboardClient } from "./components/client";
import { BillboardColumn } from "./components/column";
import { format } from "date-fns";
interface BillboardPageProps {
  params: Promise<{ storeId: string }>;
}

const BillboardsPage = async (props: BillboardPageProps) => {
  const { params } = props;
  const { storeId } = await params;

  console.log("STORE ID", storeId);
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: storeId,
    },
    orderBy: {
      createAt: "desc",
    },
  });

  const formatBillboardColumn: BillboardColumn[] = billboards.map((item) => ({
    imageUrl: item.imageUrl,
    id: item.id,
    isActiveBanner: item.isActiveBanner,
    label: item.label,
    createAt: format(item.createAt, "dd/MM/yyyy"),
  }));
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formatBillboardColumn} />
      </div>
    </div>
  );
};

export default BillboardsPage;
