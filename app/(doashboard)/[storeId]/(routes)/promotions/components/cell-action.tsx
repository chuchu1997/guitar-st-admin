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
import { PromotionAPI } from "@/app/api/promotions/promotion.api";

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
    console.log(data);
    router.push(`/${params.storeId}/promotions/${data.id}`);
  };
  const onDelete = async () => {
    try {
      setLoading(true);
      let response = await PromotionAPI.deletePromotion(data.id);
      if (response.status !== 200) {
        toast.error("Xoá chương trình thất bại !!");
        return;
      } else {
        toast.success("Xoá Chương trình thành công  !!");
      }
    } catch (err) {
      toast.error("Có lỗi ở đâu đó   !!");
    } finally {
      window.location.href = `/${params.storeId}/promotions`;

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
