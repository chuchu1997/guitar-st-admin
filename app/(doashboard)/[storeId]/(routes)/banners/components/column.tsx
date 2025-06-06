/** @format */

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import Image from "next/image";
import { BannerInterface } from "@/types/banner";
import { FormatUtils } from "@/utils/format";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<BannerInterface>[] = [
  {
    accessorKey: "label",
    header: "Tên hình",
  },

  {
    accessorKey: "imageUrl",
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
    accessorKey: "isActiveBanner",
    header: "Hiển thị ở banner",
    cell: ({ row }) => (
      <div className="font-semibold italic ">
        {row.original.isActive ? "Có hiển thị" : "Không hiển thị "}
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
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
