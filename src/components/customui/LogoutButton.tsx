// components/dashboard/LogoutButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";



const LogoutButton = () => {


  return (
    <Button variant="ghost" size="sm"  title="Logout">
      <LogOut className="h-5 w-5 text-gray-600" />
    </Button>
  );
};

export default LogoutButton;
