/** @format */

"use client";

import {
  PackageSearchIcon,
  BookCopyIcon,
  BookMinusIcon,
  PaletteIcon,
  FileImageIcon,
  ChartSplineIcon,
  ScalingIcon,
  SettingsIcon,
  ChevronDownIcon,
  NewspaperIcon,
  HomeIcon,
  ShoppingBagIcon,
  LayersIcon,
  User2Icon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Separator } from "@/components/ui/separator";
import { useParams, usePathname } from "next/navigation";
import { useState } from "react";
import AvatarButton from "./avatar-button";
import { cn } from "@/lib/utils";

interface RouteItem {
  href: string;
  label: string;
  active: boolean;
  icon: React.ElementType;
  badge?: string;
}

export function AppSidebar() {
  const pathname = usePathname();
  const params = useParams();
  const routes = {
    overview: [
      {
        href: `/${params.storeId}`,
        label: "Tổng quan",
        icon: ChartSplineIcon,
        active: pathname === `/${params.storeId}`,
      },
      {
        href: `/${params.storeId}/news`,
        label: "Bài viết",
        icon: NewspaperIcon,
        active: pathname === `/${params.storeId}/news`,
        badge: "12",
      },
      {
        href: `/${params.storeId}/orders`,
        label: "Quản lý đơn hàng",
        icon: ShoppingBagIcon,
        active: pathname === `/${params.storeId}/orders`,
        badge: "3",
      },
    ],
    products: [
      {
        href: `/${params.storeId}/categories`,
        label: "Danh mục",
        icon: BookMinusIcon,
        active: pathname === `/${params.storeId}/categories`,
      },
      {
        href: `/${params.storeId}/products`,
        label: "Sản phẩm",
        icon: PackageSearchIcon,
        active: pathname === `/${params.storeId}/products`,
      },
      // {
      //   href: `/${params.storeId}/services`,
      //   label: "Dịch vụ",
      //   icon: LayersIcon,
      //   active: pathname === `/${params.storeId}/services`,
      // },

      {
        href: `/${params.storeId}/banners`,
        label: "Quản lý Banner",
        icon: FileImageIcon,
        active: pathname === `/${params.storeId}/banners`,
      },
      // {
      //   href: `/${params.storeId}/sizes`,
      //   label: "Kích thước",
      //   icon: ScalingIcon,
      //   active: pathname === `/${params.storeId}/sizes`,
      // },
      // {
      //   href: `/${params.storeId}/colors`,
      //   label: "Màu sắc",
      //   icon: PaletteIcon,
      //   active: pathname === `/${params.storeId}/colors`,
      // },
    ],
    // catalog: [
    //   {
    //     href: `/${params.storeId}/billboards`,
    //     label: "Hình ảnh",
    //     icon: FileImageIcon,
    //     active: pathname === `/${params.storeId}/billboards`,
    //   },
    //   {
    //     href: `/${params.storeId}/categories`,
    //     label: "Danh mục",
    //     icon: BookMinusIcon,
    //     active: pathname === `/${params.storeId}/categories`,
    //   },
    // ],
    settings: [
      {
        href: `/${params.storeId}/settings`,
        label: "Cài đặt",
        icon: SettingsIcon,
        active: pathname === `/${params.storeId}/settings`,
      },
    ],
  };

  const [openProductGroup, setOpenProductGroup] = useState(true);
  const [openCatalogGroup, setOpenCatalogGroup] = useState(true);

  const renderMenuItems = (items: RouteItem[]) => (
    <>
      {items.map((route) => {
        const Icon = route.icon;
        return (
          <SidebarMenuItem key={route.href} className="relative group">
            <SidebarMenuButton asChild>
              <a
                href={route.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 ease-in-out",
                  "hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100/50",
                  "hover:shadow-sm hover:translate-x-1",
                  "group-hover:scale-[1.02]",
                  route.active
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-md border border-blue-100 font-medium"
                    : "text-slate-600 hover:text-slate-900"
                )}>
                <div
                  className={cn(
                    "p-1.5 rounded-lg transition-colors duration-200",
                    route.active
                      ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm"
                      : "bg-slate-100 group-hover:bg-white group-hover:shadow-sm"
                  )}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="font-medium text-sm">{route.label}</span>
                {route.badge && (
                  <div className="ml-auto bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-1 py-0.5 text-center rounded-full font-semibold shadow-sm">
                    {route.badge}
                  </div>
                )}
                {route.active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-r-full" />
                )}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </>
  );

  const CollapsibleGroup = ({
    label,
    isOpen,
    onToggle,
    children,
    icon: Icon,
  }: {
    label: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    icon: React.ElementType;
  }) => (
    <SidebarGroup className="mb-2">
      <SidebarGroupLabel
        onClick={onToggle}
        className={cn(
          "flex items-center justify-between cursor-pointer select-none px-3 py-2 rounded-lg",
          "transition-all duration-200 hover:bg-slate-50 group",
          "text-slate-700 font-semibold text-sm uppercase tracking-wide"
        )}>
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-slate-500 " />

          <span className="text-xs ">{label}</span>
        </div>
        <ChevronDownIcon
          className={cn(
            "h-4 w-4 transition-all duration-300 text-slate-400 group-hover:text-slate-600",
            isOpen && "rotate-180"
          )}
        />
      </SidebarGroupLabel>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}>
        <SidebarGroupContent className="pt-2">
          <SidebarMenu className="space-y-1">{children}</SidebarMenu>
        </SidebarGroupContent>
      </div>
    </SidebarGroup>
  );

  return (
    <Sidebar className="top-0 h-screen w-65 z-50 border-r-0">
      <SidebarContent className="bg-gradient-to-b from-white via-slate-50/30 to-white border-r border-slate-200/60 shadow-xl">
        {/* Header Section */}
        <div className="p-6 border-b border-slate-200/60">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <HomeIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-800">Admin Panel</h1>
              <p className="text-xs text-slate-500 font-medium">
                Management System (GT)
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Overview Section */}
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2 px-3 py-2 text-slate-700 font-semibold text-sm uppercase tracking-wide">
              <ChartSplineIcon className="h-4 w-4 text-slate-500" />
              Bảng điều khiển
            </SidebarGroupLabel>
            <SidebarGroupContent className="pt-2">
              <SidebarMenu className="space-y-1">
                {renderMenuItems(routes.overview)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Products Section */}
          <CollapsibleGroup
            label="Quản lý (All)"
            icon={PackageSearchIcon}
            isOpen={openProductGroup}
            onToggle={() => setOpenProductGroup(!openProductGroup)}>
            {renderMenuItems(routes.products)}
          </CollapsibleGroup>

          {/* Catalog Section */}
          {/* <CollapsibleGroup
            label="Danh mục & Hình ảnh"
            icon={LayersIcon}
            isOpen={openCatalogGroup}
            onToggle={() => setOpenCatalogGroup(!openCatalogGroup)}
          >
            {renderMenuItems(routes.catalog)}
          </CollapsibleGroup> */}

          {/* Settings Section */}
          <SidebarGroup>
            <SidebarGroupContent className="pt-2">
              <SidebarMenu className="space-y-1">
                {renderMenuItems(routes.settings)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* Footer Section */}
        <div className="mt-auto p-4 border-t border-slate-200/60 bg-gradient-to-r from-slate-50/50 to-transparent">
          <AvatarButton className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]" />
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
