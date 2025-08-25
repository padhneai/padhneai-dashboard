"use client";

import useSWR from "swr";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Edit, Trash2, X } from "lucide-react";
import { getAllTOC, deleteTOC, getAllNotes } from "@/services/notes";
import { toast } from "sonner";
import NoteItem from "./Noteitems";

interface NoteContent {
  id: number;
  title: string;
  description: string;
  toc_entry: {
    id:number;
  };
  // add other fields if needed
}

export default function NotesTOCList({
  subjectId,
  classname,
  classid,
  subjectname,
}: {
  subjectId: string;
  classname: string;
  classid: string;
  subjectname: string;
}) {
  const { data: tocData, isLoading: tocLoading, mutate: mutateTOC } = useSWR("/getAllTOC", getAllTOC);
  const { data: notesData, isLoading: notesLoading, mutate: mutateNotes } = useSWR("/getAllnote", getAllNotes);
console.log(notesData)
  // Filter TOCs by current subject
  const tocList = Array.isArray(tocData)
    ? tocData.filter((t: any) => String(t.subject.id) === String(subjectId))
    : [];

  // Filter notes by TOC
  const getNotesByTOC = (tocId: number) => {
    if (!Array.isArray(notesData)) return [];
    return notesData.filter((note: NoteContent) => note.toc_entry.id === tocId);
  };

  const onDeleteTOC = async (id: number) => {
    try {
      await deleteTOC(id);
      await mutateTOC();
      toast.success("TOC deleted");
    } catch (e: any) {
      toast.error("Failed to delete TOC");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Notes</h2>
      </div>

      {tocLoading ? (
        <div className="grid gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg animate-pulse bg-white shadow-sm">
              <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
              <div className="flex gap-2">
                <div className="h-3 w-10 bg-gray-300 rounded"></div>
                <div className="h-3 w-12 bg-gray-300 rounded"></div>
                <div className="h-3 w-16 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : tocList.length ? (
        <div className="space-y-4">
          {tocList.map((toc: any) => (
            <div key={toc.id} className="p-4 bg-white rounded-lg border">
              {/* TOC Header */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{toc.content_name_english}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      Chapter {toc.chapter_number}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                   {toc.subject.name}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/${classname}_${classid}/${subjectname}_${subjectId}/view-studynote?id=${toc.slug}`}
                  >
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link
                    href={`/${classname}_${classid}/${subjectname}_${subjectId}/edit-studynote?id=${toc.id}`}
                  >
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link
                    href={`/${classname}_${classid}/${subjectname}_${subjectId}/add-notecontent?toc_id=${toc.id}`}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-green-600 hover:text-green-700"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => onDeleteTOC(toc.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Nested Notes List */}
          <div className="mt-4 ml-4 space-y-3">
  {getNotesByTOC(toc.id).length ? (
    getNotesByTOC(toc.id).map((note: any) => (
      <NoteItem
        key={note.id}
        note={note}
        classname={classname}
        classid={classid}
        subjectname={subjectname}
        subjectId={subjectId}
      />
    ))
  ) : (
    <div className="text-center text-gray-400 py-6">
      <X className="mx-auto w-8 h-8 text-red-400" />
      <div className="text-sm mt-2">No notes added yet</div>
    </div>
  )}
</div>

            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Plus className="mx-auto h-10 w-10 text-gray-400 mb-3" />
          <h3 className="text-sm font-medium text-gray-900 mb-1">No TOCs yet</h3>
          <p className="text-sm text-gray-500 mb-4">Create your first TOC.</p>
        </div>
      )}
    </div>
  );
}
