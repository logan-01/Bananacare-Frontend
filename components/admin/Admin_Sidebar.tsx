"use client";

// React
import React, { useState, useEffect } from "react";
//Next
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
//Icons

//Shadcn
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MdKeyboardArrowDown } from "react-icons/md";
import { House, ScanLine, ChartLine, Map } from "lucide-react";
import { authService } from "@/lib/authService";
import { useAuth } from "@/hooks/useAuth";

// Menu items.
const items = [
  {
    title: "Overview",
    url: "/admin",
    icon: House,
  },
  {
    title: "Scans",
    url: "/admin/scans",
    icon: ScanLine,
  },
  {
    title: "Analytics",
    url: "/admin/analytics",
    icon: ChartLine,
  },

  {
    title: "Geographic",
    url: "/admin/geographic",
    icon: Map,
  },
];

export function Admin_Sidebar() {
  const pathname = usePathname();
  const [activeRoute, setActiveRoute] = useState("/admin");

  const { user, loading } = useAuth();

  useEffect(() => {
    setActiveRoute(pathname);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-none shadow-md">
      <SidebarContent className="bg-light">
        {/* Header */}
        <SidebarHeader className="flex flex-row">
          <Image
            src="/img/BananaCare-Logomark.svg"
            width={50}
            height={50}
            alt="BananaCare Logomark"
          />

          <Image
            src="/img/BananaCare-Wordmark.svg"
            width={130}
            height={60}
            alt="BananaCare Wordmark"
          />
        </SidebarHeader>

        {/*   Content */}
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel className="text-primary">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = activeRoute === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`${
                        isActive ? "bg-primary text-light" : "text-dark"
                      } hover:bg-primary hover:text-light rounded-md px-3 py-3 font-medium transition-colors duration-200`}
                    >
                      <Link
                        href={item.url}
                        prefetch={true}
                        className="flex h-full min-h-[44px] w-full items-center gap-3"
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span className="truncate">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarFooter className="flex flex-row items-center gap-4">
          <div className="flex w-full py-10">
            {loading ? (
              <p>Loading...</p>
            ) : user ? (
              <label
                htmlFor="user-dropdown"
                className="bg-primary/20 relative flex flex-1 flex-row-reverse items-center rounded-md px-2 py-2 hover:cursor-pointer"
              >
                <input
                  id="user-dropdown"
                  className="peer hidden"
                  type="checkbox"
                />

                <MdKeyboardArrowDown className="text-2xl transition-transform duration-300 peer-checked:rotate-180" />

                <div className="flex flex-1 items-center gap-2">
                  <Avatar>
                    {/* <AvatarImage src={user.photoURL || "https://github.com/shadcn.png"} /> */}
                    <AvatarFallback>
                      {/* {user.displayName ? user.displayName[0] : "U"} */}
                    </AvatarFallback>
                  </Avatar>
                  {/* <p className="text-dark text-base">
                    {user.displayName
                      ? user.displayName.trim().split(" ")[0]
                      : "User"}
                  </p> */}
                </div>

                {/* Options */}
                <div className="bg-primary/20 absolute bottom-full left-0 mb-2 hidden w-full rounded-md px-2 py-2 peer-checked:block">
                  <div className="flex flex-col gap-2 font-normal">
                    <div className="bg-primary/80 text-light flex flex-col rounded-sm px-2 py-1">
                      {/* <p>{user.displayName || "No Name"}</p> */}
                      <p className="text-light/80 text-sm font-light">
                        {/* {user.email} */}
                      </p>
                    </div>
                  </div>
                  <button
                    className="text-light mt-2 w-full rounded-md bg-red-600 px-6 py-1 hover:opacity-70"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </label>
            ) : (
              <Link
                href={"/login"}
                className="bg-primary text-light w-full rounded-md px-2 py-2 text-center font-medium whitespace-nowrap hover:cursor-pointer hover:opacity-70"
              >
                Login
              </Link>
            )}
          </div>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
