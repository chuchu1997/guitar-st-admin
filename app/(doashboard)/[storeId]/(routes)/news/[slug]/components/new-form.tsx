/** @format */

"use client";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Trash,
  Save,
  Plus,
  FileText,
  Image as ImageIcon,
  Search,
} from "lucide-react";
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
import { seoSchemaZod } from "@/schemas/seoSchema";
import SEOForm from "@/components/seo/seo";

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
  shortDescription: z.string().optional(),
  description: z.string().min(1, "Bạn phải nhập mô tả cho bài viết"),
  slug: z.string().min(1, "Bạn phải nhập slug cho bài viết"),

  seo: seoSchemaZod.optional(),
});

type NewsFormValues = z.infer<typeof formSchema>;

export const NewsForm: React.FC<NewsProps> = ({ initialData }) => {
  const { slug, storeId } = useParams();

  const router = useRouter();
  const title = initialData ? "Chỉnh sửa bài viết" : "Tạo bài viết mới";
  const description = initialData
    ? "Cập nhật thông tin bài viết của bạn"
    : "Tạo một bài viết mới cho blog";
  const action = initialData ? "Lưu thay đổi" : "Tạo bài viết";
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [isMounted, setIsMounted] = useState(false);

  const form = useForm<NewsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      shortDescription: "",
      seo: {
        title: "",
        description: "",
        keywords: "",
        slug: "",
        canonicalUrl: "",
        altText: "",
        ogTitle: "",
        ogDescription: "",
        ogImage: "",
      },
    },
  });

  const onSubmit = async (data: NewsFormValues) => {
    try {
      setLoading(true);

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

      const { title, slug, description, seo, shortDescription } = data;

      const payload: ArticleBaseInterface = {
        storeId: Number(storeId),
        imageUrl: finalImage.url,
        title: title,
        slug: slug,
        seo,
        shortDescription,
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
      } else {
        let response = await ArticleAPI.createArticle(payload);
        if (response.status === 200) {
          const { article, message } = response.data as {
            article: ArticleInterface;
            message: string;
          };
          toast.success(message);
        }
      }
      router.push(`/${storeId}/news/`);
    } catch (_err) {
      toast.error("Something went wrong!");
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
        `Có lỗi gì đó! ${err instanceof Error ? err.message : String(err)}`
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
        shortDescription: initialData.shortDescription ?? "",
        seo: initialData.seo ?? {
          title: "",
          description: "",
          keywords: "",
          slug: "",
          canonicalUrl: "",
          altText: "",
          ogTitle: "",
          ogDescription: "",
          ogImage: "",
        },
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

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        loading={loading}
        onConfirm={async () => {
          await onDelete();
          setOpen(false);
        }}
      />

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              {initialData && (
                <Badge variant="secondary" className="text-xs">
                  Đang chỉnh sửa
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-lg">{description}</p>
          </div>

          {initialData && (
            <Button
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={() => setOpen(true)}
              className="self-start sm:self-center border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors">
              <Trash className="w-4 h-4 mr-2" />
              Xóa bài viết
            </Button>
          )}
        </div>
        <Separator className="bg-gradient-to-r from-primary/20 to-transparent" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information Section */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <FileText className="h-5 w-5" />
                Thông tin cơ bản
              </CardTitle>
              <CardDescription>
                Nhập thông tin cơ bản về bài viết của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <InputSectionWithForm
                    form={form}
                    nameFormField="title"
                    placeholder="Ví dụ: Hướng dẫn sử dụng React Hook Form"
                    title="Tiêu đề bài viết"
                    loading={loading}
                  />
                </div>
                <div className="space-y-2">
                  <InputSectionWithForm
                    form={form}
                    nameFormField="slug"
                    placeholder="vi-du-huong-dan-su-dung-react-hook-form"
                    title="Slug (URL thân thiện)"
                    loading={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <InputSectionWithForm
                  form={form}
                  nameFormField="shortDescription"
                  placeholder="Mô tả ngắn gọn về nội dung bài viết (tùy chọn)"
                  title="Mô tả ngắn"
                  loading={loading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Image Upload Section */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <ImageIcon className="h-5 w-5" />
                Hình ảnh đại diện
              </CardTitle>
              <CardDescription>
                Chọn hình ảnh đại diện cho bài viết của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUploadSection form={form} loading={loading} />
            </CardContent>
          </Card>

          {/* Content Section */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <FileText className="h-5 w-5" />
                Nội dung bài viết
              </CardTitle>
              <CardDescription>
                Soạn thảo nội dung chính của bài viết
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DescriptionSection form={form} loading={loading} />
            </CardContent>
          </Card>

          {/* SEO Section */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Search className="h-5 w-5" />
                Tối ưu SEO
              </CardTitle>
              <CardDescription>
                Cấu hình các thông tin để tối ưu hóa công cụ tìm kiếm
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SEOForm form={form} loading={loading} />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/${storeId}/news/`)}
              className="w-full sm:w-auto min-w-[120px]"
              disabled={loading}>
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto min-w-[160px] bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  {initialData ? (
                    <Save className="w-4 h-4 mr-2" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  {action}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
