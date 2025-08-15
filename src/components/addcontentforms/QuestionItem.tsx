'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AnswerSheetForm from './AnswerSheetForm';
import Texteditor from './TextEditor';

interface QuestionItemProps {
  index: number;
  question: ExamQuestion;
  updateQuestion: ( index: number, field: keyof ExamQuestion, value: ExamQuestion[keyof ExamQuestion]) => void;
  updateAnswerSheet: (index: number, field: keyof AnswerSheet, value: AnswerSheet[keyof AnswerSheet]) => void;
  removeQuestion: (index: number) => void;
  handleImageUpload: (file: File, index: number, type: 'question' | 'answer') => void;
}

export default function QuestionItem({
  index,
  question,
  updateQuestion,
  updateAnswerSheet,
  removeQuestion,
  handleImageUpload
}: QuestionItemProps) {
  return (
    <div className="border p-4 rounded-md space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold">Question {question.q_no}</h2>
        <Button variant="destructive" size="sm" onClick={() => removeQuestion(index)}>Remove</Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="number"
          placeholder="Question No"
          value={question.q_no}
          onChange={(e) => updateQuestion(index, 'q_no', Number(e.target.value))}
        />
      </div>

      <Texteditor
        label="Question in English"
        content={question.question_english}
        id={'question-english-' + index}
        setContent={(content) => updateQuestion(index, 'question_english', content)}
        placeholder="Question in English"
      />

      <Texteditor
        label="Question in Nepali"
        content={question.question_nepali}
        id={'question-nepali-' + index}
        setContent={(content) => updateQuestion(index, 'question_nepali', content)}
        placeholder="Question in Nepali"
      />

      <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-gray-50">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id={`q-image-${index}`}
          onChange={(e) => e.target.files && handleImageUpload(e.target.files[0], index, 'question')}
        />
        {question.question_image ? (
          <div className="relative inline-block">
            <img src={question.question_image} alt="Preview" className="max-h-40 rounded" />
            <button
              type="button"
              className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded"
              onClick={() => updateQuestion(index, 'question_image', null)}
            >
              Remove
            </button>
          </div>
        ) : (
          <label htmlFor={`q-image-${index}`} className="cursor-pointer text-gray-500">
            Click to upload image
          </label>
        )}
      </div>

      <AnswerSheetForm
        index={index}
        answer_sheet={question.answer_sheet}
        updateAnswerSheet={updateAnswerSheet}
        handleImageUpload={handleImageUpload}
      />
    </div>
  );
}
