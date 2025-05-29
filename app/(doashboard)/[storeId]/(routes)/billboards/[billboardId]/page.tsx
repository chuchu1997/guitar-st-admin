import prismadb from "@/lib/primadb";
import { BillboardsForm } from "./components/billboard-form";

interface BillboardPageProps {
  params: Promise<{ billboardId: string }>;
}

const BillboardPage = async (props: BillboardPageProps) => {
  const { params } = props;
  const { billboardId } = await params;
  const billboards = await prismadb.billboard.findUnique({
    where: {
      id: billboardId,
    },
  });

  return (
    <div className="flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardsForm initialData={billboards}></BillboardsForm>
      </div>
    </div>
  );
};

export default BillboardPage;
