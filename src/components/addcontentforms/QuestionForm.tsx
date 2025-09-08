'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MetadataForm from './MetadataForm';
import QuestionItem from './QuestionItem';
import { createPaper, updatePaper } from '@/services/paper';
import { toast } from 'sonner';
import { FileQuestion, MapPin, Calendar, Plus, Save, BookOpen, Users, Award } from 'lucide-react';
import axios from 'axios';

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
  subjectname?: string;
  subjectId?: string;
  classname?: string;
  classid?: string;
  initialData?: Paper;
  mode?: 'add' | 'edit';
}

export default function QuestionForm({ contentType, subjectId, subjectname, classname, classid, initialData, mode = 'add' }: QuestionFormProps) {
  const actualSubjectId = mode === 'edit' ? (initialData?.subject.id || subjectId) : (subjectId || '');
  const actualClassno = mode === 'edit' ? (initialData?.subject.class_level.id || classid) : (classid || '');

  const [province, setProvince] = useState<string>(initialData?.province || '');
  const [metadescription, setMetadescription] = useState<string>(initialData?.metadescription || '');
  const [year, setYear] = useState<string>(initialData?.year || '');
  const categorytype = initialData?.question_type || CATEGORY_MAP[contentType] || 'Model Question';
  const [questions, setQuestions] = useState<ExamQuestion[]>(initialData?.questions || []);

  // Collapse state for each question
  const [expandedQuestions, setExpandedQuestions] = useState<boolean[]>(
    initialData?.questions?.map(() => true) || []
  );

  const toggleQuestion = (index: number) => {
    const updated = [...expandedQuestions];
    updated[index] = !updated[index];
    setExpandedQuestions(updated);
  };

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
    setExpandedQuestions([...expandedQuestions, true]); // expand new question by default
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
    setExpandedQuestions(expandedQuestions.filter((_, i) => i !== index));
  };

  const updateQuestion = <K extends keyof ExamQuestion>(index: number, field: K, value: ExamQuestion[K]) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const updateAnswerSheet = <K extends keyof AnswerSheet>(index: number, field: K, value: AnswerSheet[K]) => {
    const updated = [...questions];
    updated[index].answer_sheet[field] = value;
    setQuestions(updated);
  };

  // const handleImageUpload = (file: File, index: number, type: 'question' | 'answer') => {
  //   if (file.size > 2 * 1024 * 1024) {
  //     alert('File size must be under 2MB');
  //     return;
  //   }
  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     const url = reader.result as string;
  //     if (type === 'question') {
  //       updateQuestion(index, 'question_image', url); 
  //     } else {
  //       updateAnswerSheet(index, 'answer_image', url);
  //     }
  //   };
  //   reader.readAsDataURL(file);
  // };



  const handleImageUpload = async (file: File, index: number, type: 'question' | 'answer') => {
  if (file.size > 2 * 1024 * 1024) {
    alert('File size must be under 2MB');
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post('/api/imageupload/', formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const publicId = response.data?.publicId; // <- backend must return this
console.log(response)

    if (!publicId) {
      toast.error("Upload failed: no publicId returned");
      return;
    }

    if (type === 'question') {
      updateQuestion(index, 'question_image', publicId); 
    } else {
      updateAnswerSheet(index, 'answer_image', publicId);
    }
  } catch (error) {
    console.error("Image upload failed:", error);
    toast.error("Failed to upload image");
  }
};


const handleImageUpdate = async (file: File, currentPublicId: string, index: number, type: 'question' | 'answer') => {
  if (!currentPublicId) {
    // fallback: if no previous image, just upload
    await handleImageUpload(file, index, type);
    toast.success("Image uploaded successfully");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("oldPublicId", currentPublicId);

  try {
    const response = await axios.put('/api/imageupload/', formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const newPublicId = response.data?.publicId;
    if (!newPublicId) {
      toast.error("Update failed: no publicId returned");
      return;
    }

    // Update local state
    if (type === 'question') {
      updateQuestion(index, 'question_image', newPublicId);
    } else {
      updateAnswerSheet(index, 'answer_image', newPublicId);
    }

    toast.success("Image updated successfully");
  } catch (error) {
    console.error("Image update failed:", error);
    toast.error("Failed to update image");
  }
};


const handleImageDelete = async (index: number, type: 'question' | 'answer') => {
  try {
    const imageId = type === 'question'
      ? questions[index].question_image
      : questions[index].answer_sheet.answer_image;

    if (!imageId) {
      toast.error("No image to delete");
      return;
    }

    // Call backend delete endpoint
    await axios.post("/api/imagedelete", { publicId: imageId });

    // Update state: clear the image
    if (type === 'question') {
      updateQuestion(index, 'question_image', null);
    } else {
      updateAnswerSheet(index, 'answer_image', null);
    }

    toast.success("Image deleted successfully");
  } catch (error) {
    console.error("Delete failed:", error);
    toast.error("Failed to delete image");
  }
};





  const resetForm = () => {
    setProvince('');
    setMetadescription('');
    setYear('');
    setQuestions([]);
    setExpandedQuestions([]);
  };

  const handleSubmit = async () => {
    if (!province || !metadescription || !year) {
      toast.warning('Please fill in all main fields');
      return;
    }

    if (!actualSubjectId || !actualClassno) {
      toast.warning('Subject and class information is required');
      return;
    }

    const jsonData = {
      province,
      subject_id: Number(actualSubjectId),
      class_level_id: Number(actualClassno), 
      year,
      metadescription,
      question_type: categorytype,
      questions,
    };

    try {
      if (mode === 'edit' && initialData?.id) {
        await updatePaper(initialData.id, jsonData);
        toast.success('Paper updated successfully!', { duration: 5000, richColors: true });
      } else {
       console.log(jsonData)
        await createPaper(jsonData);
        toast.success('Paper created successfully!', { duration: 5000, richColors: true });
        resetForm();
      }
    } catch (error: any) {
      console.log(error)
      const action = mode === 'edit' ? 'update' : 'create';
      toast.error(`Failed to ${action} paper`, { duration: 5000, richColors: true });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <FileQuestion className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {mode === 'edit' ? 'Edit' : 'Create'} Question Paper
                </h1>
                <div className="flex items-center gap-4 text-sm">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                     class {classname}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                    {subjectname}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    {categorytype}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Total Questions</p>
              <p className="text-2xl font-bold text-purple-600">{questions.length}</p>
            </div>
          </div>
        </div>

        {/* Configuration Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Paper Configuration</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Province *
              </label>
              <Select value={province} onValueChange={setProvince}>
                <SelectTrigger className="border-2 border-gray-200 focus:border-purple-500 rounded-xl px-4 py-3">
                  <SelectValue placeholder="Select Province" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {PROVINCES.map((p) => (
                    <SelectItem key={p} value={p} className="py-3">{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Metadata Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Paper Details</h2>
          </div>
          <MetadataForm
            Metadescription={metadescription}
            setMetadescription={setMetadescription}
            year={year}
            setYear={setYear}
          />
        </div>

        {/* Questions Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
              </div>
            </div>

            {questions.length === 0 ? (
              <div className="text-center py-12">
                <FileQuestion className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No questions added yet</p>
                <p className="text-gray-400 text-sm">Click "Add Question" to start creating your question paper</p>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((q, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                    {/* Collapsible Header */}
                    <div
                      className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
                      onClick={() => toggleQuestion(index)}
                    >
                      <p className="font-semibold">Question {q.q_no}</p>
                      <span className="text-gray-500">{expandedQuestions[index] ? '−' : '+'}</span>
                    </div>

                    {/* Collapsible Content */}
                    {expandedQuestions[index] && (
                      <div className="p-4">
                        <QuestionItem
                          index={index}
                          question={q}
                          updateQuestion={updateQuestion}
                          updateAnswerSheet={updateAnswerSheet}
                          removeQuestion={removeQuestion}
                          handleImageUpload={handleImageUpload}
                          handleImageUpdate={handleImageUpdate}
                          handleImageDelete={handleImageDelete}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="text-sm text-gray-600">
              <p className="font-medium">Ready to {mode === 'edit' ? 'update' : 'publish'}?</p>
              <p>Make sure all required fields are filled and questions are complete.</p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={addQuestion}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl flex items-center gap-2 text-white font-semibold shadow-lg"
              >
                <Plus className="w-4 h-4" /> Add Question
              </Button>
              <Button 
                variant="outline" 
                className="px-6 py-3 rounded-xl border-2 border-gray-300 hover:border-gray-400"
              >
                Save as Draft
              </Button>
              <Button 
                onClick={handleSubmit} 
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl flex items-center gap-2 text-white font-semibold shadow-lg"
              >
                <Save className="w-5 h-5" /> 
                {mode === 'edit' ? 'Update Paper' : 'Publish Paper'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
