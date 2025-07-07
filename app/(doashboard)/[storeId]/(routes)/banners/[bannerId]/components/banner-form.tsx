/** @format */

"use client";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ArrowUpAZ, Captions, Link, MousePointer, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
import toast from "react-hot-toast";

import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";

import { BannerInterface } from "@/types/banner";
import { ImageUploadSection } from "../../../products/[slug]/components/product-image-upload";
import { InputSectionWithForm } from "@/components/ui/inputSectionWithForm";
import { CheckActiveSectionWithForm } from "@/components/ui/checkActiveSectionWithForm";
import { ImageInterface } from "@/types/product";
import S3CloudAPI from "@/app/api/upload/s3-cloud";
import BannerAPI from "@/app/api/banners/banner.api";

interface BannerProps {
  initialData: BannerInterface | null;
}

const formSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  images: z.object({
    url: z.string().min(1, "Vui lòng chọn ảnh."),
    file: z.instanceof(File).optional(), // <- optional ở đây
  }),

  isActive: z.boolean(),
  link: z.string().optional(),
  position: z.coerce.number().optional(), // Hợp lệ với cả "2" và 2
  cta: z
    .object({
      title: z.string(),
      link: z.string(),
    })
    .optional(),
});

type BannersFormValues = z.infer<typeof formSchema>;

export const BannerForm: React.FC<BannerProps> = ({ initialData }) => {
  const router = useRouter();
  const { storeId } = useParams();

  const [isReady, setIsReady] = useState(false);

  const title = initialData ? "Chỉnh sửa Banner" : "Tạo Banner  ";
  const description = initialData ? "Chỉnh sửa Banner " : "Tạo Banner mới ";
  const action = initialData ? "Lưu Thay Đổi " : "Tạo mới Banner";

  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const form = useForm<BannersFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      isActive: true,
      description: "",
      link: "",
      position: 1,
      cta: {
        title: "",
        link: "",
      },
    },
  });

  const onSubmit = async (data: BannersFormValues) => {
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
      if (initialData) {
        let response = await BannerAPI.updateBanner(initialData.id, {
          storeId: Number(storeId),
          imageUrl: finalImage.url,
          description: data.description,

          title: data.title,
          link: data.link,
          isActive: data.isActive,
          cta:
            data.cta && data.cta.title !== "" && data.cta.link !== ""
              ? {
                  title: data.cta.title,
                  link: data.cta.link,
                }
              : undefined,
          updatedAt: new Date(),
          position: data.position, // Giữ nguyên vị trí cũ
        });
        if (response.status === 200) {
          const { message } = response.data as { message: string };
          toast.success(message);
        }
      } else {
        let response = await BannerAPI.createBanner({
          storeId: Number(storeId),
          description: data.description,

          imageUrl: finalImage.url,
          title: data.title,
          link: data.link,
          cta:
            data.cta && data.cta.title !== "" && data.cta.link !== ""
              ? {
                  title: data.cta.title,
                  link: data.cta.link,
                }
              : undefined,
          isActive: data.isActive,
          position: data.position ?? 1,
        });

        if (response.status === 200) {
          const { banner, message } = response.data as {
            banner: BannerInterface;
            message: string;
          };
          toast.success(message);
        }
        // await axios.post(`/api/${params.storeId}/billboards`, data);
      }
      // router.refresh();
      router.push(`/${storeId}/banners/`);
      // toast.success(toastMessage);

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
      if (initialData?.id) {
        let response = await BannerAPI.deleteBanner(initialData.id);
        if (response.status === 200) {
          const { message } = response.data as { message: string };
          toast.success(message);
          router.push(`/${storeId}/banners/`);
        }
      }
    } catch (err) {
      toast.error("Có lỗi gì đó xảy ra !! ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storeId) {
      setIsReady(true);
    }
  }, [storeId]);

  useEffect(() => {
    if (initialData) {
      const formData: BannersFormValues = {
        ...initialData,
        title: initialData.title ?? "",
        link: initialData.link ?? "",
        isActive: initialData.isActive ?? false,
        position: initialData.position ?? 1,
        cta: initialData.cta
          ? {
              title: initialData.cta.title,
              link: initialData.cta.link,
            }
          : {
              title: "",
              link: "",
            },
        images: {
          file: undefined,
          url: initialData.imageUrl ?? "",
        },
      };

      setTimeout(() => {
        form.reset(formData);
      });
    }
  }, [initialData, form]);
  if (!isReady) {
    return <div>Loading...</div>;
  }

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
          <ImageUploadSection
            form={form}
            loading={loading}
            note="Kích thước nên là  1920x600"
            title="Hình ảnh Banner"
          />

          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 mt-[15px]">
            <InputSectionWithForm
              form={form}
              nameFormField="title"
              placeholder="Nhập Tiêu Đề của Banner (Nếu muốn)"
              title="Nhập tiêu đề"
              icon={Captions}
              loading={loading}
            />
            <InputSectionWithForm
              form={form}
              nameFormField="description"
              placeholder="Nhập Mô tả của Banner (Nếu muốn)"
              title="Nhập mô tả"
              icon={Captions}
              loading={loading}
            />

            <InputSectionWithForm
              form={form}
              icon={Link}
              nameFormField="link"
              placeholder="Nhập đường link của Banner  (Nếu có)"
              title="Nhập đường link"
              loading={loading}
            />
            <InputSectionWithForm
              form={form}
              icon={ArrowUpAZ}
              type="number"
              nameFormField={"position"}
              placeholder="Nhập vị trí của Banner (1,2,3...)"
              title="Nhập vị trí của Banner"
              loading={loading}
            />
            <CheckActiveSectionWithForm
              form={form}
              nameFormField={"isActive"}
              loading={false}
              title={"Banner có được hiển thị không ?"}
              action={"Hiển thị Banner"}
              description={
                "Nếu check vào thì hình ảnh này được hiển thị ở Banner"
              }
            />
            {/* CTA Options Section */}
            <div className="mt-8">
              <Heading
                title="CTA Options"
                description="Cấu hình nút Call-to-Action cho Banner"
              />
              <Separator className="my-4" />
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
                <InputSectionWithForm
                  form={form}
                  nameFormField="cta.title"
                  placeholder="Nhập tiêu đề nút CTA (VD: Mua ngay, Xem thêm...)"
                  title="Tiêu đề CTA"
                  icon={MousePointer}
                  loading={loading}
                />
                <InputSectionWithForm
                  form={form}
                  icon={Link}
                  nameFormField="cta.link"
                  placeholder="Nhập đường link cho nút CTA"
                  title="Đường link CTA"
                  loading={loading}
                />
              </div>
            </div>
          </div>
          <div className=" flex justify-center items-center mt-4">
            <Button
              disabled={loading}
              className="w-full h-[45px] md:h-[60px] md:w-[600px] text-sm md:text-base"
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
