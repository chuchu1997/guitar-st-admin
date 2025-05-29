/** @format */

"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import authApi from "@/app/api/auth/auth.api";
import { UserInterface } from "@/types/user";
import { Role } from "@/types/auth";
import StoresAPI from "@/app/api/stores/stores.api";
import { CreateStoreInterface, StoreInterface } from "@/types/store";

const formSchema = z.object({
  name: z.string().min(1, "Bắt buộc phải nhập tên Store"),
});

export const StoreModal = () => {
  const storeModal = useStoreModal();

  useEffect(() => {
    console.log("store", storeModal.isOpen);
  });
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      let responseUser = await authApi.getUserProfile();
      if (responseUser.status === 200) {
        const { user } = responseUser.data;
        if (user.role === Role.ADMIN) {
          const response = await StoresAPI.createStore({
            name: values.name,
            userID: user.sub,
          });
          console.log(response);
          if (response.status === 200) {
            const { store, message } = response.data as {
              store: StoreInterface;
              message: string;
            };
            toast.success(message);
            window.location.assign(`/${store.id}`);
          }
        }
      }

      // const response = await axios.post("/api/stores", values);
      // console.log("response", response.data);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Something wrong");
    } finally {
      setLoading(false);
    }

    //TODO:CREATE STORE
  };
  return (
    <Modal
      title="Tạo ra 1 store mới "
      description="Tạo store để quản lý products , categogy ...."
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}>
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên Store</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Nhập tên store của bạn muốn tạo ..."
                        {...field}></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}></FormField>

              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button
                  disabled={loading}
                  variant={"outline"}
                  onClick={() => {
                    storeModal.onClose();
                  }}>
                  Cancel
                </Button>
                <Button disabled={loading} type="submit">
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
