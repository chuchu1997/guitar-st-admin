import prismadb from "@/lib/primadb";
import { ProductForm } from "./components/product.form";
// import { CategoryForm } from "./components/category-form";
// import { BillboardsForm } from "./components/billboard-form";
import { Size, Color, Product } from "@prisma/client";

interface ProductPageProps {
  params: Promise<{ slug: string; storeId: string }>;
}

const ProductPage = async (props: ProductPageProps) => {
  const { params } = props;
  const { slug, storeId } = await params;
 
  const product = await prismadb.product.findUnique({
    where: {
      slug: decodeURIComponent(slug),
      storeId: storeId,
    },
    include: {
      category: {
        include: {
          subcategories: true, // ✅ Include subcategories here!
        },
      }
      ,

      productSizes: {
        include: {
          size: true, // Include the size details
        },
      },

      productColors: {
        include: {
          color: true, // Include the color details
        },
      },
      images: true, // Include related image if required by ProductForm
    },
  });
  
  let sizes: Size[] = [];
  let colors: Color[] = [];
  // Lấy danh sách màu sắc từ productColors nếu đã include
  if (!product?.productColors || product.productColors.length === 0) {
    colors = await prismadb.color.findMany({
      where: {
        storeId: storeId,
      },
    });
  } else {
    colors = product.productColors.map((productColor) => productColor.color); // hoặc lấy từ product.productSizes nếu đã include
  }

  sizes = await prismadb.size.findMany({
    where: {
      storeId: storeId,
    },
  });

  const defaultCategory = await prismadb.category.findFirst({
    where: {
      storeId,
      slug: "san-pham",
    },
  });
  return (
    <div className="flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialData={product}
          sizes={sizes}
          colors={colors}
          defaultCategoryId={defaultCategory?.id}
        />
      </div>
    </div>
  );
};

export default ProductPage;
