"use client";

import * as z from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { ProductInterface } from "@/types/product";
import { OrderInterface, OrderStatus } from "@/types/order";


export type ProductWithOrderedQuantity = ProductInterface & {
  orderedQuantity: number;
};

interface OrderFormProps {
  initialData: OrderInterface | null;
  // productOrders: ProductWithOrderedQuantity[];
}const orderStatusValues = Object.values(OrderStatus) as [string, ...string[]];

const formSchema = z.object({
  orderStatus: z.enum(orderStatusValues),
});

type OrderFormValues = z.infer<typeof formSchema>;

export const OrderForm: React.FC<OrderFormProps> = ({ initialData }) => {
  const router = useRouter();
  const params = useParams();

  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orderStatus: initialData?.status || OrderStatus.ORDERED ,
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const onSubmit = async (data: OrderFormValues) => {
    try {
      setLoading(true);
      await axios.patch(`/api/orders/${initialData?.id}`, data);
      toast.success("Cập nhật trạng thái đơn hàng thành công");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Heading title="Chi tiết đơn hàng" description="Xem và cập nhật trạng thái đơn hàng" />
      <Separator className="my-4" />

      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Người đặt hàng</p>
            <p className="text-lg font-semibold">{initialData?.user.name}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Số điện thoại</p>
            <p className="text-lg font-semibold">{initialData?.user.phone}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Địa chỉ</p>
            <p className="text-lg font-semibold">{initialData?.user.address}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Thanh toán</p>
            <p className="text-lg font-semibold">
              {initialData?.payment?.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Tổng tiền</p>
            <p className="text-lg font-semibold">
              {initialData?.total?.toLocaleString("vi-VN")}₫
            </p>
          </div>
        </div>

        <Separator className="my-4" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="orderStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái đơn hàng</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger disabled={loading}>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Đang chờ</SelectItem>
                      <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                      <SelectItem value="shipped">Đang giao</SelectItem>
                      <SelectItem value="completed">Hoàn thành</SelectItem>
                      <SelectItem value="cancelled">Đã hủy</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              Lưu thay đổi
            </Button>
          </form>
        </Form>

        <Separator className="my-4" />

        {/* <div>
          <p className="text-xl font-bold mb-4">Sản phẩm đã đặt</p>
          <div className="space-y-4">
            {productOrders?.map((product:any) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
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
        </div> */}
      </div>
    </div>
  );
};
