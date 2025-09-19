"use client";

import { useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Admin_Sidebar } from "@/components/admin/Admin_Sidebar";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/wrapper/Loader";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Loader
  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Admin_Sidebar />
        <main className="bg-light flex-1 overflow-y-auto">{children}</main>
      </div>
    </SidebarProvider>
  );
}
