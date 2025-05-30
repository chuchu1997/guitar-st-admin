/** @format */

"use client";

import { MainNav } from "@/components/main-navbar";
import StoreSwitcher from "@/components/store-switch";
import { getCurrentUser } from "@/lib/auth/utils";
import prismadb from "@/lib/primadb";
import AvatarButton from "./avatar-button";
import { SidebarTrigger } from "./ui/sidebar";
import { useEffect, useRef, useState } from "react";
import { StoreInterface } from "@/types/store";
import authApi from "@/app/api/auth/auth.api";
import { Role } from "@/types/auth";
import StoresAPI from "@/app/api/stores/stores.api";
import { useParams } from "next/navigation";
import { User } from "lucide-react";

const Navbar = () => {
  const calledRef = useRef(false);
  const { storeId } = useParams();
  const [stores, setStores] = useState<StoreInterface[]>([]);

  const getStore = async () => {
    const response = await authApi.getUserProfile();
    const { user } = response.data;
    if (user && user.role === Role.ADMIN) {
      const response = await StoresAPI.getStoresByUserID(user.sub);
      if (response.status === 200) {
        const { stores } = response.data;
        if (stores) {
          setStores(stores);
          // router.push("/");
        }
      }

      // const responseStore = await StoresAPI.getStoresByUserID(user.sub)
    }
  };

  useEffect(() => {
    getStore();
  }, []);

  //FIXME:
  // const user = await getCurrentUser();
  // const stores = await prismadb.store.findMany({
  //   where: {
  //     userID: user?.id,
  //   },
  // });

  // Check that user and stores are not undefined before rendering
  // if (!user || !stores) {
  //   return null; // Hoặc có thể render một loading spinner
  // }

  return (
    <div className="">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex gap-x-4">
            {/* <SidebarTrigger /> */}
            <StoreSwitcher items={stores} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Navbar;
