/** @format */

"use client";
import { getCurrentUser } from "@/lib/auth/utils";
import prismadb from "@/lib/primadb";
import { redirect } from "next/navigation";
import authApi from "../api/auth/auth.api";
import { useEffect, useState } from "react";
import StoresAPI from "../api/stores/stores.api";
import { useRouter } from "next/navigation";
import { AuthStorage } from "@/utils/authLocalstorage";
import { StoreInterface } from "@/types/store";
import { Role } from "@/types/auth";
import { useStoreModal } from "@/hooks/use-store-modal";

// eslint-disable-next-line @next/next/no-async-client-component

//THIS IS SERVER COMPONENT !!
export default function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const onOpen = useStoreModal((state) => state.onOpen);

  const router = useRouter();

  const getUserByToken = async () => {
    const responseAuth = await authApi.getUserProfile();
    if (responseAuth.status === 200) {
      const { user } = responseAuth.data;
      if (user && user.role === Role.ADMIN) {
        let responseStore = await StoresAPI.getStoresByUserID(user.sub);
        //LẤY TẤT CẢ STORES THUỘC VỀ USER NÀY
        if (responseStore.status === 200) {
          const { stores } = responseStore.data as { stores: StoreInterface[] };
          if (stores.length > 0) {
            redirect(`/${stores[0].id}`);
          } else {
            onOpen();
          }
        }
      }
    }
  };
  useEffect(() => {
    checkAuthForAdmin();
    getUserByToken();
  }, []);

  const checkAuthForAdmin = () => {
    let token = AuthStorage.getToken();

    if (!token) {
      router.push("/login");
    } else {
      // CHỈ RENDER KHI ĐÃ LOGIN ACCESS OK HẾT RỒI !!!
      setCheckingAuth(false);
    }
  };

  if (checkingAuth) {
    // Có thể là null hoặc 1 splash/loading screen
    return null;
  }
  // const user = await getCurrentUser();

  // if (user) {
  //   const store = await prismadb.store.findFirst({
  //     where: {
  //       userID: user?.id,
  //     },
  //   });

  //   if (store) {
  //     redirect(`/${store.id}`);
  //   }
  // }

  return <>{children}</>;
}
