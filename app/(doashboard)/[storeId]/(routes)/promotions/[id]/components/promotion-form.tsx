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
import { SettingsSection } from "../../../products/[slug]/components/product-setting";
import { ProductPromotionSelector } from "../../../products/[slug]/components/product-promotion-select";
import { Calendar24 } from "@/components/ui/date/date-picker";
import { CalendarWithForm } from "@/components/ui/date/date-form";
import {
  CreatePromotionInterface,
  discountTypeEnum,
  PromotionType,
  UpdatePromotionInterface,
} from "@/types/promotions";
import { PromotionAPI } from "@/app/api/promotions/promotion.api";

interface PromotionProps {
  initialData: PromotionType | null;
}
export const promotionProductSchema = z.object({
  productId: z.number(),
  discountType: z.nativeEnum(discountTypeEnum),
  discount: z.number().min(0, "Giá trị giảm giá phải lớn hơn hoặc bằng 0"),
  product: z.any().optional(), // Hoặc z.custom<ProductInterface>().optional() nếu muốn validate kỹ hơn

  //  discountType: "percentage" | "fixed";
  // discountValue: number;
  // product: "percentage" | "fixed";
});
export type PromotionProduct = z.infer<typeof promotionProductSchema>;

const formSchema = z
  .object({
    name: z.string().min(1, "Bạn phải nhập tên chương trình"),
    isActive: z.boolean().default(false).optional(),
    promotionProducts: z.array(promotionProductSchema).optional(),
    startDate: z.date(),
    endDate: z.date(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "Ngày kết thúc phải sau ngày bắt đầu",
    path: ["endDate"],
  });

type PromotionFormValues = z.infer<typeof formSchema>;

export const PromotionForm: React.FC<PromotionProps> = ({ initialData }) => {
  const { slug, storeId } = useParams();

  const router = useRouter();
  const title = initialData ? "Chỉnh sửa chương trình " : "Tạo chương trình ";
  const description = initialData
    ? "Chỉnh sửa chương trình "
    : "Tạo chương trình ";
  const action = initialData ? "Lưu thay đổi " : "Tạo chương trình ";
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [isMounted, setIsMounted] = useState(false);

  const form = useForm<PromotionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      promotionProducts: [],
      isActive: false,
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  const onSubmit = async (data: PromotionFormValues) => {
    try {
      setLoading(true);

      // const oldImages = data.images.filter((img) => !img.file); // Ảnh cũ (chỉ có url)

      // let finalImageUrls: ImageInterface[] = [...oldImages]; // Bắt đầu từ ảnh cũ

      const payload: CreatePromotionInterface = {
        storeId: Number(storeId),
        ...data,
        promotionProducts: data.promotionProducts?.map((item) => ({
          ...item,
          product: item.product ?? {}, // Ensure product is always present (replace {} with a sensible default if needed)
        })),
      };

      if (initialData) {
        let res = await PromotionAPI.updatePromotion(
          initialData.id,
          payload as UpdatePromotionInterface
        );
        if (res.status === 200) {
          //UPDATE
          const { message } = res.data as { message: string };
          toast.success(message);
        }
      } else {
        let res = await PromotionAPI.createPromotion(payload);
        if (res.status === 200) {
          const { message } = res.data as { message: string };
          toast.success(message);
        }

        //     toast.success(message);
      }

      // // router.refresh();
    } catch (_err) {
      toast.error("Something when wrong !!");
    } finally {
      router.push(`/${storeId}/promotions/`);

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
        router.push(`/${storeId}/promotions/`);
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
      const formData: PromotionFormValues = {
        ...initialData,
        startDate: new Date(initialData.startDate),
        endDate: new Date(initialData.endDate),
        name:
          typeof initialData.name === "string"
            ? initialData.name
            : String(initialData.name),
        isActive:
          typeof initialData.isActive === "boolean"
            ? initialData.isActive
            : Boolean(initialData.isActive),
        promotionProducts: Array.isArray(initialData.promotionProducts)
          ? initialData.promotionProducts
              .filter(
                (item: any) =>
                  typeof item.productId === "number" &&
                  item.productId !== undefined
              )
              .map((item: any) => ({
                ...item,
                productId: item.productId as number,
                discountType: item.discountType,
                discount: item.discount,
                product: item.product ?? {},
              }))
          : [],
      };
      setTimeout(() => {
        form.reset(formData);
      });
    }
  }, [initialData]);
  if (!isMounted) return <>Chưa có dữ liệu</>;
  return (
    <div className="flex flex-col gap-2">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-[15px] ">
            <InputSectionWithForm
              form={form}
              nameFormField="name"
              placeholder="Nhập Tên của chương trình khuyến mãi "
              title="Tên của chương trình khuyến mãi "
              loading={loading}
            />

            <ProductPromotionSelector
              form={form}
              loading={loading}
              name="promotionProducts"
            />
            <SettingsSection form={form} loading={loading} name="isActive" />

            {/* LƯU Ý FORM PHẢI TÊN DESCRIPTION NÓ MỚI NHẬN */}

            <CalendarWithForm
              form={form}
              loading={loading}
              nameFormField="startDate"
              title="Chọn ngày bắt đầu chương trình"
            />
            <CalendarWithForm
              form={form}
              loading={loading}
              nameFormField="endDate"
              title="Chọn ngày kết thúc chương trình"
            />
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
