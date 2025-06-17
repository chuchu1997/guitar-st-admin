/** @format */

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import Image from "next/image";
import { FormatUtils } from "@/utils/format";
import { PromotionType } from "@/types/promotions";
import { Badge } from "@/components/ui/badge";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<PromotionType>[] = [
  {
    accessorKey: "name",
    header: "Tên khuyến mãi  ",
    cell: ({ row }) => row.original.name,
  },

  {
    accessorKey: "isActive",
    header: "Trạng thái",
    cell: ({ row }) => (
      <div>
        {row.original.isActive ? (
          <Badge>Đang hoạt động</Badge>
        ) : (
          <Badge>Đang hoạt động</Badge>
        )}
      </div>
    ),
  },
  {
    accessorKey: "startDate",
    header: "Ngày bắt đầu",
    cell: ({ row }) => (
      <div>{FormatUtils.formatDate(row.original.startDate ?? "")}</div>
    ),
  },
  {
    accessorKey: "endDate",
    header: "Ngày kết thúc",
    cell: ({ row }) => (
      <div>{FormatUtils.formatDate(row.original.endDate ?? "")}</div>
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
