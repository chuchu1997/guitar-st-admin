/** @format */

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import Image from "next/image";
import { ArticleInterface } from "@/types/news";
import { FormatUtils } from "@/utils/format";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<ArticleInterface>[] = [
  {
    accessorKey: "name",
    header: "Tên bài viết ",
    cell: ({ row }) => row.original.title,
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => row.original.slug,
  },
  {
    accessorKey: "image",
    header: "Hình ảnh",
    cell: ({ row }) => (
      <div className="relative w-[80px] h-[80px] ">
        <Image
          src={row.original.imageUrl ?? ""}
          fill
          className="object-cover rounded-xl"
          loading="eager" // ✅ Ensures images load immediately
          alt="image-product"></Image>
      </div>
    ),
  },
  {
    accessorKey: "createAt",
    header: "Ngày tạo",
    cell: ({ row }) => (
      <div>{FormatUtils.formatDate(row.original.createdAt ?? "")}</div>
    ),
  },

  {
    header: "Thao tác",
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
