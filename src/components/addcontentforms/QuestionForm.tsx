'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import MetadataForm from './MetadataForm';
import QuestionItem from './QuestionItem';

const CATEGORY_MAP: Record<string, string> = {
    'model-sets': 'Model Question',
    'question-banks': '10 Set',
    'notes': 'Notes',
  };


export default function QuestionForm({contentType,subjectId,classno}:{contentType:string,subjectId:string,classno:string,}) {
  
  const [Metadescription, setMetadescription] = useState('');
  const [year, setYear] = useState('');
  const categorytype = CATEGORY_MAP[contentType];
  
  const [questions, setQuestions] = useState<Question[]>([]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        q_no: questions.length + 1,
        group: '',
        question_title: '',
        question_description: '',
        question_image: null,
        answersheet: {
          answersheet_title: '',
          answersheet_description: '',
          answersheet_image: null,
        },
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated:any = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

 

  const updateAnswerSheet = (index: number, field: keyof Question['answersheet'], value: any) => {
    const updated = [...questions];
    updated[index].answersheet[field] = value;
    setQuestions(updated);
  };

  const handleImageUpload = (file: File, index: number, type: 'question' | 'answer') => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const url = reader.result as string;
      if (type === 'question') {
        updateQuestion(index, 'question_image', url);
      } else {
        updateAnswerSheet(index, 'answersheet_image', url);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!Metadescription  || !year ) {
      alert('Please fill in all main fields');
      return;
    }
    // for (let q of questions) {
    //   if (!q.group || !q.question_title || !q.question_description || !q.answersheet.answersheet_title || !q.answersheet.answersheet_description) {
    //     alert('Please fill in all required question and answer fields');
    //     return;
    //   }
    // }

    const jsonData: QuestionPaper = {
      subject:subjectId,
      class: classno,
      year,
      Metadescription,
      category:categorytype,
      questions,
    };
    console.log('Final JSON:', jsonData);
    alert('Data logged in console!');
  };

  return (
    <div className="p-6 space-y-6 w-full  md:w-[90%] m-auto ">
        <div className="flex gap-12">

      <h1 className="text-2xl font-bold">Question Paper of {subjectId}</h1>
      <h1 className="text-2xl font-bold">Type : {categorytype}</h1>

        </div>

      <MetadataForm
       Metadescription={Metadescription}
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

      <Button variant="secondary" onClick={addQuestion}>Add Question</Button>
      <Button onClick={handleSubmit} className="ml-4">Submit</Button>
    </div>
  );
}
