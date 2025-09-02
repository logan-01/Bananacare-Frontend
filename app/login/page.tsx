import React from "react";
import LoginForm from "@/components/user/LoginForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

async function LoginPage() {
  const session = await auth();
  if (session) redirect("/admin");

  return (
    <div className="bg-primary/80 flex h-screen items-center justify-center">
      <div className="bg-light border-primary z-50 flex h-fit max-h-[95vh] w-[95vw] flex-col overflow-y-auto rounded-md border px-6 py-6 shadow-xl md:w-[45vw] md:px-10">
        <LoginForm type="full" />
      </div>
    </div>
  );
}

export default LoginPage;
