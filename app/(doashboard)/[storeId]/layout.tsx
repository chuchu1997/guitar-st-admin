import { AppSidebar } from "@/components/app-sidebar";
import { GlobalRouteLoader } from "@/components/global-loading";
import Navbar from "@/components/navbar";
import Footer from "@/components/ui/footer";
import { SidebarProvider,SidebarTrigger } from "@/components/ui/sidebar";
import { getCurrentUser } from "@/lib/auth/utils";
import prismadb from "@/lib/primadb";
import { redirect } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ storeId: string }>;
}

export default async function DashboardLayout(props: LayoutProps) {
  const { children, params } = props;
  const { storeId } = await params;

  const user = await getCurrentUser();

  const store = await prismadb.store.findFirst({
    where: {
      id: storeId,
      userID: user?.id,
    },
  });

  if (!store) {
    redirect("/");
  }

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
          <Footer/>
        </div>
      </SidebarProvider>
    </>
  );
}
