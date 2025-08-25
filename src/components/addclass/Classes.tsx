"use client";
import useSWR from "swr";
import Addclass from "@/components/addclass/Addclass";
import { ClassCard } from "@/components/customui/Class_card";
import { getAllClasses } from "@/services/classes";
import React, { useState } from "react";

const Classes = () => {
  const [showAddClass, setShowAddClass] = useState(false);
  const { data: classdatas, mutate, isLoading } = useSWR("/classes", getAllClasses);

  const handleAddSuccess = () => {
    mutate(); // Refresh class list after adding
    setShowAddClass(false);
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
          <p className="text-gray-500 text-center col-span-full">Loading classes...</p>
        ) : (
          classdatas?.map((level: any) => (
            <ClassCard
              key={level.id}
              title={level.name}
              href={`${level.name}_${level.id}`}
            />
          ))
        )}
      </div>

      {/* Modal */}
      {showAddClass && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="relative w-full max-w-md p-6 bg-white shadow-2xl rounded-2xl animate-fadeIn">
            <button
              onClick={() => setShowAddClass(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Class</h2>
            <Addclass onSuccess={handleAddSuccess} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Classes;
