'use client';

import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AnswerSheetForm from './AnswerSheetForm';
import Texteditor from './TextEditor';
import { Loader2, Plus } from 'lucide-react';

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
  handleImageUpload: (
    file: File,
    index: number,
    type: 'question' | 'answer'
  ) =>  void;
  handleImageUpdate?: (
    file: File,
    currentPublicId: string,
    index: number,
    type: 'question' | 'answer'
  ) =>  void;
  handleImageDelete?: (
    index: number,
    type: 'question' | 'answer'
  ) => Promise<void> | void;
}

export default function QuestionItem({
  index,
  question,
  updateQuestion,
  updateAnswerSheet,
  removeQuestion,
  handleImageUpload,
  handleImageUpdate,
  handleImageDelete,
}: QuestionItemProps) {
  const [showEnglish, setShowEnglish] = useState(false);
  const [showNepali, setShowNepali] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const [loading, setLoading] = useState<'upload' | 'update' | 'delete' | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const imageUrl = question.question_image
    ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${question.question_image}`
    : null;

  const onUpload = async (file: File) => {
    try {
      setLoading('upload');
      await handleImageUpload(file, index, 'question');
    } finally {
      setLoading(null);
    }
  };

  const onUpdate = async (file: File) => {
    try {
      setLoading('update');
      //@ts-ignore
      await handleImageUpdate?.(file, question.question_image, index, 'question');
    } finally {
      setLoading(null);
    }
  };

  const onDelete = async () => {
    try {
      setLoading('delete');
      if (handleImageDelete) {
        await handleImageDelete(index, 'question');
      } else {
        updateQuestion(index, 'question_image', null);
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="border p-4 rounded-md space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="font-semibold">Question {question.q_no}</h2>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => removeQuestion(index)}
        >
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

      {/* Add buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button
          size="sm"
          variant={showEnglish ? 'default' : 'outline'}
          onClick={() => setShowEnglish((p) => !p)}
        >
          <Plus className="w-4 h-4 mr-1" />
          English Qn
        </Button>
        <Button
          size="sm"
          variant={showNepali ? 'default' : 'outline'}
          onClick={() => setShowNepali((p) => !p)}
        >
          <Plus className="w-4 h-4 mr-1" />
          Nepali Qn
        </Button>
        <Button
          size="sm"
          variant={showImage ? 'default' : 'outline'}
          onClick={() => setShowImage((p) => !p)}
        >
          <Plus className="w-4 h-4 mr-1" />
          Image
        </Button>
        <Button
          size="sm"
          variant={showAnswer ? 'default' : 'outline'}
          onClick={() => setShowAnswer((p) => !p)}
        >
          <Plus className="w-4 h-4 mr-1" />
          Answer
        </Button>
      </div>

      {/* English Question */}
      {showEnglish && (
        <Texteditor
          label="Question in English"
          content={question.question_english}
          id={'question-english-' + index}
          setContent={(content) =>
            updateQuestion(index, 'question_english', content)
          }
          placeholder="Question in English"
        />
      )}

      {/* Nepali Question */}
      {showNepali && (
        <Texteditor
          label="Question in Nepali"
          content={question.question_nepali}
          id={'question-nepali-' + index}
          setContent={(content) =>
            updateQuestion(index, 'question_nepali', content)
          }
          placeholder="Question in Nepali"
        />
      )}

      {/* Image Upload */}
      {showImage && (
        <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-gray-50">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                question.question_image
                  ? onUpdate(e.target.files[0])
                  : onUpload(e.target.files[0]);
              }
            }}
          />

          {imageUrl ? (
            <div className="flex flex-col items-center gap-2">
              <img
                src={imageUrl}
                alt="Preview"
                className="max-h-40 rounded shadow"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  disabled={loading === 'update'}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {loading === 'update' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Update'
                  )}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={loading === 'delete'}
                  onClick={onDelete}
                >
                  {loading === 'delete' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Delete'
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              disabled={loading === 'upload'}
              onClick={() => fileInputRef.current?.click()}
            >
              {loading === 'upload' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Upload Image'
              )}
            </Button>
          )}
        </div>
      )}

      {/* Answer Form */}
      {showAnswer && (
        <AnswerSheetForm
          index={index}
          answer_sheet={question.answer_sheet}
          updateAnswerSheet={updateAnswerSheet}
          handleImageUpload={handleImageUpload}
          handleImageUpdate={handleImageUpdate}
          handleImageDelete={handleImageDelete}
        />
      )}
    </div>
  );
}
