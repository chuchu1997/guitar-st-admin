import prismadb from "@/lib/primadb";
import { ColorsForm } from "./components/colors-form";

interface ColorPageProps {
  params: Promise<{ colorId: string }>;
}

const SizePage = async (props: ColorPageProps) => {
  const { params } = props;
  const { colorId } = await params;
  const color = await prismadb.color.findUnique({
    where: {
      id: colorId,
    },
  });

  return (
    <div className="flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorsForm initialData={color}></ColorsForm>
      </div>
    </div>
  );
};

export default SizePage;
