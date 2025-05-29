/** @format */

"use client";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Order, Product, Image } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";

import { useEffect, useState } from "react";
import ImageUpload from "@/components/ui/image-upload";

import EditorComponent from "@/components/editor";

export type ProductWithOrderedQuantity = Product & {
  images: Image[]; // Thêm dòng này

  orderedQuantity: number;
};
interface NewsProps {
  initialData: Order | null;
  productOrders: ProductWithOrderedQuantity[];
}

const formSchema = z.object({
  isPaid: z.boolean(),

  orderStatus: z.enum(["pending"]),
});

type NewsFormValues = z.infer<typeof formSchema>;

export const OrderForm: React.FC<NewsProps> = ({
  initialData,
  productOrders,
}) => {
  const params = useParams();
  const router = useRouter();
  const title = initialData ? "Chi tiết đơn hàng  " : "Tạo đơn hàng  ";
  const description = initialData
    ? "Cập nhật đơn hàng  "
    : "Tạo đơn hàng mới  ";
  const toastMessage = initialData ? "Đã cập nhật  " : "Đã tạo đơn hàng mới  ";
  const action = initialData ? "Lưu thay đổi " : "Tạo đơn hàng mới  ";
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [showEditor, setShowEditor] = useState(false);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const form = useForm<NewsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isPaid: initialData?.isPaid ?? false,
    },
  });

  if (!isMounted) return null;

  return (
    <div>
      <Heading title={title} description={description} />

      <Separator className="my-4" />

      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Người đặt hàng
            </p>
            <p className="text-lg font-semibold">{initialData?.username}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Số điện thoại
            </p>
            <p className="text-lg font-semibold">{initialData?.phone}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Địa chỉ</p>
            <p className="text-lg font-semibold">{initialData?.address}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Thanh toán
            </p>
            <p className="text-lg font-semibold">
              {initialData?.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Tổng tiền
            </p>
            <p className="text-lg font-semibold">
              {initialData?.totalPrice.toLocaleString("vi-VN")}₫
            </p>
          </div>
        </div>

        <Separator className="my-4" />

        <div>
          <p className="text-xl font-bold mb-4">Sản phẩm đã đặt</p>

          <div className="space-y-4">
            {productOrders?.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <img
                    src={product.images[0]?.url || ""}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-md border"
                  />
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Số lượng: {product.orderedQuantity}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-muted-foreground">
                    Giá: {product.price.toLocaleString("vi-VN")}₫
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
