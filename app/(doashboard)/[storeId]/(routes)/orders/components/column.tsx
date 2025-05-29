/** @format */

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import Image from "next/image";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type OrderColumn = {
  id: string;
  username: string;
  phone: string;
  address: string;

  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  createdAt: string;
  totalPrice: number;
};
export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "name",
    header: "Tên người đặt  ",
    cell: ({ row }) => row.original.username,
  },
  {
    accessorKey: "phone",
    header: "Số điện thoại",
    cell: ({ row }) => row.original.phone,
  },
  {
    accessorKey: "address",
    header: "Địa chỉ",
    cell: ({ row }) => row.original.address,
  },
  {
    accessorKey: "totalPrice",
    header: "Tổng giá trị đơn hàng",
    cell: ({ row }) => row.original.totalPrice,
  },

  {
    header: "Thao tác",
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
