/** @format */

"use client";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Color, Size } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
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
import { userOrigin } from "@/hooks/use-origin";

interface ColorsProps {
  initialData: Color | null;
}

const formSchema = z.object({
  name: z.string().min(1),
  hexCode: z.string().min(1),
});

type ColorsFormValues = z.infer<typeof formSchema>;

export const ColorsForm: React.FC<ColorsProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [isReady, setIsReady] = useState(false);

  const title = initialData ? "Edit color" : "Create color ";
  const description = initialData ? "Edit a color" : "Add a new color";
  const toastMessage = initialData ? "Color Update" : "Color created";
  const action = initialData ? "Save change " : "Create Color";
  useEffect(() => {
    if (params.storeId) {
      setIsReady(true);
    }
  }, [params]);

  const [open, setOpen] = useState(false);
  const origin = userOrigin();

  const [loading, setLoading] = useState(false);
  const form = useForm<ColorsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? { ...initialData, hexCode: initialData.hexCode || "" }
      : { name: "", hexCode: "" },
  });

  const onSubmit = async (data: ColorsFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/colors/${params.colorId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/colors`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/colors/`);
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

      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
      router.refresh();
      toast.success("Xóa Color thành công !!");
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
          <div className="grid grid-cols-3 gap-8 mt-[15px]">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Màu:</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      {...field}
                      placeholder="Màu  "></Input>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hexCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã màu Hexcode </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      {...field}
                      placeholder="Mã màu "></Input>
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
