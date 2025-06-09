"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { AlertModal } from "@/components/modals/alert-modal";
import { BannerInterface } from "@/types/banner";
import BannerAPI from "@/app/api/banners/banner.api";

interface CellActionProps {
  data: BannerInterface;
}
export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(data.id.toString());
    toast.success("Copy Banner ID Thành Công");
  };
  const onEdit = () => {
    router.push(`/${params.storeId}/banners/${data.id}`);
  };
  const onDelete = async () => {
    try {
      setLoading(true);
      await BannerAPI.deleteBanner(data.id);
      window.location.href =  `/${params.storeId}/banners`
   

      // await axios.delete(`/api/${params.storeId}/banners/${id}`);
      // router.refresh();
      // toast.success("Xoá Banner thành công !!");
    } catch (err) {
      toast.error("Something went wrong !!");
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
        }}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} size={"icon"} className="h-8 w-8 p-0">
            <span className="sr-only">Open Menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="">Thao tác</DropdownMenuLabel>
          <DropdownMenuItem
            className="flex items-center mb-2 cursor-pointer"
            onClick={() => onCopy()}
          >
            <Copy className="mr-2 h-4 w-4" />
            <span className="text-sm font-base">Copy ID </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center mb-2 cursor-pointer"
            onClick={() => onEdit()}
          >
            <Edit className="mr-2 h-4 w-4" />
            <span>Chỉnh sửa</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center mb-2 cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <Trash className="mr-2 h-4 w-4" />
            <span> Xóa </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
