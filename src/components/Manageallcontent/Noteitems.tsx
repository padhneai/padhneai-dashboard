"use client";

import { Edit, FileText, BookOpen, Globe, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { deleteNote } from "@/services/notes";
import { toast } from "sonner";
import useSWR from "swr";
import AlertDialogbox from "../customui/AlertDiologbox";

interface NoteItemProps {
  note: any;
  classname: string;
  classid: string;
  subjectname: string;
  subjectId: string;
}

export default function NoteItem({
  note,
  classname,
  classid,
  subjectname,
  subjectId,
}: NoteItemProps) {
  const { mutate } = useSWR("/getAllnote"); // refresh after delete

  const onDeleteNote = async (id: number) => {
    try {
      await deleteNote(id);
      await mutate();
      toast.success("Note deleted");
    } catch (e) {
      toast.error("Failed to delete note");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-xl shadow hover:shadow-lg transition-shadow duration-200 border border-gray-100">
      {/* Left: Note Info */}
      <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-2">
        <div className="font-medium text-gray-900 text-sm sm:text-base mb-1 sm:mb-0">
          {note.title || `Note ${note.id}`}
        </div>

        {/* Info Icons */}
        <div className="flex flex-wrap gap-3 text-gray-500 items-center">
          <div className="flex items-center gap-1">
            <FileText
              className={`w-4 h-4 ${
                note.long_description_english ? "text-green-500" : "text-red-500"
              }`}
            />
            <span className="hidden sm:inline text-xs">Desc EN</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen
              className={`w-4 h-4 ${
                note.long_description_nepali ? "text-green-500" : "text-red-500"
              }`}
            />
            <span className="hidden sm:inline text-xs">Desc NP</span>
          </div>
          <div className="flex items-center gap-1">
            <Globe
              className={`w-4 h-4 ${
                note.questions && note.questions.length > 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            />
            <span className="hidden sm:inline text-xs">Q EN</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen
              className={`w-4 h-4 ${
                note.questions_nepali && note.questions_nepali.length > 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            />
            <span className="hidden sm:inline text-xs">Q NP</span>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 mt-2 sm:mt-0">
        <Link
          href={`/${classname}_${classid}/${subjectname}_${subjectId}/edit-notecontent?id=${note.id}`}
        >
          <Button variant="outline" size="sm" className="hover:bg-blue-50">
            <Edit className="w-4 h-4 text-blue-600" />
          </Button>
        </Link>

        {/* Delete with confirmation */}
        <AlertDialogbox
          trigger={
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-red-50 text-red-600"
            >
              <X className="w-4 h-4" />
            </Button>
          }
          title="Delete Note"
          description="Are you sure you want to delete this note? This action cannot be undone."
          cancelText="Cancel"
          actionText="Delete"
          variant="destructive"
          onAction={() => onDeleteNote(note.id)}
        />
      </div>
    </div>
  );
}
