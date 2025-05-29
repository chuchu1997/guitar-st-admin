"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import Image from "next/image";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type CategoryColumn = {
  id: string;
  name: string;
  billboardLabel?: string;
  createAt: string;
  billboardImageUrl:string;
  slug:string;


};

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Tên danh mục",
    cell: ({ row }) => <div className = "capitalize font-semibold">{row.original.name}</div>,
  },

  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => row.original.slug,
  },
  {
    accessorKey: "billboardLabel",
    header: "Tên hình đại diện",
    cell: ({ row }) => row.original.billboardLabel,
  },

  
  {
    accessorKey: "billboardImage",
    header: "Hình đại diện",
   cell: ({ row }) => (
         <div className="relative w-[80px] h-[80px] ">
           <Image
             src={row.original.billboardImageUrl}
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
  },

  {
    header: "Thao tác ",
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
