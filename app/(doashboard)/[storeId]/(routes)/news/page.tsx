import prismadb from "@/lib/primadb";
import { NewsClient } from "./components/client";
import { format } from "date-fns";
import { NewsColumn } from "./components/column";

interface NewsPageProps {
  params: Promise<{ storeId: string }>;
}

const NewsPage = async (props: NewsPageProps) => {
  const { params } = props;
  const { storeId } = await params;



  const news = await prismadb.news.findMany({
    where:{
      storeId:storeId
    }
  })


  const formatNewsColumn :NewsColumn[] = news.map((item)=>({
    id: item.id,
    title: item.title,
    imageUrl: item.imageUrl ?? "", // Provide a fallback value for null
    slug: item.slug,
    createAt: format(item.createdAt, "MMMM do,yyyy"),
  }))

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <NewsClient data={formatNewsColumn} />
      </div>
    </div>
  );
};
export default NewsPage;
