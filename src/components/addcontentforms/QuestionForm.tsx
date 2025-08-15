'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import MetadataForm from './MetadataForm';
import QuestionItem from './QuestionItem';
import { createPaper, updatePaper } from '@/services/paper';
import { toast } from 'sonner';

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



interface QuestionFormProps {
  contentType: string;
  subjectId?: string; // Optional - will use initialData.subject in edit mode
  classno?: string; // Optional - will use initialData.class_name in edit mode
  initialData?: Paper; // Optional initial data for edit mode
  mode?: 'add' | 'edit'; // Mode to determine add or edit
}

export default function QuestionForm({ contentType, subjectId, classno, initialData, mode = 'add' }: QuestionFormProps) {
  // In edit mode, use data from initialData; in add mode, use passed props
  const actualSubjectId = mode === 'edit' ? (initialData?.subject || subjectId) : (subjectId || '');
  const actualClassno = mode === 'edit' ? (initialData?.class_name || classno) : (classno || '');
  
  const [province, setProvince] = useState<string>(initialData?.province || '');
  const [metadescription, setMetadescription] = useState<string>(initialData?.metadescription || '');
  const [year, setYear] = useState<string>(initialData?.year || '');
  const categorytype = initialData?.question_type || CATEGORY_MAP[contentType] || 'Model Question';

  const [questions, setQuestions] = useState<ExamQuestion[]>(initialData?.questions || []);

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

  const resetForm = () => {
    setProvince('');
    setMetadescription('');
    setYear('');
    setQuestions([]);
  };

  const handleSubmit = async () => {
    if (!province || !metadescription || !year) {
      alert('Please fill in all main fields');
      return;
    }

    if (!actualSubjectId || !actualClassno) {
      alert('Subject and class information is required');
      return;
    }

    const jsonData = {
      province,
      subject: actualSubjectId,
      class_name: actualClassno,
      year,
      metadescription,
      question_type: categorytype,
      questions,
    };

    try {
      let response;
      if (mode === 'edit' && initialData?.id) {
        // Update existing paper
        response = await updatePaper(initialData.id, jsonData);
        console.log('✅ Paper updated:', response);
        toast.success('Paper updated successfully!', {
          duration: 5000,
          richColors: true,
        });
      } else {
        // Create new paper
        response = await createPaper(jsonData);
        console.log('✅ Paper created:', response);
        toast.success('Paper created successfully!', {
          duration: 5000,
          richColors: true,
        });
        
        // Reset form after successful creation (not for edit)
        resetForm();
      }
      
    } catch (error: any) {
      console.error('❌ Error submitting paper:', error);
      const action = mode === 'edit' ? 'update' : 'create';
      toast.error(`Failed to ${action} paper`, {
        duration: 5000,
        richColors: true,
      });
    }
  };

  return (
    <div className="p-6 space-y-6 w-full md:w-[90%] m-auto">
      <div className="flex gap-12">
        <h1 className="text-2xl font-bold">
          {mode === 'edit' ? 'Edit' : 'Create'} Question Paper of {actualSubjectId}
        </h1>
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
        {mode === 'edit' ? 'Update Paper' : 'Submit Paper'}
      </Button>
    </div>
  );
}
