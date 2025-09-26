"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

import LogoutButton from "./LogoutButton";
import { Code, ThermometerSnowflakeIcon } from "lucide-react";
import { signOut } from "firebase/auth";
import { logout } from "@/Firebase/firebaseaction/auth.action";
import { auth } from "@/Firebase/client";
import { toast } from "sonner";
// import { UserInfoprops } from "../../types";

const DashboardHeader = ({ data }: UserInfoprops) => {
  const user = data;
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

  // Fallbacks if user data is missing
  const name = user?.name || "Guest User";
  const email = user?.email || "Not available";
  const role = user?.role || "user";

  // Get first 2 letters of name or fallback
  const avatarLetters = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Left side - Logo */}
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">PadhneAI</h1>
            <p className="text-sm text-gray-500">Dashboard</p>
          </div>

          {/* Right side - User section */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="cursor-pointer">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {avatarLetters}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="bg-white border border-gray-200 rounded-lg shadow-lg w-56 py-2"
              >
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="font-semibold">{name}</p>
                  <p className="text-xs text-gray-500">{email}</p>
                  <p className="text-xs text-gray-500 capitalize">{role}</p>
                </div>

                {/* Admin only menu */}
                {role === "admin" && (
                <>
                  <DropdownMenuItem
                    className="hover:bg-blue-100 p-4 hover:text-blue-600 cursor-pointer transition-colors duration-200"
                    onClick={() => router.push("/generateToken")}
                  >
                    <Code className="mr-2 h-4 w-4" />
                    Generate Token
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="hover:bg-blue-100 p-4 hover:text-blue-600 cursor-pointer transition-colors duration-200"
                    onClick={() => router.push("/intern-applications")}
                  >
                    <Code className="mr-2 h-4 w-4" />
                    Intern Applications
                  </DropdownMenuItem>
                </>
                )}

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="hover:bg-blue-100 hover:text-blue-600 cursor-pointer transition-colors duration-200"
                >
                  <LogoutButton />Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User info display next to avatar */}
            <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{name}</p>
                <p className="text-xs text-gray-500">{email}</p>
                <p className="text-xs text-gray-500 capitalize">{role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
