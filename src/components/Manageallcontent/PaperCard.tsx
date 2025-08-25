"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";

export default function PaperCard({
  paper,
  viewHref,
  editHref,
  onDelete,
}: {
  paper: any;
  viewHref: string;
  editHref: string;
  onDelete: () => void;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{paper.subject?.name ?? paper.subject}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">{paper.year}</Badge>
              <Badge variant="outline" className="text-xs">{paper.province}</Badge>
              <span className="text-xs text-gray-500">{paper.question_type}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={viewHref}><Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button></Link>
            <Link href={editHref}><Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button></Link>
            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={onDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
