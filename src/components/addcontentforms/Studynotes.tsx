'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { createTOC, partialUpdateTOC } from '@/services/notes';
import LoadingOverlay from '../Loading/LoadingOverlay';

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
  tocid?: number;
  initialData?: StudyNote;
  mode?: 'add' | 'edit';
}

export default function StudyNotes({
  subjectId,
  initialData,
  tocid,
  mode = 'add',
}: StudyNotesProps) {
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

  const [showHidden, setShowHidden] = useState<boolean[]>(
    mode === 'add' ? (formData as StudyNote[]).map(() => true) : []
  );

const [submitting, setSubmitting] = useState<'idle' | 'loading' | 'success'>('idle');

  const toggleHidden = (index: number) => {
    setShowHidden(prev => {
      const copy = [...prev];
      copy[index] = !copy[index];
      return copy;
    });
  };

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

  const handleSubmit = useCallback(async () => {
    if (mode === 'edit') {
      const note = formData as StudyNote;
      if (!note.chapter_number || !note.content_name_english || !note.description_english) {
        toast.error('Please fill chapter number, content name, and description');
        return;
      }
      
      try {
         setSubmitting('loading');
          //@ts-ignore
        await partialUpdateTOC(tocid, { ...note });
        toast.success('Note updated successfully!');


          // Show success overlay
      setSubmitting('success');
      setTimeout(() => {
        setSubmitting('idle');
      }, 2000);
      } catch {
        toast.error('Failed to update note');
        setSubmitting('idle');

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
            setSubmitting('loading');


        await createTOC(notes.map(note => ({ ...note, subject_id: Number(subjectId) })));
        toast.success('Notes created successfully!');

            // Show success overlay
      setSubmitting('success');
      setTimeout(() => {
        setSubmitting('idle');
      }, 2000);
      } catch {
        toast.error('Failed to create notes');
        setSubmitting('idle');

      }
    }
  }, [formData, mode, subjectId, tocid]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {(mode === 'edit' ? [formData as StudyNote] : formData as StudyNote[]).map((note, index) => (
        <div
          key={index}
          className="border rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200 bg-white"
        >
          {/* Accordion Header */}
          <div
            className="flex justify-between items-center px-6 py-4 cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors"
            onClick={() => toggleHidden(index)}
          >
            <div className="flex items-center gap-4">
              <div className="font-bold text-lg">{mode === 'add' ? index + 1 : 'Note'}</div>
              <div>
                <div className="font-medium text-gray-800">
                  {note.content_name_english || 'New Note'}
                </div>
                <div className="text-sm text-gray-500">
                  Chapter: {note.chapter_number || '-'}
                </div>
              </div>
            </div>
            {showHidden[index] ? <ChevronUp /> : <ChevronDown />}
          </div>

          {/* Accordion Body */}
          {showHidden[index] && (
            <div className="p-6 space-y-4 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className='mb-4'>Chapter Number</Label>
                  <Input type="number" value={note.chapter_number} onChange={e => handleChange(index, 'chapter_number', Number(e.target.value))} />
                </div>
                <div>
                  <Label className='mb-4'>Content Name (English)</Label>
                  <Input value={note.content_name_english} onChange={e => handleChange(index, 'content_name_english', e.target.value)} />
                </div>
                <div>
                  <Label className='mb-4'>Content Name (Nepali)</Label>
                  <Input value={note.content_name_nepali} onChange={e => handleChange(index, 'content_name_nepali', e.target.value)} />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label className='mb-4'>Description (English)</Label>
                  <Textarea value={note.description_english} onChange={e => handleChange(index, 'description_english', e.target.value)} rows={4} />
                  <Label className='mb-4'>Description (Nepali)</Label>
                  <Textarea value={note.description_nepali} onChange={e => handleChange(index, 'description_nepali', e.target.value)} rows={4} />
                </div>
              </div>

              <div className="flex justify-end">
                {mode === 'add' && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => removeNote(index)}
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      {mode === 'add' && (
        <div className="flex justify-end gap-4 mt-4">
          <Button
            onClick={addNote}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4" /> Add Note
          </Button>
        </div>
      )}

      <div className="flex justify-end mt-6">
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl" onClick={handleSubmit}>
          {mode === 'edit' ? 'Update Note' : 'Save All Notes'}
        </Button>
      </div>


       {submitting !== 'idle' && (
        <LoadingOverlay submitting={submitting} mode={mode} />
      )}
    </div>
  );
}
