/** @format */

"use client";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Billboard } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import { userOrigin } from "@/hooks/use-origin";
import ImageUpload from "@/components/ui/image-upload";
import { Checkbox } from "@/components/ui/checkbox";

interface BillboardsProps {
  initialData: Billboard | null;
}

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
  isActiveBanner: z.boolean(),
  linkHref: z.string().optional(),
});

type BillboardsFormValues = z.infer<typeof formSchema>;

export const BillboardsForm: React.FC<BillboardsProps> = ({ initialData }) => {
  const params = useParams();

  const router = useRouter();

  const [isReady, setIsReady] = useState(false);

  const title = initialData ? "Chỉnh sửa hình ảnh" : "Tạo hình ảnh  ";
  const description = initialData
    ? "Chỉnh sửa hình ảnh "
    : "Tạo 1 hình ảnh mới ";
  const toastMessage = initialData ? "Đã Chỉnh Sửa " : "Đã Tạo mới ";
  const action = initialData ? "Lưu Thay Đổi " : "Tạo mới hình ảnh";
  useEffect(() => {
    if (params.storeId) {
      setIsReady(true);
    }
  }, [params]);

  const [open, setOpen] = useState(false);
  const origin = userOrigin();

  const [loading, setLoading] = useState(false);
  const form = useForm<BillboardsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? { ...initialData, linkHref: initialData.linkHref ?? "" }
      : {
          isActiveBanner: false,
          label: "",
          imageUrl: "",
        },
  });

  const onSubmit = async (data: BillboardsFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/billboards/`);
      toast.success(toastMessage);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      toast.error("Something when wrong !!");
    } finally {
      setLoading(false);
    }
  };
  const onDelete = async () => {
    try {
      setLoading(true);

      await axios.delete(
        `/api/${params.storeId}/billboards/${params.billboardId}`
      );
      router.refresh();
      toast.success("Xóa billboard thành công !!");
    } catch (err) {
      toast.error(
        "Make sure you removed all categories using this billboard first !!"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        loading={loading}
        onConfirm={async () => {
          await onDelete();
          setOpen(false);
        }}
      />
      <div className="flex items-center justify-between my-4">
        <Heading title={title} description={description} />
        {/* BUTTON DELETE JUST WORKING ON EDIT MODE  */}
        {initialData && (
          <Button
            variant="destructive"
            size="icon"
            disabled={loading}
            onClick={async () => {
              setOpen(true);
            }}>
            <Trash className="w-4 h-4 "></Trash>
          </Button>
        )}
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" w-full">
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chọn Hình Ảnh </FormLabel>
                <FormDescription className="text-muted-foreground text-sm">
                  (Nếu là banner, hãy chọn hình ảnh có kích thước{" "}
                  <strong>1920x880</strong> để tối ưu nhất)
                </FormDescription>
                <FormControl>
                  <ImageUpload
                    disabled={loading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                    value={field.value ? [field.value] : []}></ImageUpload>
                </FormControl>
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8 mt-[15px]">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên hình </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      {...field}
                      placeholder="Tên hình   "></Input>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="linkHref"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đường dẫn hình ảnh </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      {...field}
                      placeholder="Nếu hình ảnh có đường dẫn thì hãy nhập   "></Input>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActiveBanner"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      onCheckedChange={field.onChange}
                      checked={field.value}></Checkbox>
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Được hiển thị ở Banner ? </FormLabel>
                    <FormDescription>
                      (Nếu check vào thì hình ảnh này được hiển thị ở Banner )
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <Button disabled={loading} className="ml-auto mt-4" type="submit">
            {action}
          </Button>
        </form>
      </Form>

      <Separator />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      />
    </div>
  );
};
