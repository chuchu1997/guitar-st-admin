import prismadb from "@/lib/primadb";
import { format } from "date-fns";
import { CategoryClient } from "./client";
import { CategoryColumn } from "./column";

const CategoryWrapper = async ({ storeId }: { storeId: string }) => {

  const subCategories = await prismadb.subcategory.findMany({
    where: { storeId },
    include: { billboard: true, category: true },
    orderBy: { createdAt: "desc" },
  });

  const formatted: CategoryColumn[] = subCategories.map((item) => ({
    slug: item.slug,
    id: item.id,
    name: item.name,
    billboardImageUrl: item.billboard.imageUrl,
    billboardLabel: item.billboard.label,
    parentCategory: item.category.name,
    createAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return <CategoryClient data={formatted} />;
};

export default CategoryWrapper;