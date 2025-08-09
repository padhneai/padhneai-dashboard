'use client';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';


import AnswerSheetForm from './AnswerSheetForm';
import Texteditor from './TextEditor';


interface QuestionItemProps {
  index: number;
  question: Question;
  updateQuestion: (index: number, field: keyof Question, value: any) => void;
  updateAnswerSheet: (index: number, field: keyof Question['answersheet'], value: any) => void;
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
        <Select value={question.group} onValueChange={(val) => updateQuestion(index, 'group', val)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A">A</SelectItem>
            <SelectItem value="B">B</SelectItem>
            <SelectItem value="C">C</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Question Title"
          value={question.question_title}
          onChange={(e) => updateQuestion(index, 'question_title', e.target.value)}
        />
      </div>

      <Texteditor
  content={question.question_description}
  id={'question'+index.toString()}
  setContent={(content) => updateQuestion(index, 'question_description', content)}
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
        answersheet={question.answersheet}
        updateAnswerSheet={updateAnswerSheet}
        handleImageUpload={handleImageUpload}
      />
    </div>
  );
}
