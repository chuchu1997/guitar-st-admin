/** @format */

"use client";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
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
  images: z
    .array(
      z.object({
        url: z.string(),
        file: z.instanceof(File).optional(), // <- optional ở đây
      })
    )
    .min(1, "Bạn phải chọn ít nhất 1 ảnh"),
  isActive: z.boolean(),
  link: z.string().optional(),
});

type BannersFormValues = z.infer<typeof formSchema>;

export const BannerForm: React.FC<BannerProps> = ({ initialData }) => {
  const router = useRouter();
  const { storeId } = useParams();

  const [isReady, setIsReady] = useState(false);

  const title = initialData ? "Chỉnh sửa hình ảnh" : "Tạo hình ảnh  ";
  const description = initialData
    ? "Chỉnh sửa hình ảnh "
    : "Tạo 1 hình ảnh mới ";
  const action = initialData ? "Lưu Thay Đổi " : "Tạo mới hình ảnh";

  const [open, setOpen] = useState(false);
  const origin = userOrigin();

  const [loading, setLoading] = useState(false);
  const form = useForm<BannersFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      images: [],
      isActive: false,
      link: "",
    },
  });

  const onSubmit = async (data: BannersFormValues) => {
    try {
      setLoading(true);
      const formData = new FormData();
      const oldImages = data.images.filter((img) => !img.file); // Ảnh cũ (chỉ có url)
      let finalImageUrls: ImageInterface[] = [...oldImages]; // Bắt đầu từ ảnh cũ
      if (data.images[0].file) {
        formData.append("files", data.images[0].file);
        const uploadRes = await S3CloudAPI.uploadImageToS3(formData);
        if (uploadRes.status !== 200) throw new Error("Upload thất bại");

        const { imageUrls } = uploadRes.data as { imageUrls: [] };
        const uploadedImageUrls: ImageInterface[] = imageUrls.map((img) => ({
          url: img,
          file: undefined,
        }));
        finalImageUrls = [...uploadedImageUrls];
      }
      console.log("FINAL", finalImageUrls);
      if (initialData) {
        let response = await BannerAPI.updateBanner(initialData.id, {
          storeId: Number(storeId),
          imageUrl: finalImageUrls[0].url,
          title: data.title,
          link: data.link,
          isActive: data.isActive,
          updatedAt: new Date(),
          position: initialData.position, // Giữ nguyên vị trí cũ
        });
        if (response.status === 200) {
          const { message } = response.data as { message: string };
          toast.success(message);
        }
      } else {
        let response = await BannerAPI.createBanner({
          storeId: Number(storeId),
          imageUrl: finalImageUrls[0].url,
          title: data.title,
          link: data.link,
          isActive: data.isActive,
          position: 1, // Luôn có giá trị, không để mặc định là 0 (Là vị trí đầu tiên khi thêm mới )
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

      // await axios.delete(
      //   `/api/${params.storeId}/billboards/${params.billboardId}`
      // );
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
        images: [
          {
            file: undefined,
            url: initialData.imageUrl ?? "",
          },
        ],
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
          <ImageUploadSection form={form} loading={loading} />

          <div className="grid grid-cols-3 gap-8 mt-[15px]">
            <InputSectionWithForm
              form={form}
              nameFormField="title"
              placeholder="Nhập Tiêu Đề của Banner (Nếu muốn)"
              title="Nhập tiêu đề"
              loading={loading}
            />
            <InputSectionWithForm
              form={form}
              nameFormField="link"
              placeholder="Nhập đường link của Banner  (Nếu có)"
              title="Nhập đường link"
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
          </div>

          <Button disabled={loading} className="ml-auto mt-4" type="submit">
            {action}
          </Button>
        </form>
      </Form>

      <Separator />
      {/* <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      /> */}
    </div>
  );
};
