import prismadb from "@/lib/primadb";
import { ServiceClient } from "./components/client";
import { format } from "date-fns";
import { ServiceColumn } from "./components/column";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";

interface ServicesPageProps {
  params: Promise<{ storeId: string }>;
}

const ServicePage = async (props: ServicesPageProps) => {
  const { params } = props;
  const { storeId } = await params;

  const services = await prismadb.service.findMany({
    where: {
      storeId: storeId,
    },
    include: {
      images: true,
      category: true,
      subcategory: true,
    },
    orderBy: {
      createAt: "desc",
    },
  });

  const formatServiceColumn: ServiceColumn[] = services.map((item) => ({
    id: item.id,
    imageUrl: item.images[0]?.url ?? "",
    name: item.name,
    description: item.description,
    createAt: format(item.createAt, "MMMM do,yyyy"),
    slug: item.slug,
    updateAt: format(item.updateAt, "MMMM do,yyyy"),
    category: item.category.name,
    subCategory: item.subcategory?.name ?? "",
  }));
  const defaultCategory = await prismadb.category.findFirst({
    where: {
      storeId,
      slug: "dich-vu",
    },
  })
  if (!defaultCategory) {
    toast("Chưa có danh mục dịch vụ vui lòng tạo ")
    redirect(`/${storeId}/categories/new`);
  }
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ServiceClient data={formatServiceColumn} />
      </div>
    </div>
  );
};
export default ServicePage;
