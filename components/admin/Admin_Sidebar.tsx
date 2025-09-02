"use client";

// React
import React, { useState, useEffect } from "react";
//Next
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
//Icons
import {
  RiHome5Line,
  RiTableLine,
  RiBarChart2Line,
  RiUserLine,
} from "react-icons/ri";
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
import { useSession, signOut } from "next-auth/react";

// Menu items.
const items = [
  {
    title: "Overview",
    url: "/admin",
    icon: RiHome5Line,
  },
  {
    title: "Scans",
    url: "/admin/scans",
    icon: RiTableLine,
  },
  // {
  //   title: "Analytics",
  //   url: "/admin/chart",
  //   icon: RiBarChart2Line,
  // },

  // {
  //   title: "Users",
  //   url: "/admin/users",
  //   icon: RiUserLine,
  // },
];

export function Admin_Sidebar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [activeRoute, setActiveRoute] = useState("/admin");

  useEffect(() => {
    setActiveRoute(pathname);
  }, [pathname]);

  const onLogout = async () => {
    await signOut();
  };

  return (
    <Sidebar collapsible="icon" className="fomt= border-none shadow-md">
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
            <SidebarMenu className="">
              {items.map((item) => {
                const isActive = activeRoute === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`${isActive ? "bg-primary text-light" : "text-dark"} hover:bg-primary hover:text-light rounded-md py-[21px] font-medium`}
                    >
                      <Link
                        href={item.url}
                        prefetch={true}
                        className="text-4xl"
                      >
                        <item.icon className="text-3xl" />
                        <span>{item.title}</span>
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
            {status === "loading" ? (
              <p>Loading...</p>
            ) : status === "authenticated" && session?.user ? (
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
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <p className="text-dark text-base">
                    {session?.user?.name
                      ? session.user.name.trim().split(" ")[0]
                      : ""}
                  </p>
                </div>

                {/* Options */}
                <div className="bg-primary/20 absolute bottom-full left-0 mb-2 hidden w-full rounded-md px-2 py-2 peer-checked:block">
                  <div className="flex flex-col gap-2 font-normal">
                    <div className="bg-primary/80 text-light flex flex-col rounded-sm px-2 py-1">
                      <p>{`${session?.user.name}`}</p>
                      <p className="text-light/80 text-sm font-light">
                        {`${session?.user.email}`}
                      </p>
                    </div>
                    {/* <p className="hover:bg-primary hover:text-light rounded-sm px-2 py-1 text-base hover:cursor-pointer hover:opacity-70">
                      Change Password
                    </p>
                    <p className="hover:bg-primary hover:text-light rounded-sm px-2 py-1 text-base hover:cursor-pointer hover:opacity-70">
                      Edit Profile
                    </p> */}
                  </div>
                  <button
                    className="text-light mt-2 w-full rounded-md bg-red-600 px-6 py-1 hover:opacity-70"
                    onClick={onLogout}
                  >
                    Logout
                  </button>
                  {/* <NavigationMenuLink>Link</NavigationMenuLink> */}
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
