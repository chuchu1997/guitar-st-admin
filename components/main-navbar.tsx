/** @format */

"use client";

import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AvatarButton from "./avatar-button";
import { Separator } from "./ui/separator";

export function MainNav({ className }: React.HtmlHTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const routes = [
    {
      href: `/${params.storeId}`,
      label: "Overview",
      active: pathname === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/billboards`,
      label: "Billboards",
      active: pathname === `/${params.storeId}/billboards`,
    },

    {
      href: `/${params.storeId}/sub-categories`,
      label: "Sub Categories",
      active: pathname === `/${params.storeId}/sub-categories`,
    },
    {
      href: `/${params.storeId}/categories`,
      label: "Categories",
      active: pathname === `/${params.storeId}/categories`,
    },
    {
      href: `/${params.storeId}/sizes`,
      label: "Sizes",
      active: pathname === `/${params.storeId}/sizes`,
    },
    {
      href: `/${params.storeId}/colors`,
      label: "Colors",
      active: pathname === `/${params.storeId}/sizes`,
    },

    {
      href: `/${params.storeId}/products`,
      label: "Products",
      active: pathname === `/${params.storeId}/products`,
    },
    {
      href: `/${params.storeId}/settings`,
      label: "Settings",
      active: pathname === `/${params.storeId}/settings`,
    },
  ];
  if (!isMounted) return null;

  return (
    <div className="relative ">
      {/* Hamburger button - only visible on mobile */}
      <button
        onClick={toggleMenu}
        className="sm:hidden p-2 text-muted-foreground hover:text-primary"
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}>
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop navigation - hidden on mobile */}
      <nav
        className={cn(
          "sm:flex items-center space-x-4 lg:space-x-6 hidden",
          className
        )}>
        {routes.map((route) => (
          <Link
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              route.active
                ? "text-black dark:text-white"
                : "text-muted-foreground"
            )}
            href={route.href}
            key={route.href}>
            {route.label}
          </Link>
        ))}
      </nav>

      {/* Mobile navigation - shown when menu is open */}
      {isMenuOpen && (
        <nav className="sm:hidden absolute top-10 right-[0] w-[300px] bg-background z-50 shadow-md rounded-md p-4 border">
          <div className="my-4 text-center">Menu:</div>
          <Separator />
          <div className="flex flex-col space-y-4 py-4">
            {routes.map((route) => (
              <Link
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  route.active
                    ? "text-black dark:text-white"
                    : "text-muted-foreground"
                )}
                href={route.href}
                key={route.href}
                onClick={() => setIsMenuOpen(false)}>
                {route.label}
              </Link>
            ))}
            <div className=" ">
              <AvatarButton />
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}
