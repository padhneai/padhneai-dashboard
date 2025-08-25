"use server";

import { getNoteBySlug } from "@/services/notes";



const Page = async ({ searchParams }: RouteParams) => {
  const { id } = await searchParams;
  const noteData = await getNoteBySlug(id);

  if (!noteData) {
    return (
      <div className="p-4 text-center text-red-500">Note not found</div>
    );
  }

  const {
    toc_entry,
    long_description_english,
    long_description_nepali,
    questions_english,
  } = noteData;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Subject */}
      <h1 className="text-2xl font-bold text-gray-900">
        Subject: {toc_entry.subject.name}
      </h1>

      {/* Chapter */}
      <div className="space-y-2 border-b pb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Chapter {toc_entry.chapter_number}: {toc_entry.content_name_english}
        </h2>

        {/* Chapter content */}
        <div
          className="text-gray-700 prose max-w-none"
          dangerouslySetInnerHTML={{ __html: toc_entry.description_english }}
        />

        {/* Long description / chapter notes */}
        {long_description_english && (
          <div className="mt-4 bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 className="font-medium text-gray-800 mb-2">Chapter Note:</h3>
            <div
              className="prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: long_description_english }}
            />
          </div>
        )}

        {/* Nepali notes (optional) */}
        {long_description_nepali && (
          <div className="mt-4 bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 className="font-medium text-gray-800 mb-2">नेपाली नोट:</h3>
            <div
              className="prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: long_description_nepali }}
            />
          </div>
        )}

        {/* Questions */}
        {questions_english?.length > 0 && (
          <div className="mt-4 bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 className="font-medium text-gray-800 mb-2">Questions:</h3>
            <div
              className="prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{
                __html: questions_english
                  .map((q: string) => `<p>${q}</p>`)
                  .join(""),
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
