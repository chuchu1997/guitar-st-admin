/** @format */

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import Image from "next/image";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ServiceColumn = {
  id: string;
  imageUrl: string;
  name: string;
  description: string;
  createAt: string;
  updateAt: string;
  slug: string;
  category: string;
  subCategory: string;
};

export const columns: ColumnDef<ServiceColumn>[] = [
  {
    accessorKey: "name",
    header: "Tên dịch vụ",
    cell: ({ row }) => row.original.name,
  },

  {
    accessorKey: "image",
    header: "Hình ảnh ",
    cell: ({ row }) => (
      <div className="relative w-[80px] h-[80px] ">
        <Image
          src={row.original.imageUrl}
          fill
          className="object-cover rounded-xl"
          loading="eager" // ✅ Ensures images load immediately
          alt="image-product"></Image>
      </div>
    ),
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },

  {
    accessorKey: "category",
    header: "Thuộc danh mục",
  },

  {
    accessorKey: "subCategory",
    header: "Danh mục con",
  },
  {
    accessorKey: "createAt",
    header: "Ngày tạo",
  },
  {
    accessorKey: "updateAt",
    header: "Ngày cập nhật",
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
