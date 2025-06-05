/** @format */

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import Image from "next/image";
import { ProductInterface } from "@/types/product";
import { FormatUtils } from "@/utils/format";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<ProductInterface>[] = [
  {
    accessorKey: "name",
    header: "Tên san phẩm",
    cell: ({ row }) => row.original.name,
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
          src={row.original.images[0].url}
          fill
          className="object-cover rounded-xl"
          loading="eager" // ✅ Ensures images load immediately
          alt="image-product"></Image>
      </div>
    ),
  },

  // {
  //   accessorKey: "subCategory",
  //   header: "Danh mục con ",
  //   cell: ({ row }) => (
  //     <div className="capitalize">{row.original.subCategory}</div>
  //   ),
  // },

  {
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }) => row.original.sku,
  },

  {
    accessorKey: "price",
    header: "Giá",
    cell: ({ row }) => FormatUtils.formatPriceVND(row.original.price),
  },

  {
    accessorKey: "isFeatured",
    header: "Nổi bật",
  },

  {
    accessorKey: "createAt",
    header: "Ngày tạo",
    cell: ({ row }) => FormatUtils.formatDate(row.original.createdAt ?? ""),
  },
  {
    accessorKey: "stock",
    header: "Số lượng",
  },
  {
    header: "Thao tác",
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
