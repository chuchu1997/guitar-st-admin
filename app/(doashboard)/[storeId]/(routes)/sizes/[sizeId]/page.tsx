import prismadb from "@/lib/primadb";
import { SizesForm } from "./components/sizes-form";

interface SizePageProps {
  params: Promise<{ sizeId: string }>;
}

const SizePage = async (props: SizePageProps) => {
  const { params } = props;
  const { sizeId } = await params;
  const size  = await prismadb.size.findUnique({
    where: {
      id: sizeId,
    },
  });

  return (
    <div className="flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizesForm initialData={size}></SizesForm>
      </div>
    </div>
  );
};

export default SizePage;
