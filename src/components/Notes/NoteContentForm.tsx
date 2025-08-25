'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { toast } from 'sonner';
import { createNote, partialUpdateNote, updateNote } from '@/services/notes';
import Texteditor from '../addcontentforms/TextEditor';

interface NoteContentFormProps {
  tocEntryId: number;
  initialData?: {
    long_description_english?: string;
    long_description_nepali?: string;
    questions_english?: string;
    questions_nepali?: string;
  };
  mode?: 'add' | 'edit';
}

export default function NoteContentForm({ tocEntryId, initialData, mode = 'add' }: NoteContentFormProps) {
  const [formData, setFormData] = useState({
    long_description_english: initialData?.long_description_english || "",
    long_description_nepali: initialData?.long_description_nepali || "",
    questions_english: initialData?.questions_english || "",
    questions_nepali: initialData?.questions_nepali || "",
  });

  const handleChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
  if (!formData.long_description_english) {
    toast.error("Please fill in long description and questions (English)");
    return;
  }

  try {
    if (mode === "edit") {
      await partialUpdateNote( tocEntryId, {...formData });
      toast.success("Note updated successfully!");
    } else {
      await createNote({ toc_entry_id: tocEntryId, ...formData });
      toast.success("Note created successfully!");
    }
  } catch (err) {
    toast.error("Failed to save note content");
  }
}, [formData, tocEntryId, mode]);


  // const handleSubmit = useCallback(async () => {
  //   if (!formData.long_description_english) {
  //     toast.error('Please fill in long description and questions (English)');
  //     return;
  //   }

  //   try {
  //     await createNote({ toc_entry_id: tocEntryId, ...formData });
  //     toast.success(`Note ${mode === 'edit' ? 'updated' : 'created'} successfully!`);
  //   } catch (err) {
  //     toast.error('Failed to save note content');
  //   }
  // }, [formData, tocEntryId, mode]);

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-lg space-y-6 mt-8">
      <h2 className="text-2xl font-semibold">{mode === 'edit' ? 'Edit' : 'Add'} Note Content</h2>

      <div>
        <Label>Long Description (English)</Label>
        <Texteditor
          content={formData.long_description_english}
          setContent={value => handleChange('long_description_english', value)}
          id="long_description_english"
          label="Long Description English"
        />
      </div>

      <div>
        <Label>Long Description (Nepali)</Label>
        <Texteditor
          content={formData.long_description_nepali}
          setContent={value => handleChange('long_description_nepali', value)}
          id="long_description_nepali"
          label="Long Description Nepali"
        />
      </div>

      <div>
        <Label>Questions (English)</Label>
        <Texteditor
          content={formData.questions_english}
          setContent={value => handleChange('questions_english', value)}
          id="questions_english"
          label="Questions English"
        />
      </div>

      <div>
        <Label>Questions (Nepali)</Label>
        <Texteditor
          content={formData.questions_nepali}
          setContent={value => handleChange('questions_nepali', value)}
          id="questions_nepali"
          label="Questions Nepali"
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} className="bg-indigo-600 text-white px-6 py-2 rounded-xl">
          {mode === 'edit' ? 'Update Note Content' : 'Create Note Content'}
        </Button>
      </div>
    </div>
  );
}
