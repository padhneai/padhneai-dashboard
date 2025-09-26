"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CldImage } from "next-cloudinary";
import { Download, ExternalLink } from "lucide-react";
import { useRef } from "react";

interface ResumeDialogProps {
  applicantName: string;
  resumePublicId: string;
}

export default function ResumeDialog({ applicantName, resumePublicId }: ResumeDialogProps) {
  const isPdf = resumePublicId.toLowerCase().endsWith(".pdf");
  
  
  const previewUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/pg_1/${resumePublicId}.png`;

  




  const imageRef = useRef<HTMLImageElement>(null);

  // Function to download via Blob
 const handleDownload = () => {
    if (!imageRef.current) return;
    fetch(imageRef.current.src)
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${applicantName.toLowerCase()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
  };


  // Open in new tab
  const handleOpenNewTab = () => {
    window.open(previewUrl, "_blank");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View Resume
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full h-[80vh] flex flex-col">
        <DialogHeader className="flex flex-col items-center justify-between ">
          <DialogTitle>{applicantName} - Resume</DialogTitle>
          <div className="flex gap-2">
            <Button
              onClick={handleDownload}
              variant="secondary"
              size="sm"
              className="flex gap-2 hover:bg-gray-500 hover:text-white"
            >
              <Download className="w-4 h-4" /> Download
            </Button>
            <Button
              onClick={handleOpenNewTab}
              variant="secondary"
              size="sm"
              className="flex gap-2 hover:bg-gray-500 hover:text-white"
            >
              <ExternalLink className="w-4 h-4" /> Open in New Tab
            </Button>
          </div>
        </DialogHeader>

        <div className="w-full  overflow-auto">
          {isPdf ? (
            <iframe
              src={previewUrl}
              className="w-full h-full rounded-md border"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg overflow-auto">
              <CldImage
                ref={imageRef}
                alt={`${applicantName} Resume`}
                src={resumePublicId}
                width={1200}
                height={1600}
                crop="fill"
                gravity="auto"
                className="rounded-xl shadow-lg object-contain"
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
