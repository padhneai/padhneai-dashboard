"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ResumeDialog from "./ResumeDialog";
import { Button } from "@/components/ui/button";
import { Trash2, Copy } from "lucide-react";
import AlertDialogbox from "../customui/AlertDiologbox";
import { useState } from "react";
import { deleteApplication } from "@/Firebase/firebaseaction/internapplication.action";
import { toast } from "sonner";

interface ApplicationTableProps {
  applications: InternApplication[];
}

export default function ApplicationTable({ applications }: ApplicationTableProps) {
  const [apps, setApps] = useState(applications);

  const handleDelete = async (id: string) => {
    const success = await deleteApplication(id);
    if (success) {
      toast.success("Application deleted successfully");
      setApps((prev) => prev.filter((app) => app.id !== id));
    } else {
      toast.error("Failed to delete application. Please try again.");
    }
  };

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    } catch {
      toast.error(`Failed to copy ${label}`);
    }
  };

  return (
    <Table className="max-w-6xl m-auto text-base">
      <TableHeader>
        <TableRow className="text-sm bg-gray-50">
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Applied At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {apps.map((app) => (
          <TableRow key={app.id} className="hover:bg-gray-50 transition-all">
            <TableCell className="text-sm font-medium">{app.name}</TableCell>

            {/* Email with mailto and copy */}
            <TableCell className="flex items-center gap-2 text-blue-600 cursor-pointer">
              <a href={`mailto:${app.email}`} className="underline">
                {app.email}
              </a>
              <Copy
                className="w-4 h-4 hover:text-gray-600"
                onClick={() => handleCopy(app.email, "Email")}
              />
            </TableCell>

            <TableCell className="text-sm">{app.position}</TableCell>

            {/* Contact with copy */}
            <TableCell className="flex items-center gap-2 cursor-pointer">
              <span
                onClick={() => handleCopy(app.contact, "Contact")}
                className="hover:underline"
              >
                {app.contact}
              </span>
              <Copy
                className="w-4 h-4 hover:text-gray-600"
                onClick={() => handleCopy(app.contact, "Contact")}
              />
            </TableCell>

            <TableCell className="text-sm">
              {app.createdAt.toLocaleDateString()}{" "}
              {app.createdAt.toLocaleTimeString()}
            </TableCell>

            <TableCell className="flex gap-3">
              <ResumeDialog
                applicantName={app.name}
                resumePublicId={app.resumePublicId}
              />

              {/* <AlertDialogbox
                trigger={
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </Button>
                }
                title="Delete Application"
                description={`Are you sure you want to delete ${app.name}'s application? This action cannot be undone.`}
                actionText="Delete"
                variant="destructive"
                onAction={() => handleDelete(app.id)}
              /> */}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
