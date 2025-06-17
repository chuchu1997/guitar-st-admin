/** @format */

"use client";
import { useParams } from "next/navigation";
import { PromotionForm } from "./components/new-form";
import { useEffect, useState } from "react";
import ArticleAPI from "@/app/api/articles/article.api";
import { ArticleInterface } from "@/types/news";

const NewPage = () => {
  const { id, storeId } = useParams();

  const [initialData, setInitialData] = useState<ArticleInterface | null>(null);

  useEffect(() => {
    fetchPromotionByID();
  }, []);
  const fetchPromotionByID = async () => {
    if (id && id !== "new") {
      // CAN GET WITH SLUG
      // let response = await ArticleAPI.getArticlesWithStoreID({
      //   storeId: Number(storeId),
      //   slug: slug.toString(),
      //   currentPage: 1,
      //   limit: 1,
      // });
      // if (response.status === 200) {
      //   const { articles } = response.data as {
      //     articles: ArticleInterface[];
      //   };
      //   if (articles.length > 0) {
      //     setInitialData(articles[0]);
      //   }
      // }
    }
  };

  return (
    <div className="flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PromotionForm initialData={initialData} />
      </div>
    </div>
  );
};

export default NewPage;
