'use client';

import { useState } from 'react';
import Image from 'next/image';
import Texteditor from './TextEditor';
import { Loader2 } from 'lucide-react';

interface AnswerSheetFormProps {
  index: number;
  answer_sheet: ExamQuestion['answer_sheet'];
  updateAnswerSheet: <K extends keyof ExamQuestion['answer_sheet']>(
    index: number,
    field: K,
    value: ExamQuestion['answer_sheet'][K]
  ) => void;
  handleImageUpload: (
    file: File,
    index: number,
    type: 'question' | 'answer'
  ) => Promise<void> | void;
  handleImageUpdate?: (
    file: File,
    currentPublicId: string,
    index: number,
    type: 'question' | 'answer'
  ) => Promise<void> | void;
  handleImageDelete?: (
    index: number,
    type: 'question' | 'answer'
  ) => Promise<void> | void;
}

export default function AnswerSheetForm({
  index,
  answer_sheet,
  updateAnswerSheet,
  handleImageUpload,
  handleImageUpdate,
  handleImageDelete,
}: AnswerSheetFormProps) {
  const [loading, setLoading] = useState<'upload' | 'update' | 'delete' | null>(null);
  const [selectedLang, setSelectedLang] = useState<'english' | 'nepali' | 'both' | null>(null);

  const currentImage = answer_sheet.answer_image;
  const currentImageUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${currentImage}`;

  const onUpload = async (file: File) => {
    try {
      setLoading('upload');
      await handleImageUpload(file, index, 'answer');
    } finally {
      setLoading(null);
    }
  };

  const onUpdate = async (file: File) => {
    try {
      setLoading('update');
      await handleImageUpdate?.(file, currentImage ?? '', index, 'answer');
    } finally {
      setLoading(null);
    }
  };

  const onDelete = async () => {
    try {
      setLoading('delete');
      if (handleImageDelete) {
        await handleImageDelete(index, 'answer');
      } else {
        updateAnswerSheet(index, 'answer_image', null);
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      <h3 className="font-semibold mt-4">Answer Sheet</h3>

      {/* Language Selector */}
      <div className="flex gap-2 flex-wrap mb-3">
        <button
          className={`px-3 py-1 text-sm rounded ${
            selectedLang === 'english'
              ? 'bg-blue-600 text-white'
              : 'border border-gray-300'
          }`}
          onClick={() => setSelectedLang('english')}
          type="button"
        >
          English Answer
        </button>
        <button
          className={`px-3 py-1 text-sm rounded ${
            selectedLang === 'nepali'
              ? 'bg-blue-600 text-white'
              : 'border border-gray-300'
          }`}
          onClick={() => setSelectedLang('nepali')}
          type="button"
        >
          Nepali Answer
        </button>
        <button
          className={`px-3 py-1 text-sm rounded ${
            selectedLang === 'both'
              ? 'bg-blue-600 text-white'
              : 'border border-gray-300'
          }`}
          onClick={() => setSelectedLang('both')}
          type="button"
        >
          Both
        </button>
      </div>

      {/* Render Selected Editors */}
      {selectedLang === 'english' || selectedLang === 'both' ? (
        <Texteditor
          label="Answer in English"
          id={'answer-english-' + index}
          content={answer_sheet.answer_english}
          setContent={(content) => updateAnswerSheet(index, 'answer_english', content)}
          placeholder="Answer in English"
        />
      ) : null}

      {selectedLang === 'nepali' || selectedLang === 'both' ? (
        <Texteditor
          label="Answer in Nepali"
          id={'answer-nepali-' + index}
          content={answer_sheet.answer_nepali}
          setContent={(content) => updateAnswerSheet(index, 'answer_nepali', content)}
          placeholder="Answer in Nepali"
        />
      ) : null}

      {/* Answer Image Upload */}
      {selectedLang && (
        <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-gray-50 mt-4">
          {!currentImage ? (
            <label className="cursor-pointer inline-flex items-center gap-2 text-sm text-blue-600 font-medium">
              {loading === 'upload' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Upload Answer Image'
              )}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                disabled={loading === 'upload'}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 2 * 1024 * 1024) {
                      alert('Image size should be under 2MB');
                      return;
                    }
                    onUpload(file);
                  }
                }}
              />
            </label>
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
                <label className="bg-blue-500 text-white text-xs px-2 py-1 rounded cursor-pointer flex items-center justify-center">
                  {loading === 'update' ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    'Update'
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    disabled={loading === 'update'}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onUpdate(file);
                    }}
                  />
                </label>

                {/* Delete Button */}
                <button
                  type="button"
                  className="bg-red-500 text-white text-xs px-2 py-1 rounded flex items-center justify-center"
                  onClick={onDelete}
                  disabled={loading === 'delete'}
                >
                  {loading === 'delete' ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
