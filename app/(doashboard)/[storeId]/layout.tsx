/** @format */

"use client";
import authApi from "@/app/api/auth/auth.api";
import StoresAPI from "@/app/api/stores/stores.api";
import { AppSidebar } from "@/components/app-sidebar";
import { GlobalRouteLoader } from "@/components/global-loading";
import Navbar from "@/components/navbar";
import Footer from "@/components/ui/footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getCurrentUser } from "@/lib/auth/utils";
import prismadb from "@/lib/primadb";
import { Role } from "@/types/auth";
import { redirect, useParams } from "next/navigation";
import { useEffect, useRef } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout(props: LayoutProps) {
  const calledRef = useRef(false);

  const { children } = props;

  const { storeId } = useParams();

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    const checkAuth = async () => {
      const response = await authApi.getUserProfile();
      const { user } = response.data;
      if (user && user.role === Role.ADMIN) {
        const response = await StoresAPI.getStoreRelateWithUser(
          user.sub,
          storeId?.toString() ?? ""
        );
        if (response.status === 200) {
          const { store } = response.data;
          if (!store) {
            redirect("/");
          }
        }
      }
    };

    checkAuth();
  }, []);

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
