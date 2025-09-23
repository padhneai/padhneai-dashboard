'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import MetadataForm from './MetadataForm';
import QuestionItem from './QuestionItem';
import { createPaper, updatePaper } from '@/services/paper';
import { toast } from 'sonner';
import { FileQuestion, MapPin, Calendar, Plus, Save, BookOpen, Users, Award, Minus } from 'lucide-react';
import axios from 'axios';
import LoadingOverlay from '../Loading/LoadingOverlay';

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
  const actualClassno = mode === 'edit' ? (initialData?.subject.class_level || classid) : (classid || '');
  const [submitting, setSubmitting] = useState<'idle' | 'loading' | 'success'>('idle');

  const [province, setProvince] = useState<string>(initialData?.province || '');
  const [metadescription, setMetadescription] = useState<string>(initialData?.metadescription || '');
  const [year, setYear] = useState<string>(initialData?.year || '');
  const categorytype = initialData?.question_type || CATEGORY_MAP[contentType] || 'Model Question';
  const [questions, setQuestions] = useState<ExamQuestion[]>(initialData?.questions || []);

  // Collapse state — everything hidden by default
  const [provinceExpanded, setProvinceExpanded] = useState(false);
  const [metadataExpanded, setMetadataExpanded] = useState(false);
  const [questionsExpanded, setQuestionsExpanded] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<boolean[]>(initialData?.questions?.map(() => false) || []);

  // Only one question expanded at a time
  const toggleQuestion = (index: number) => {
    const updated = questions.map((_, i) => i === index ? !expandedQuestions[i] : false);
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
    setExpandedQuestions([...expandedQuestions.map(() => false), true]);
    setQuestionsExpanded(true);
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

  // Image handling (upload, update, delete)
  const handleImageUpload = async (file: File, index: number, type: 'question' | 'answer') => {
    if (file.size > 2 * 1024 * 1024) { toast.warning('File size must be under 2MB'); return; }
    const formData = new FormData(); formData.append("file", file);
    try {
      const res = await axios.post('/api/imageupload/', formData, { headers: { "Content-Type": "multipart/form-data" }});
      const publicId = res.data?.publicId;
      if (!publicId) return toast.error("Upload failed");
      type === 'question' ? updateQuestion(index, 'question_image', publicId) : updateAnswerSheet(index, 'answer_image', publicId);
      toast.success("Image uploaded successfully");
    } catch (e) { console.error(e); toast.error("Upload failed"); }
  };

  const handleImageUpdate = async (file: File, currentPublicId: string, index: number, type: 'question' | 'answer') => {
    if (!currentPublicId) return handleImageUpload(file, index, type);
    const formData = new FormData(); formData.append("file", file); formData.append("oldPublicId", currentPublicId);
    try {
      const res = await axios.put('/api/imageupload/', formData, { headers: { "Content-Type": "multipart/form-data" }});
      const newId = res.data?.publicId;
      if (!newId) return toast.error("Update failed");
      type === 'question' ? updateQuestion(index, 'question_image', newId) : updateAnswerSheet(index, 'answer_image', newId);
      toast.success("Image updated successfully");
    } catch (e) { console.error(e); toast.error("Update failed"); }
  };

  const handleImageDelete = async (index: number, type: 'question' | 'answer') => {
    try {
      const imageId = type === 'question' ? questions[index].question_image : questions[index].answer_sheet.answer_image;
      if (!imageId) return toast.error("No image to delete");
      await axios.post("/api/imagedelete", { publicId: imageId });
      type === 'question' ? updateQuestion(index, 'question_image', null) : updateAnswerSheet(index, 'answer_image', null);
      toast.success("Image deleted successfully");
    } catch (e) { console.error(e); toast.error("Delete failed"); }
  };

  const resetForm = () => {
    setProvince(''); setMetadescription(''); setYear(''); setQuestions([]); setExpandedQuestions([]);
    setProvinceExpanded(false); setMetadataExpanded(false); setQuestionsExpanded(false);
  };

  const handleSubmit = async () => {
    if (!province || !metadescription || !year) return toast.warning('Please fill all fields');
    if (!actualSubjectId || !actualClassno) return toast.warning('Subject and class required');

    const jsonData = { province, subject_id: Number(actualSubjectId), class_level_id: Number(actualClassno), year, metadescription, question_type: categorytype, questions };
    try {
      setSubmitting('loading');
      mode === 'edit' && initialData?.id ? await updatePaper(initialData.id, jsonData) : await createPaper(jsonData);
      toast.success(mode === 'edit' ? 'Paper updated!' : 'Paper created!');
      setSubmitting('success');
      resetForm();
    } catch (e) {
      console.error(e);
      toast.error(`Failed to ${mode === 'edit' ? 'update' : 'create'} paper`);
      setSubmitting('idle');
    } finally { setTimeout(() => setSubmitting('idle'), 2000); }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      <div className="max-w-7xl mx-auto p-6">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{mode === 'edit' ? 'Edit' : 'Create'} Question Paper</h1>
            <div className="flex gap-4 mt-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">{classname}</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">{subjectname}</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">{categorytype}</span>
            </div>
          </div>
          <div className="text-right">
            <p>Total Questions</p>
            <p className="text-2xl font-bold text-purple-600">{questions.length}</p>
          </div>
        </div>

        {/* Province Section */}
        <div className="bg-white rounded-2xl shadow-lg mb-6">
          <div className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer rounded-2xl" onClick={() => setProvinceExpanded(prev => !prev)}>
            <h2 className="font-semibold text-lg">Province</h2>
            <span>{provinceExpanded ? <Minus /> : <Plus />}</span>
          </div>
          {provinceExpanded && (
            <div className="p-4">
              <Select value={province} onValueChange={setProvince}>
                <SelectTrigger className="border-2 border-gray-200 focus:border-purple-500 rounded-xl px-4 py-3">
                  <SelectValue placeholder="Select Province" />
                </SelectTrigger>
                <SelectContent>{PROVINCES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Metadata Section */}
        <div className="bg-white rounded-2xl shadow-lg mb-6">
          <div className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer rounded-xl" onClick={() => setMetadataExpanded(prev => !prev)}>
            <h2 className="font-semibold text-lg">Metadata</h2>
            <span>{metadataExpanded ? <Minus /> : <Plus />}</span>
          </div>
          {metadataExpanded && <div className="p-4"><MetadataForm Metadescription={metadescription} setMetadescription={setMetadescription} year={year} setYear={setYear} /></div>}
        </div>

        {/* Questions Section */}
        <div className="bg-white rounded-2xl shadow-lg mb-6">
          <div className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer rounded-xl" onClick={() => setQuestionsExpanded(prev => !prev)}>
            <h2 className="font-semibold text-lg">Questions</h2>
            <span>{questionsExpanded ? <Minus /> : <Plus />}</span>
          </div>
          {questionsExpanded && (
            <div className="p-4 space-y-4">
              {questions.map((q, i) => (
                <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer" onClick={() => toggleQuestion(i)}>
                    <p className="font-semibold">Question {q.q_no}</p>
                    <span>{expandedQuestions[i] ? <Minus /> : <Plus />}</span>
                  </div>
                  {expandedQuestions[i] && (
                    <div className="p-4">
                      <QuestionItem
                        index={i} question={q} updateQuestion={updateQuestion} updateAnswerSheet={updateAnswerSheet}
                        removeQuestion={removeQuestion} handleImageUpload={handleImageUpload} handleImageUpdate={handleImageUpdate}
                        handleImageDelete={handleImageDelete}
                      />
                    </div>
                  )}
                </div>
              ))}
              <Button onClick={addQuestion} className="mt-4 flex items-center gap-2"><Plus /> Add Question</Button>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8 flex justify-between items-center">
          <Button onClick={handleSubmit} className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl flex items-center gap-2"><Save /> {mode === 'edit' ? 'Update Paper' : 'Publish Paper'}</Button>
        </div>

      </div>

      {submitting !== 'idle' && <LoadingOverlay submitting={submitting} mode={mode} />}
    </div>
  );
}
