/** @format */

"use client";
import authApi from "@/app/api/auth/auth.api";
import StoresAPI from "@/app/api/stores/stores.api";
import { AppSidebar } from "@/components/app-sidebar";
import { GlobalRouteLoader } from "@/components/global-loading";
import Navbar from "@/components/navbar";
import Footer from "@/components/ui/footer";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Role } from "@/types/auth";
import { redirect, useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { StoreInterface } from "@/types/store";

interface LayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout(props: LayoutProps) {
  const calledRef = useRef(false);
  const { children } = props;
  const router = useRouter();
  const { storeId } = useParams();

  const [unAuthorize, setUnAuthorize] = useState(true);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    const checkAuth = async () => {
      try {
        const response = await authApi.getUserProfile();
        const { user } = response.data;

        if (user && user.role === Role.ADMIN) {
          setUnAuthorize(false);
          const response = await StoresAPI.getStoresByUserID(user.id);
          if (response.status === 200) {
            //

            const { stores } = response.data as { stores: StoreInterface[] };

            if (
              !stores ||
              stores.length === 0 ||
              !stores.some((store) => store.id === Number(storeId))
            ) {
              router.push("/");
              return;
            }
          }
        }
      } catch (err: any) {
        if (err.status === 401) {
          setUnAuthorize(true);
          redirect("/login");
        }
      }
    };
    checkAuth();
  }, []);

  if (unAuthorize) return null;

  return (
    <>
      <GlobalRouteLoader />
      <SidebarProvider>
        <AppSidebar />
        <div className="wrapper-dashboard   w-full">
          <Navbar />
          <div className="min-h-[600px] container mx-auto mt-[10px]">
            {children}
          </div>
          <Footer />
        </div>
      </SidebarProvider>
    </>
  );
}
