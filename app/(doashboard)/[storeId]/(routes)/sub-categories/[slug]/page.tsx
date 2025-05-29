import prismadb from "@/lib/primadb";
import { CategoryForm } from "./components/category-form";
// import { BillboardsForm } from "./components/billboard-form";

interface CategoryPage {
  params: Promise<{ slug: string; storeId: string }>;
}

const CategogyPage = async (props: CategoryPage) => {
  const { params } = props;
  const { slug, storeId } = await params;


  const categories = await prismadb.category.findMany({
    where:{
      storeId
    },
   
  })
  const subCategory = await prismadb.subcategory.findUnique({
    where: {
      slug:slug,
    },
    include:{
      category:true
    }
  });
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: storeId,
    },
    select: {
      id: true,
      storeId: true,
      createAt: true,
      updateAt: true,
      label: true,
      imageUrl: true,
      isActiveBanner:true,
      linkHref:true
    },
  });

  return (
    <div className="flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm
          billboards={billboards}
          parentCategories = {categories}
          initialData={subCategory}
        ></CategoryForm>
      </div>
    </div>
  );
};

export default CategogyPage;
