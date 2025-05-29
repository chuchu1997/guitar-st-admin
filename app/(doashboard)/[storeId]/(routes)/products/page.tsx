import prismadb from "@/lib/primadb";
import { ProductClient } from "./components/client";
import { format } from "date-fns";
import { ProductColumn } from "./components/column";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";

interface CategoriesPageProps {
  params: Promise<{ storeId: string }>;
}

const ProductPage = async (props: CategoriesPageProps) => {
  const { params } = props;
  const { storeId } = await params;


  const products = await prismadb.product.findMany({
    where: {
      storeId: storeId,
    },
    include: {
      images:true,
      category: true,
      subcategory:true,
    },
    orderBy: {
      createAt: "desc",
    },
  });
  const formatProductsColumn: ProductColumn[] = products.map((item) => ({
    id: item.id,
    subCategory: item.subcategory?.name ?? '',
    imageUrl: item.images[0]?.url ?? '',
    name: item.name,
    createAt: format(item.createAt, "MMMM do,yyyy"),
    isFeatured: item.isFeatured ,
    isArchieved: item.isArchived ,
    sku: item.sku || "",
    category: item.category.name,
    price:Number(item.price),
    slug:item.slug,
    stock:item.stockQuantity
    
  }));

    const defaultCategory = await prismadb.category.findFirst({
      where: {
        storeId,
        slug: "san-pham",
      },
    });
    
    if (!defaultCategory) {
      toast("Chưa có danh mục sản phẩm vui lòng tạo ")
      redirect(`/${storeId}/categories/new`);
    }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formatProductsColumn} />
      </div>
    </div>
  );
};
export default ProductPage;
