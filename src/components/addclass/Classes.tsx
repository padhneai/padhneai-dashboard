"use client";

import useSWR from "swr";
import { ClassCard } from "@/components/customui/Class_card";
import { getAllClasses, deleteClass } from "@/services/classes";
import React, { useState, Suspense } from "react";
import { toast } from "sonner";
import AlertDialogbox from "@/components/customui/AlertDiologbox";
import DataDisplayLoading from "../Loading/DataDisplayLoading";

// Lazy load AddOrUpdateClass for better performance
const AddOrUpdateClass = React.lazy(() => import("./Addclass"));



interface ClassesProps {
  initialClasses?: ClassApiResponse;
}

const Classes = ({ initialClasses }: ClassesProps) => {
  const [showAddClass, setShowAddClass] = useState(false);
  const [showUpdateClass, setShowUpdateClass] = useState(false);
  const [currentClass, setCurrentClass] = useState<ClassItem | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fallbackClasses = {
    count: initialClasses?.count || 0,
    next: initialClasses?.next || null,
    previous: initialClasses?.previous || null,
    page_size: initialClasses?.page_size || 0,
    total_pages: initialClasses?.total_pages || 0,
    current_page: initialClasses?.current_page || 0,
    results: initialClasses?.results || [],
  };



  // SWR with fallbackData for SSR/SSG
  const { data: classdatas, mutate, isLoading } = useSWR(
    "/classes",
    getAllClasses,
    { fallbackData: fallbackClasses }
  );

  const classes = classdatas?.results || [];

  const handleAddSuccess = () => {
    mutate(); // Refresh class list after adding
    setShowAddClass(false);
  };

  const handleUpdateSuccess = () => {
    mutate(); // Refresh class list after updating
    setShowUpdateClass(false);
    setCurrentClass(null);
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    setIsDeleting(true);
    try {
      await deleteClass(deleteId);
      toast.success("Class deleted ✅");
      setDeleteId(null);
      mutate();
    } catch (error: any) {
      toast.error("Failed to delete class ❌");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">📚 Classes</h1>
        <button
          onClick={() => setShowAddClass(true)}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          + Add Class
        </button>
      </div>

      {/* Class Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <DataDisplayLoading count={4} />
        ) : classes.length === 0 ? (
          <p className="text-gray-500 col-span-full">No classes found.</p>
        ) : (
          classes.map((level) => (
            <div key={level.id} className="relative">
              <ClassCard title={level.name} href={`${level.name}_${level.id}`} />
              <div className="absolute top-2 right-2 flex gap-1">
                {/* Update Button */}
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
                  onClick={() => {
                    setCurrentClass(level);
                    setShowUpdateClass(true);
                  }} 
                >
                  Edit
                </button>

                {/* Delete Button */}
                <AlertDialogbox
                  trigger={
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                      onClick={() => setDeleteId(level.id)}
                    >
                      Delete
                    </button>
                  }
                  title="Delete Class"
                  description="Are you sure you want to delete this class? This action cannot be undone."
                  cancelText="Cancel"
                  actionText={isDeleting ? "Deleting..." : "Delete"}
                  variant="destructive"
                  onAction={handleDelete}
                  onCancel={() => setDeleteId(null)}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Class Modal */}
      {showAddClass && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="relative w-full max-w-md p-6 bg-white shadow-2xl rounded-2xl animate-fadeIn">
            <button
              onClick={() => setShowAddClass(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
            >
              ✕
            </button>
            <Suspense fallback={<DataDisplayLoading count={1} />}>
              <AddOrUpdateClass onSuccess={handleAddSuccess} />
            </Suspense>
          </div>
        </div>
      )}

      {/* Update Class Modal */}
      {showUpdateClass && currentClass && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="relative w-full max-w-md p-6 bg-white shadow-2xl rounded-2xl animate-fadeIn">
            <button
              onClick={() => setShowUpdateClass(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
            >
              ✕
            </button>
            <Suspense fallback={<DataDisplayLoading count={1} />}>
              <AddOrUpdateClass
                classData={currentClass}
                onSuccess={handleUpdateSuccess}
              />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
};

export default Classes;
