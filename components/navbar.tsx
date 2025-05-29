
"use client";


import { MainNav } from "@/components/main-navbar";
import StoreSwitcher from "@/components/store-switch";
import { getCurrentUser } from "@/lib/auth/utils";
import prismadb from "@/lib/primadb";
import AvatarButton from "./avatar-button";
import { SidebarTrigger } from "./ui/sidebar";
import { useState } from "react";
import { StoreInterface } from "@/types/store";

const Navbar = () => {
  const [stores,setStores] = useState<StoreInterface[]>([])

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
