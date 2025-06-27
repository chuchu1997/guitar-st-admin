/** @format */

"use client";

import { getCurrentUser } from "@/lib/auth/utils";
import prismadb from "@/lib/primadb";
import { redirect, useParams } from "next/navigation";
import { SettingsForm } from "./components/settings-form";
import { useEffect, useState } from "react";
import { StoreInterface } from "@/types/store";
import StoresAPI from "@/app/api/stores/stores.api";
import authApi from "@/app/api/auth/auth.api";
import { Role } from "@/types/auth";
import { UserInterface } from "@/types/user";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@radix-ui/react-separator";
import { ApiList } from "@/components/ui/api-list";

export default function SettingsPage() {
  // const { storeId } = await params;
  // const user = await getCurrentUser();
  // const store = await prismadb.store.findFirst({
  //   where: {
  //     id: storeId,
  //     userID: user?.id,
  //   },
  // });

  // if (!store) {
  //   redirect("/");
  // }
  const { storeId } = useParams();
  const [store, setStore] = useState<StoreInterface>();

  useEffect(() => {
    fetchStore();
  }, []);
  const fetchStore = async () => {
    if (storeId) {
      const response = await authApi.getUserProfile();
      const { user } = response.data;

      if (user && user.role === Role.ADMIN) {
        let responseStore = await StoresAPI.getStoreRelateWithUser(
          user.id,
          storeId.toString()
        );

        if (responseStore.status === 200) {
          const { store } = responseStore.data as { store: StoreInterface };

          setStore(store);
        }
      }
    }
  };
  if (!store) return null;
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store}></SettingsForm>
        {/* <Heading title={"API"} description={"API Call for products"} />
        <Separator /> */}
        {/* <ApiList entityName="" entityIdName="slug" /> */}
      </div>
    </div>
  );
}
