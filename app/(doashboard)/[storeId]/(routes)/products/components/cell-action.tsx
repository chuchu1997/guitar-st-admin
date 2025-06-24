/** @format */

"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { AlertModal } from "@/components/modals/alert-modal";
import ActionDropdown from "@/components/action-dropdown";
import { ProductInterface } from "@/types/product";
import ProductAPI from "@/app/api/products/products.api";

interface CellActionProps {
  data: ProductInterface;
}
export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(data.id.toString());
    toast.success("Copy Category ID Thành Công");
  };
  const onEdit = () => {
    router.push(`/${data.storeId}/products/${data.slug}`);
  };
  const onDelete = async () => {
    try {
      setLoading(true);
      let response = await ProductAPI.removeProduct(data.id.toString());
      if (response.status === 200) {
        const { message, product } = response.data as {
          product: ProductInterface;
          message: string;
        };
        toast.success(message);
        setTimeout(() => {
          window.location.reload(); // F5 lại trang
        }, 1000); // Chờ 1.5 giây cho toast hiển thị xong
      }
    } catch (err) {
      toast.error(
        "Hãy đảm bảo xóa toàn bộ products liên kết với categories trước khi xóa  !!"
      );
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
