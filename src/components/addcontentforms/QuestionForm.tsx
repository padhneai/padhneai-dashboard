'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import MetadataForm from './MetadataForm';
import QuestionItem from './QuestionItem';
import { createPaper } from '@/services/paper';

// Category & Province options
const CATEGORY_MAP: Record<string, string> = {
  'model-sets': 'Model Question',
  'question-banks': '10 Set',
  'notes': 'Notes',
};

const PROVINCES = [
  'Province 1',
  'Province 2',
  'Bagmati',
  'Gandaki',
  'Lumbini',
  'Karnali',
  'Sudurpashchim'
];

// TypeScript types
interface AnswerSheet {
  answer_english: string;
  answer_nepali: string;
  answer_image: string | null;
}

interface ExamQuestion {
  q_no: number;
  question_english: string;
  question_nepali: string;
  question_image: string | null;
  answer_sheet: AnswerSheet;
}

interface QuestionFormProps {
  contentType: string;
  subjectId: string;
  classno: string;
}

export default function QuestionForm({ contentType, subjectId, classno }: QuestionFormProps) {
  const [province, setProvince] = useState<string>('');
  const [metadescription, setMetadescription] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const categorytype = CATEGORY_MAP[contentType] || 'Model Question';

  const [questions, setQuestions] = useState<ExamQuestion[]>([]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        q_no: questions.length + 1,
        question_english: '',
        question_nepali: '',
        question_image: null,
        answer_sheet: {
          answer_english: '',
          answer_nepali: '',
          answer_image: null,
        },
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = <K extends keyof ExamQuestion>(
    index: number,
    field: K,
    value: ExamQuestion[K]
  ) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const updateAnswerSheet = <K extends keyof AnswerSheet>(
    index: number,
    field: K,
    value: AnswerSheet[K]
  ) => {
    const updated = [...questions];
    updated[index].answer_sheet[field] = value;
    setQuestions(updated);
  };

  const handleImageUpload = (
    file: File,
    index: number,
    type: 'question' | 'answer'
  ) => {
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be under 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const url = reader.result as string;
      if (type === 'question') {
        updateQuestion(index, 'question_image', url);
      } else {
        updateAnswerSheet(index, 'answer_image', url);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!province || !metadescription || !year) {
      alert('Please fill in all main fields');
      return;
    }

    const jsonData = {
      province,
      subject: subjectId,
      class_name: classno,
      year,
      metadescription,
      question_type: categorytype,
      questions,
    };

    try {
      const response = await createPaper(jsonData);
      console.log('✅ Paper created:', response);
      alert('Paper submitted successfully!');
    } catch (error: any) {
      console.error('❌ Error submitting paper:', error);
      alert('Failed to submit paper');
    }
  };

  return (
    <div className="p-6 space-y-6 w-full md:w-[90%] m-auto">
      <div className="flex gap-12">
        <h1 className="text-2xl font-bold">Question Paper of {subjectId}</h1>
        <h1 className="text-2xl font-bold">Type : {categorytype}</h1>
      </div>

      {/* Province Dropdown */}
      <div className="w-64">
        <Select value={province} onValueChange={setProvince}>
          <SelectTrigger>
            <SelectValue placeholder="Select Province" />
          </SelectTrigger>
          <SelectContent>
            {PROVINCES.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <MetadataForm
        Metadescription={metadescription}
        setMetadescription={setMetadescription}
        year={year}
        setYear={setYear}
      />

      {questions.map((q, index) => (
        <QuestionItem
          key={index}
          index={index}
          question={q}
          updateQuestion={updateQuestion}
          updateAnswerSheet={updateAnswerSheet}
          removeQuestion={removeQuestion}
          handleImageUpload={handleImageUpload}
        />
      ))}

      <Button variant="secondary" onClick={addQuestion}>
        Add Question
      </Button>
      <Button onClick={handleSubmit} className="ml-4">
        Submit
      </Button>
    </div>
  );
}
