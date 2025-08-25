'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TextEditor from './TextEditor';
import { Plus, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { createTOC, partialUpdateTOC, updateTOC } from '@/services/notes';

interface StudyNote {
  id?: number;
  chapter_number: number;
  content_name_english: string;
  content_name_nepali: string;
  description_english: string;
  description_nepali: string;
}

interface StudyNotesProps {
  subjectId?: string;
  tocid?:number;
  initialData?: StudyNote;
  mode?: 'add' | 'edit';
}

export default function StudyNotes({
  subjectId,
  initialData,
  tocid,
  mode = 'add',
}: StudyNotesProps) {
  // Form state
  const [formData, setFormData] = useState<StudyNote[] | StudyNote>(
    mode === 'edit'
      ? {
          chapter_number: initialData?.chapter_number || 0,
          content_name_english: initialData?.content_name_english || '',
          content_name_nepali: initialData?.content_name_nepali || '',
          description_english: initialData?.description_english || '',
          description_nepali: initialData?.description_nepali || '',
        }
      : [
          {
            chapter_number: 0,
            content_name_english: '',
            content_name_nepali: '',
            description_english: '',
            description_nepali: '',
          },
        ]
  );

  // Collapsible state for add mode
  const [showHidden, setShowHidden] = useState<boolean[]>(
    mode === 'add' ? (formData as StudyNote[]).map(() => true) : []
  );

  const toggleHidden = (index: number) => {
    setShowHidden(prev => {
      const copy = [...prev];
      copy[index] = !copy[index];
      return copy;
    });
  };

  // Handle changes
  const handleChange = (
    indexOrField: number | keyof StudyNote,
    fieldOrValue: keyof StudyNote | string | number,
    value?: string | number
  ) => {
    if (mode === 'edit') {
      const field = indexOrField as keyof StudyNote;
      setFormData(prev => ({ ...(prev as StudyNote), [field]: fieldOrValue }));
    } else {
      const index = indexOrField as number;
      const field = fieldOrValue as keyof StudyNote;
      setFormData(prev => {
        const updated = [...(prev as StudyNote[])];
        updated[index] = { ...updated[index], [field]: value };
        return updated;
      });
    }
  };

  // Add/remove notes in add mode
  const addNote = () => {
    if (mode === 'add') {
      setFormData(prev => [
        ...(prev as StudyNote[]),
        { chapter_number: 0, content_name_english: '', content_name_nepali: '', description_english: '', description_nepali: '' },
      ]);
      setShowHidden(prev => [...prev, true]);
    }
  };

  const removeNote = (index: number) => {
    setFormData(prev => (prev as StudyNote[]).filter((_, i) => i !== index));
    setShowHidden(prev => prev.filter((_, i) => i !== index));
  };

  // Submit handler
  const handleSubmit = useCallback(async () => {
    if (mode === 'edit') {
      const note = formData as StudyNote;
      if (!note.chapter_number || !note.content_name_english || !note.description_english) {
        toast.error('Please fill chapter number, content name, and description');
        return;
      }

      try {
        await partialUpdateTOC(tocid,{ ...note });
        toast.success('Note updated successfully!');
      } catch {
        toast.error('Failed to update note');
      }
    } else {
      const notes = formData as StudyNote[];
      for (const note of notes) {
        if (!note.chapter_number || !note.content_name_english || !note.description_english) {
          toast.error('Please fill all required fields for all notes');
          return;
        }
      }

      try {
        await createTOC(notes.map(note => ({ ...note, subject_id: Number(subjectId) })));
        toast.success('Notes created successfully!');
      } catch {
        toast.error('Failed to create notes');
      }
    }
  }, [formData, mode, subjectId]);

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      {/* Edit Mode */}
      {mode === 'edit' ? (
        <SingleNoteForm note={formData as StudyNote} handleChange={handleChange} />
      ) : (
        // Add Mode
        (formData as StudyNote[]).map((note, index) => (
          <div key={index} className="border rounded-xl bg-white shadow-sm overflow-hidden">
            {/* Header */}
            <div
              className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleHidden(index)}
            >
              <div className="flex items-center gap-4">
                <div className="font-bold text-lg">{index + 1}.</div>
                <div>
                  <div className="font-medium">{note.content_name_english || 'New Note'}</div>
                  <div className="text-sm text-gray-500">
                    {note.chapter_number || 'Add chapter number'}
                  </div>
                </div>
              </div>
              {showHidden[index] ? <ChevronUp /> : <ChevronDown />}
            </div>

            {/* Collapsible content */}
            {showHidden[index] && (
              <div className="p-4 space-y-4">
                <NoteForm
                  note={note}
                  handleChange={(field, value) => handleChange(index, field, value)}
                />
                <div className="flex justify-end">
                  <Button variant="destructive" size="sm" onClick={() => removeNote(index)} className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4" /> Remove
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))
      )}

      {/* Add Note button */}
      {mode === 'add' && (
        <div className="flex justify-end gap-4">
          <Button onClick={addNote} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4" /> Add Note
          </Button>
        </div>
      )}

      {/* Submit */}
      <div className="flex justify-end mt-4">
        <Button onClick={handleSubmit}>{mode === 'edit' ? 'Update' : 'Save All'}</Button>
      </div>
    </div>
  );
}

// Form for a single note
const NoteForm = ({
  note,
  handleChange,
}: {
  note: StudyNote;
  handleChange: (field: keyof StudyNote, value: string | number) => void;
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <Label>Chapter Number</Label>
      <Input type="number" value={note.chapter_number} onChange={e => handleChange('chapter_number', Number(e.target.value))} />
    </div>
    <div>
      <Label>Content Name (English)</Label>
      <Input value={note.content_name_english} onChange={e => handleChange('content_name_english', e.target.value)} />
    </div>
    <div>
      <Label>Content Name (Nepali)</Label>
      <Input value={note.content_name_nepali} onChange={e => handleChange('content_name_nepali', e.target.value)} />
    </div>
    <div className="md:col-span-2">
      <Label>Description (English)</Label>
      <TextEditor content={note.description_english} setContent={value => handleChange('description_english', value)} id="desc-en" label="Description English" />
      <Label className="mt-2">Description (Nepali)</Label>
      <TextEditor content={note.description_nepali} setContent={value => handleChange('description_nepali', value)} id="desc-ne" label="Description Nepali" />
    </div>
  </div>
);

// Wrapper for edit mode
const SingleNoteForm = ({
  note,
  handleChange,
}: {
  note: StudyNote;
  handleChange: (field: keyof StudyNote, value: string | number) => void;
}) => <NoteForm note={note} handleChange={handleChange} />;
