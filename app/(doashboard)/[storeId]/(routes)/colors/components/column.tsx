/** @format */

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ColorsColumn = {
  id: string;
  name: string;
  hexCode: string;
  createAt: string;
};

export const columns: ColumnDef<ColorsColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "hexCode",
    header: "Hex Code",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-3">
        <span>{row.original.hexCode} </span>
        <div
          className={`relative h-[20px] w-[20px] rounded-full`}
          style={{ backgroundColor: row.original.hexCode }}></div>
      </div>
    ),
  },

  {
    accessorKey: "createAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
