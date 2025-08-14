'use client';

import Image from 'next/image';
import Texteditor from './TextEditor';

interface AnswerSheetFormProps {
  index: number;
  answer_sheet: ExamQuestion['answer_sheet'];
  updateAnswerSheet: <K extends keyof ExamQuestion['answer_sheet']>(index: number, field: K, value: ExamQuestion['answer_sheet'][K]) => void;
  handleImageUpload: (file: File, index: number, type: 'question' | 'answer') => void;
}

export default function AnswerSheetForm({
  index,
  answer_sheet,
  updateAnswerSheet,
  handleImageUpload
}: AnswerSheetFormProps) {
  return (
    <div>
      <h3 className="font-semibold mt-4">Answer Sheet</h3>

      {/* English Answer */}
      <Texteditor
        id={'answer-english-' + index}
        content={answer_sheet.answer_english}
        setContent={(content) => updateAnswerSheet(index, 'answer_english', content)}
        placeholder="Answer in English"
      />

      {/* Nepali Answer */}
      <Texteditor
        id={'answer-nepali-' + index}
        content={answer_sheet.answer_nepali}
        setContent={(content) => updateAnswerSheet(index, 'answer_nepali', content)}
        placeholder="Answer in Nepali"
      />

      {/* Answer Image */}
      <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-gray-50 mt-4">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id={`a-image-${index}`}
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
        {answer_sheet.answer_image ? (
          <div className="relative inline-block">
            <Image src={answer_sheet.answer_image} alt="Preview" width={200} height={200} className="rounded" />
            <button
              type="button"
              className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded"
              onClick={() => updateAnswerSheet(index, 'answer_image', null)}
            >
              Remove
            </button>
          </div>
        ) : (
          <label htmlFor={`a-image-${index}`} className="cursor-pointer text-gray-500">
            Click to upload image
          </label>
        )}
      </div>
    </div>
  );
}
