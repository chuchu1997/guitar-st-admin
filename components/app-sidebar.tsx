"use client"

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
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { Separator } from "@/components/ui/separator"
import { useParams, usePathname } from "next/navigation"
import { useState } from "react"
import AvatarButton from "./avatar-button"
import { cn } from "@/lib/utils"

interface RouteItem {
  href: string
  label: string
  active: boolean
  icon: React.ElementType
}

export function AppSidebar() {
  const pathname = usePathname()
  const params = useParams()
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
        label: "Bài viết ",
        icon: NewspaperIcon,
        active: pathname === `/${params.storeId}/news`,
      },
      {
        href: `/${params.storeId}/orders`,
        label: "Quản lý đơn hàng ",
        icon: PackageSearchIcon,
        active: pathname === `/${params.storeId}/orders`,
      },
    ],
    products: [
      
      {
        href: `/${params.storeId}/products`,
        label: "Sản phẩm",
        icon: PackageSearchIcon,
        active: pathname === `/${params.storeId}/products`,
      },
      {
        href: `/${params.storeId}/services`,
        label: "Dịch vụ",
        icon: PackageSearchIcon,
        active: pathname === `/${params.storeId}/services`,
      },
    
      {
        href: `/${params.storeId}/sizes`,
        label: "Kích thước",
        icon: ScalingIcon,
        active: pathname === `/${params.storeId}/sizes`,
      },
      {
        href: `/${params.storeId}/colors`,
        label: "Màu sắc",
        icon: PaletteIcon,
        active: pathname === `/${params.storeId}/colors`,
      },
    ],
    catalog: [
      {
        href: `/${params.storeId}/billboards`,
        label: "Hình ảnh",
        icon: FileImageIcon,
        active: pathname === `/${params.storeId}/billboards`,
      },
      {
        href: `/${params.storeId}/categories`,
        label: "Danh mục",
        icon: BookMinusIcon,
        active: pathname === `/${params.storeId}/categories`,
      },
    
    ],
    settings: [
      {
        href: `/${params.storeId}/settings`,
        label: "Cài đặt",
        icon: SettingsIcon,
        active: pathname === `/${params.storeId}/settings`,
      },
    ],
  }

  const [openProductGroup, setOpenProductGroup] = useState(true)
  const [openCatalogGroup, setOpenCatalogGroup] = useState(true)

  const renderMenuItems = (items: RouteItem[]) => (
    <>
      {items.map((route) => {
        const Icon = route.icon
        return (
          <SidebarMenuItem key={route.href} className="py-1">
            <SidebarMenuButton asChild>
              <a
                href={route.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted",
                  route.href === pathname && "bg-muted font-semibold"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{route.label}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </>
  )

  const CollapsibleGroup = ({
    label,
    isOpen,
    onToggle,
    children,
  }: {
    label: string
    isOpen: boolean
    onToggle: () => void
    children: React.ReactNode
  }) => (
    <SidebarGroup>
      <SidebarGroupLabel
        onClick={onToggle}
        className="flex justify-between items-center cursor-pointer select-none "
      >
        {label}
        <ChevronDownIcon
          className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
        />
      </SidebarGroupLabel>
      {isOpen && <SidebarGroupContent><SidebarMenu>{children}</SidebarMenu></SidebarGroupContent>}
    </SidebarGroup>
  )

  return (
    <Sidebar className = " top-0 h-screen w-64 z-50 shadow-md">
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel>Trang Quản Lý (ADMIN)</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {renderMenuItems(routes.overview)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <CollapsibleGroup
          label="Quản lý Sản phẩm"
          isOpen={openProductGroup}
          onToggle={() => setOpenProductGroup(!openProductGroup)}
        >
          {renderMenuItems(routes.products)}
        </CollapsibleGroup>

        <CollapsibleGroup
          label="Danh mục & Hình ảnh"
          isOpen={openCatalogGroup}
          onToggle={() => setOpenCatalogGroup(!openCatalogGroup)}
        >
          {renderMenuItems(routes.catalog)}
        </CollapsibleGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Cài đặt</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderMenuItems(routes.settings)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator />
        <AvatarButton className="mx-4 bg-green-300" />
      </SidebarContent>
    </Sidebar>
  )
}