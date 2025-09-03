'use client';

import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AnswerSheetForm from './AnswerSheetForm';
import Texteditor from './TextEditor';

interface QuestionItemProps {
  index: number;
  question: ExamQuestion;
  updateQuestion: (
    index: number,
    field: keyof ExamQuestion,
    value: ExamQuestion[keyof ExamQuestion]
  ) => void;
  updateAnswerSheet: (
    index: number,
    field: keyof AnswerSheet,
    value: AnswerSheet[keyof AnswerSheet]
  ) => void;
  removeQuestion: (index: number) => void;
  handleImageUpload: (file: File, index: number, type: 'question' | 'answer') => void;
  handleImageUpdate?: (file: File, currentPublicId: string | null, index: number, type: 'question' | 'answer') => void;

  handleImageDelete?: (index: number, type: 'question' | 'answer') => void;
}

export default function QuestionItem({
  index,
  question,
  updateQuestion,
  updateAnswerSheet,
  removeQuestion,
  handleImageUpload,
  handleImageUpdate,
  handleImageDelete
}: QuestionItemProps) {
  const [showMore, setShowMore] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${question.question_image}`;

  return (
    <div className="border p-4 rounded-md space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="font-semibold">Question {question.q_no}</h2>
        <Button variant="destructive" size="sm" onClick={() => removeQuestion(index)}>
          Remove
        </Button>
      </div>

      {/* Question Number */}
      <Input
        type="number"
        placeholder="Question No"
        value={question.q_no}
        onChange={(e) => updateQuestion(index, 'q_no', Number(e.target.value))}
      />

      {/* English Question */}
      <Texteditor
        label="Question in English"
        content={question.question_english}
        id={'question-english-' + index}
        setContent={(content) => updateQuestion(index, 'question_english', content)}
        placeholder="Question in English"
      />

      {/* Show/Hide Additional Fields */}
      <Button variant="outline" size="sm" onClick={() => setShowMore(!showMore)}>
        {showMore ? 'Hide Additional Fields' : 'Show Additional Fields'}
      </Button>

      {showMore && (
        <div className="space-y-4 mt-2">
          {/* Nepali Question */}
          <Texteditor
            label="Question in Nepali"
            content={question.question_nepali}
            id={'question-nepali-' + index}
            setContent={(content) => updateQuestion(index, 'question_nepali', content)}
            placeholder="Question in Nepali"
          />

          {/* Question Image Upload / Update / Delete */}
          <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-gray-50">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  question.question_image
                    ? handleImageUpdate?.(e.target.files[0], question.question_image, index, 'question')
                    : handleImageUpload(e.target.files[0], index, 'question');
                }
              }}
            />

            {question.question_image ? (
              <div className="flex flex-col items-center gap-2">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="max-h-40 rounded shadow"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => fileInputRef.current?.click()}>
                    Update
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      handleImageDelete
                        ? handleImageDelete(index, 'question')
                        : updateQuestion(index, 'question_image', null)
                    }
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                Upload Image
              </Button>
            )}
          </div>

          {/* Answer Sheet */}
          <AnswerSheetForm
            index={index}
            answer_sheet={question.answer_sheet}
            updateAnswerSheet={updateAnswerSheet}
            handleImageUpload={handleImageUpload}
            handleImageUpdate={handleImageUpdate}
            handleImageDelete={handleImageDelete}
          />
        </div>
      )}
    </div>
  );
}
