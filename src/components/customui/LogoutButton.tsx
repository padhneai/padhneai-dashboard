// components/dashboard/LogoutButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import {signOut} from 'firebase/auth'
import { auth } from "@/Firebase/client";
import { logout } from "@/Firebase/firebaseaction/auth.action";
import { toast } from "sonner";


const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth); // clear session / cookies
      await logout()
      router.push("/sign-in"); // redirect to login page
      toast.success("User Logout")
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout} title="Logout">
      <LogOut className="h-5 w-5 text-gray-600" />
    </Button>
  );
};

export default LogoutButton;
