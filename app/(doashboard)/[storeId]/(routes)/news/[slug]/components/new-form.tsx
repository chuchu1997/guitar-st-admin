/** @format */

"use client";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { News } from "@prisma/client";
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

interface NewsProps {
  initialData: News | null;
}

const formSchema = z.object({
  title: z.string().min(1),
  imageUrl: z.string().min(1),
  content: z.string().min(1),
  slugData: z.string().min(1),
});

type NewsFormValues = z.infer<typeof formSchema>;

export const NewsForm: React.FC<NewsProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const title = initialData ? "Chỉnh sửa bài viết " : "Tạo bài viết ";
  const description = initialData
    ? "Chỉnh sửa bài viết "
    : "Tạo bài viết  mới ";
  const toastMessage = initialData ? "Đã chỉnh sửa " : "Đã tạo bài viết ";
  const action = initialData ? "Lưu thay đổi " : "Tạo bài viết ";
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [showEditor, setShowEditor] = useState(false);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const form = useForm<NewsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          imageUrl: initialData.imageUrl || "",
          slugData: initialData.slug,
        }
      : {
          title: "",
          slugData: "",
          imageUrl: "",
          content: "",
        },
  });

  const onSubmit = async (data: NewsFormValues) => {
    console.log("data", data);
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/news/${params.slug}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/news`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/news/`);
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

      await axios.delete(`/api/${params.storeId}/news/${params.slug}`);
      router.refresh();
      toast.success("Xóa Bài Viết  thành công !!");
    } catch (err) {
      toast.error(
        `Make sure you removed all products using this category first !! ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) return <>Chưa có dữ liệu</>;
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
          <div className="grid grid-cols-2 gap-8 mt-[15px]">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên của bài viết </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      {...field}
                      placeholder="Tên bài viết    "></Input>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả sản phẩm </FormLabel>
                  {!showEditor ? (
                    <div
                      className="border p-4 rounded-lg text-gray-500 cursor-pointer hover:bg-gray-100"
                      onClick={() => setShowEditor(true)}>
                      ✍️ Click để thêm mô tả
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <FormControl>
                        <EditorComponent
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>

                      <div className="text-right">
                        <Button
                          type="button"
                          onClick={() => setShowEditor(false)}>
                          Ẩn Text Editor
                        </Button>
                      </div>
                    </div>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slugData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      pattern="\S*"
                      disabled={loading}
                      {...field}
                      placeholder="Slug "></Input>
                  </FormControl>
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
    </div>
  );
};
