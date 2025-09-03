'use client';

import Image from 'next/image';
import Texteditor from './TextEditor';

interface AnswerSheetFormProps {
  index: number;
  answer_sheet: ExamQuestion['answer_sheet'];
  updateAnswerSheet: <K extends keyof ExamQuestion['answer_sheet']>(
    index: number,
    field: K,
    value: ExamQuestion['answer_sheet'][K]
  ) => void;
  handleImageUpload: (file: File, index: number, type: 'question' | 'answer') => void;
  handleImageUpdate?: (file: File, currentPublicId: string | null , index: number, type: 'question' | 'answer') => void;
  handleImageDelete?: (index: number, type: 'question' | 'answer') => void ;
}

export default function AnswerSheetForm({
  index,
  answer_sheet,
  updateAnswerSheet,
  handleImageUpload,
  handleImageUpdate,
  handleImageDelete,
}: AnswerSheetFormProps) {
  const currentImage = answer_sheet.answer_image;
  const currentImageUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${currentImage}`;


  return (
    <div>
      <h3 className="font-semibold mt-4">Answer Sheet</h3>

      {/* English Answer */}
      <Texteditor
        label="Answer in English"
        id={'answer-english-' + index}
        content={answer_sheet.answer_english}
        setContent={(content) => updateAnswerSheet(index, 'answer_english', content)}
        placeholder="Answer in English"
      />

      {/* Nepali Answer */}
      <Texteditor
        label="Answer in Nepali"
        id={'answer-nepali-' + index}
        content={answer_sheet.answer_nepali}
        setContent={(content) => updateAnswerSheet(index, 'answer_nepali', content)}
        placeholder="Answer in Nepali"
      />

      {/* Answer Image */}
      <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-gray-50 mt-4">
        {!currentImage ? (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                if (file.size > 2 * 1024 * 1024) {
                  alert("Image size should be under 2MB");
                  return;
                }
                handleImageUpload(file, index, 'answer');
              }
            }}
          />
        ) : (
          <div className="relative inline-block">
            <Image
              src={currentImageUrl}
              alt="Preview"
              width={200}
              height={200}
              className="rounded"
            />
            <div className="absolute top-0 right-0 flex flex-col gap-1">
              {/* Update Button */}
             <label className="bg-blue-500 text-white text-xs px-2 py-1 rounded cursor-pointer">
    Update
    <input
      type="file"
      className="hidden"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file && handleImageUpdate) {
          handleImageUpdate(file, answer_sheet.answer_image ?? null, index, 'answer');
        }
      }}
    />
  </label>

              {/* Delete Button */}
              <button
                type="button"
                className="bg-red-500 text-white text-xs px-2 py-1 rounded"
                onClick={() => handleImageDelete && handleImageDelete(index, 'answer')}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
