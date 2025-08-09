"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

interface ClassCardProps {
  title: string;  // e.g. "8" or "9"
  href: string;   // e.g. "/classes/8"
}

export function ClassCard({ title, href }: ClassCardProps) {
  return (
    <Link href={href || ""} className="block">
      <Card className="flex flex-col items-center justify-center border border-gray-200 rounded-xl p-6 hover:border-indigo-500 hover:shadow-md transition-all duration-200 cursor-pointer">
        <GraduationCap className="w-8 h-8 text-indigo-500 mb-3" />
        <CardContent className="p-0">
          <span className="text-lg font-medium text-gray-800">
            Class {title}
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}


