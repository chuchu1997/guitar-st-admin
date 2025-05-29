import prismadb from "@/lib/primadb";
import { CategoryForm } from "./components/category-form";
// import { BillboardsForm } from "./components/billboard-form";

interface CategoryPage {
  params: Promise<{ slug: string; storeId: string }>;
}

const CategogyPage = async (props: CategoryPage) => {
  const { params } = props;
  const { slug, storeId } = await params;

  const category = await prismadb.category.findUnique({
    where: {
      slug:slug,
     
    },
  });
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: storeId,
    },
    select: {
      isActiveBanner:true,
      id: true,
      storeId: true,
      createAt: true,
      updateAt: true,
      label: true,
      imageUrl: true,
      linkHref:true
    },
  });

  return (
    <div className="flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm
          billboards={billboards}
          initialData={category}
          
        ></CategoryForm>
      </div>
    </div>
  );
};

export default CategogyPage;
