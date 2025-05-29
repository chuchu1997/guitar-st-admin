import prismadb from "@/lib/primadb";
import { NewsForm } from "./components/new-form";
// import { CategoryForm } from "./components/category-form";
// import { BillboardsForm } from "./components/billboard-form";
import { Size, Color } from "@prisma/client";

interface NewPageProps {
  params: Promise<{ slug: string; storeId: string }>;
}

const NewPage = async (props: NewPageProps) => {
  const { params } = props;
  const { slug, storeId } = await params;

  const news = await prismadb.news.findUnique({
    where: {
      slug: slug,
      storeId: storeId,
    },
  });
  

 
  return (
    <div className="flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <NewsForm
          initialData={news}
        
        />
      </div>
    </div>
  );
};

export default NewPage;
