/** @format */

"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { columns } from "./column";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";
import { useEffect, useState } from "react";
import { ArticleInterface } from "@/types/news";
import ArticleAPI from "@/app/api/articles/article.api";

export const NewsClient = () => {
  const { storeId } = useParams();
  const [news, setNews] = useState<ArticleInterface[]>([]);
  const [totalNews, setTotalNews] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    fetchArticles();
  }, []);
  const fetchArticles = async () => {
    if (storeId) {
      let response = await ArticleAPI.getArticlesWithStoreID({
        storeId: Number(storeId.toString()),
        currentPage: 1,
      });
      if (response.status === 200) {
        console.log("DATA", response.data);
        const { articles, total } = response.data as {
          articles: ArticleInterface[];
          total: number;
        };
        if (articles) {
          setNews(articles);
          setTotalNews(total);
        }
      }
    }
  };

  return (
    <>
      <div className="flex items-center justify-between ">
        <Heading
          title={`Tin tức  (${totalNews})`}
          description={"Tất cả Tin tức trong Store  "}
        />
        <Button
          className="cursor-pointer"
          onClick={() => router.push(`/${storeId}/news/new`)}>
          <Plus className="w-4 h-4"></Plus>
          Tạo mới
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={news}></DataTable>
      {/* <Heading title={"API"} description={"API Call for products"} />
      <Separator />
      <ApiList entityName="news" entityIdName="slug" /> */}
    </>
  );
};
