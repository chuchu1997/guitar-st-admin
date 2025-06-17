/** @format */

"use client";

import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { AlertModal } from "@/components/modals/alert-modal";
import ActionDropdown from "@/components/action-dropdown";
import ArticleAPI from "@/app/api/articles/article.api";
import { ArticleInterface } from "@/types/news";
import { PromotionType } from "@/types/promotions";

interface CellActionProps {
  data: PromotionType;
}
export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(data.id.toString());
    toast.success("Copy News ID Thành Công");
  };
  const onEdit = () => {
    // router.push(`/${params.storeId}/news/${data.slug}`);
  };
  const onDelete = async () => {
    try {
      setLoading(true);
      let response = await ArticleAPI.deleteArticle(data.id);
      if (response.status !== 200) {
        toast.error("Xoá Bài viết thất bại !!");
        return;
      } else {
        router.push(`/${params.storeId}/news`);
        toast.success("Xoá Bài viết  thành công !!");
      }
    } catch (err) {
      toast.error("Có lỗi ở đâu đó   !!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <AlertModal
        loading={loading}
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          onDelete();
          setOpen(false);
        }}
      />

      <ActionDropdown
        onCopy={onCopy}
        onEdit={onEdit}
        onDelete={onDelete}
        onOpenDeleteModal={() => setOpen(true)}
      />
    </>
  );
};
