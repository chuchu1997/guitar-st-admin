import prismadb from "@/lib/primadb";
import { ServiceForm } from "./components/service.form";
// import { CategoryForm } from "./components/category-form";
// import { BillboardsForm } from "./components/billboard-form";

interface ProductPageProps {
  params: Promise<{ slug: string; storeId: string }>;
}

const ServicePage = async (props: ProductPageProps) => {
  const { params } = props;
  const { slug, storeId } = await params;



  const service = await prismadb.service.findUnique({
    where: {
      slug: slug,
      storeId: storeId,
    },
    include: {
      category: true,
      subcategory:true,
      images: true, // Include related image if required by ProductForm
    },
  });
  const defaultCategory = await prismadb.category.findFirst({
    where: {
      storeId,
      slug: "dich-vu",
    },
  });


  return (
    <div className="flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ServiceForm initialData={service} defaultCategoryId={defaultCategory?.id} />
      </div>
    </div>
  );
};

export default ServicePage;
