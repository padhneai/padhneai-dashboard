import { isAuthenticated } from "@/Firebase/firebaseaction/auth.action";
import { redirect } from "next/navigation";
import React from "react";


export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isUserAuthenticated = await isAuthenticated();

  if(isUserAuthenticated)  redirect("/")
  return (
  <div className="auth-layout">{children}</div>
  )
}
