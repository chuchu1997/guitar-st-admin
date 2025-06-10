/** @format */

"use client";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

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
import ImageUpload, {
  TempImage,
} from "@/components/ui/ImageUpload/image-upload";

import EditorComponent from "@/components/editor";
import { ArticleBaseInterface, ArticleInterface } from "@/types/news";
import { DescriptionSection } from "../../../products/[slug]/components/product-description";
import { ImageUploadSection } from "../../../products/[slug]/components/product-image-upload";
import { InputSectionWithForm } from "@/components/ui/inputSectionWithForm";
import S3CloudAPI from "@/app/api/upload/s3-cloud";
import { ImageInterface } from "@/types/product";
import ArticleAPI from "@/app/api/articles/article.api";

interface NewsProps {
  initialData: ArticleInterface | null;
}

const formSchema = z.object({
  title: z.string().min(1, "Bạn phải nhập tên bài viết"),
  images: z
    .object({
      url: z.string().min(1, "Vui lòng chọn ảnh."),
      file: z.instanceof(File).optional(),
    })
    .refine((val) => !!val.url, {
      message: "Vui lòng chọn ảnh.",
    }),
  description: z.string().min(1, "Bạn phải nhập mô tả cho bài viết"),
  slug: z.string().min(1, "Bạn phải nhập slug cho bài viết"),
});

type NewsFormValues = z.infer<typeof formSchema>;

export const NewsForm: React.FC<NewsProps> = ({ initialData }) => {
  const { slug, storeId } = useParams();

  const router = useRouter();
  const title = initialData ? "Chỉnh sửa bài viết " : "Tạo bài viết ";
  const description = initialData
    ? "Chỉnh sửa bài viết "
    : "Tạo bài viết  mới ";
  const action = initialData ? "Lưu thay đổi " : "Tạo bài viết ";
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [isMounted, setIsMounted] = useState(false);

  const form = useForm<NewsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
    },
  });

  const onSubmit = async (data: NewsFormValues) => {
    try {
      setLoading(true);

      // const oldImages = data.images.filter((img) => !img.file); // Ảnh cũ (chỉ có url)

      // let finalImageUrls: ImageInterface[] = [...oldImages]; // Bắt đầu từ ảnh cũ

      let finalImage = data.images;

      if (data.images.file) {
        const formData = new FormData();
        formData.append("files", data.images.file);
        const uploadRes = await S3CloudAPI.uploadImageToS3(formData);
        if (uploadRes.status !== 200) throw new Error("Upload thất bại");
        const { imageUrls } = uploadRes.data as { imageUrls: string[] };
        if (imageUrls.length > 0) {
          finalImage.file = undefined;
          finalImage.url = imageUrls[0];
        }
      }

      const { title, slug, description } = data;

      const payload: ArticleBaseInterface = {
        storeId: Number(storeId),
        imageUrl: finalImage.url,
        title: title,
        slug: slug,
        description: description,
      };
      if (initialData) {
        let response = await ArticleAPI.updateArticle(initialData.id, {
          ...payload,
          updatedAt: new Date(),
        });
        if (response.status === 200) {
          const { article, message } = response.data as {
            article: ArticleInterface;
            message: string;
          };

          toast.success(message);
        }
        //UPDATE
      } else {
        //CREATE
        let response = await ArticleAPI.createArticle(payload);
        if (response.status === 200) {
          const { article, message } = response.data as {
            article: ArticleInterface;
            message: string;
          };
          toast.success(message);
        }
      }
      // router.refresh();
      router.push(`/${storeId}/news/`);
      // toast.success(toastMessage);
    } catch (_err) {
      toast.error("Something when wrong !!");
    } finally {
      setLoading(false);
    }
  };
  const onDelete = async () => {
    try {
      setLoading(true);
      let response = await ArticleAPI.deleteArticle(Number(initialData?.id));
      if (response.status === 200) {
        const { message } = response.data as { message: string };
        toast.success(message);
        router.push(`/${storeId}/news/`);
      }
    } catch (err) {
      toast.error(
        `Có lỗi gì đó  !! ${err instanceof Error ? err.message : String(err)}`
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    if (initialData) {
      const formData: NewsFormValues = {
        ...initialData,
        images: {
          file: undefined,
          url: initialData.imageUrl ?? "",
        },
        description: initialData.description ?? "",
      };
      setTimeout(() => {
        form.reset(formData);
      });
    }
  }, [initialData]);
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
          <div className="grid grid-cols-2 gap-8 mt-[15px]">
            <InputSectionWithForm
              form={form}
              nameFormField="title"
              placeholder="Nhập Tên của bài viết"
              title="Tên của bài viết"
              loading={loading}
            />
            <InputSectionWithForm
              form={form}
              nameFormField="slug"
              placeholder="Nhập Slug Vào"
              title="Slug Cho Website"
              loading={loading}
            />
            <div className="col-span-2">
              <ImageUploadSection form={form} loading={loading} />
            </div>

            <div className="col-span-2">
              <DescriptionSection form={form} loading={loading} />
            </div>
            {/* LƯU Ý FORM PHẢI TÊN DESCRIPTION NÓ MỚI NHẬN */}
          </div>
          <div className="text-center">
            <Button
              disabled={loading}
              className=" w-full md:w-1/2 mt-4"
              type="submit">
              {action}
            </Button>
          </div>
        </form>
      </Form>

      <Separator />
    </div>
  );
};
