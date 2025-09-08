'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { createNote, partialUpdateNote } from '@/services/notes';
import Texteditor from '../addcontentforms/TextEditor';
import { Input } from '../ui/input';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface NoteContentFormProps {
  tocEntryId: number;
  initialData?: {
    long_description_english?: string;
    long_description_nepali?: string;
    questions_english?: string;
    questions_nepali?: string;
    image?: File;
  };
  mode?: 'add' | 'edit';
}

export default function NoteContentForm({
  tocEntryId,
  initialData,
  mode = 'add',
}: NoteContentFormProps) {
  const [formData, setFormData] = useState({
    long_description_english: initialData?.long_description_english || '',
    long_description_nepali: initialData?.long_description_nepali || '',
    questions_english: initialData?.questions_english || '',
    questions_nepali: initialData?.questions_nepali || '',
    image: initialData?.image || null,
  });

  const [openSections, setOpenSections] = useState({
    longNepali: false,
    questionsEnglish: false,
    questionsNepali: false,
    image: false,
  });

  const handleChange = useCallback((field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSubmit = useCallback(async () => {
    if (!formData.long_description_english) {
      toast.error('Please fill in long description (English)');
      return;
    }

    try {
      if (mode === 'edit') {
        await partialUpdateNote(tocEntryId, { ...formData });
        toast.success('Note updated successfully!');
      } else {
        await createNote({ toc_entry_id: tocEntryId, ...formData });
        toast.success('Note created successfully!');
      }
    } catch (err) {
      toast.error('Failed to save note content');
    }
  }, [formData, tocEntryId, mode]);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-8 bg-white shadow-xl rounded-2xl space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">
        {mode === 'edit' ? 'Edit' : 'Add'} Note Content
      </h2>

      {/* Long Description English */}
      <div className="space-y-2 bg-gray-50 p-6 rounded-xl border border-gray-200">
        <Label>Long Description (English)</Label>
        <Texteditor
          content={formData.long_description_english}
          setContent={(value) =>
            handleChange('long_description_english', value)
          }
          id="long_description_english"
          label="Long Description English"
        />
      </div>

      {/* Collapsible Sections */}
      {/* Long Description Nepali */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('longNepali')}
          className="w-full flex justify-between items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold"
        >
          Long Description (Nepali)
          {openSections.longNepali ? <ChevronUp /> : <ChevronDown />}
        </button>
        {openSections.longNepali && (
          <div className="p-6 bg-gray-50">
            <Texteditor
              content={formData.long_description_nepali}
              setContent={(value) =>
                handleChange('long_description_nepali', value)
              }
              id="long_description_nepali"
              label="Long Description Nepali"
            />
          </div>
        )}
      </div>

      {/* Questions English */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('questionsEnglish')}
          className="w-full flex justify-between items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold"
        >
          Questions (English)
          {openSections.questionsEnglish ? <ChevronUp /> : <ChevronDown />}
        </button>
        {openSections.questionsEnglish && (
          <div className="p-6 bg-gray-50">
            <Texteditor
              content={formData.questions_english}
              setContent={(value) =>
                handleChange('questions_english', value)
              }
              id="questions_english"
              label="Questions English"
            />
          </div>
        )}
      </div>

      {/* Questions Nepali */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('questionsNepali')}
          className="w-full flex justify-between items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold"
        >
          Questions (Nepali)
          {openSections.questionsNepali ? <ChevronUp /> : <ChevronDown />}
        </button>
        {openSections.questionsNepali && (
          <div className="p-6 bg-gray-50">
            <Texteditor
              content={formData.questions_nepali}
              setContent={(value) =>
                handleChange('questions_nepali', value)
              }
              id="questions_nepali"
              label="Questions Nepali"
            />
          </div>
        )}
      </div>

      {/* Image Upload */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('image')}
          className="w-full flex justify-between items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold"
        >
          Upload Image
          {openSections.image ? <ChevronUp /> : <ChevronDown />}
        </button>
        {openSections.image && (
          <div className="p-6 bg-gray-50">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleChange('image', e.target.files?.[0] || null)
              }
            />
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-transform hover:scale-[1.02]"
          onClick={handleSubmit}
        >
          {mode === 'edit' ? 'Update Note Content' : 'Create Note Content'}
        </Button>
      </div>
    </div>
  );
}
