"use client";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SubjectHeader({
  subjectname,
  classname,
  itemCount,
}: { subjectname: string; classname: string; itemCount: number }) {
  return (
    <div className="bg-white">
      <div className="mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="border-l pl-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {subjectname.toUpperCase()}
                </h1>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4 pr-6">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
              {classname}
            </Badge>
            <span className="text-sm text-gray-500">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
