'use client';

import { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TextEditor from './TextEditor';
import { Badge } from '@/components/ui/badge';
import { Upload, X, FileText, Image as ImageIcon, Save, Plus, BookOpen, Tag, Camera, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { contentSections } from '@/lib/constant';

const NOTE_CATEGORIES = {
  secondary: ['Theory', 'Formulas', 'Problem Solving', 'Case Studies', 'Exam Tips', 'Quick Reference'],
  higherSecondary: ['Advanced Theory', 'Derivations', 'Problem Solving', 'Applications', 'Research Topics', 'Exam Strategy']
} as const;

interface ImageData {
  id: number;
  name: string;
  url: string;
  size: number;
}

interface StudyNote {
  chapter: string;
  topic: string;
  category: string;
  content: string;
  tags: string[];
  images: ImageData[];
}

interface StudyNotesData {
  notes: StudyNote[];
}

interface StudyNotesProps {
  subjectId: string;
  classno: string;
  initialData?: StudyNotesData;
  mode?: 'add' | 'edit';
}

export default function StudyNotes({ subjectId, classno, initialData, mode = 'add' }: StudyNotesProps) {
  const [formData, setFormData] = useState<StudyNotesData>({
    notes: initialData?.notes || [
      {
        chapter: '',
        topic: '',
        category: '',
        content: '',
        tags: [],
        images: []
      }
    ]
  });

  const [newTags, setNewTags] = useState<string[][]>(formData.notes.map(() => []));

  // ---- Handlers ----
  const handleNoteChange = useCallback((index: number, field: keyof StudyNote, value: string) => {
    setFormData(prev => {
      const notes = [...prev.notes];
      notes[index] = { ...notes[index], [field]: value };
      return { ...prev, notes };
    });
  }, []);

  const addNote = useCallback(() => {
    const newNote: StudyNote = {
      chapter: '',
      topic: '',
      category: '',
      content: '',
      tags: [],
      images: []
    };
    setFormData(prev => ({
      ...prev,
      notes: [...prev.notes, newNote]
    }));
    setNewTags(prev => [...prev, []]);
  }, []);

  const handleTagChange = useCallback((index: number, value: string) => {
    setNewTags(prev => {
      const copy = [...prev];
      copy[index] = [value];
      return copy;
    });
  }, []);

  const addTag = useCallback((noteIndex: number) => {
    const tag = newTags[noteIndex]?.[0]?.trim();
    if (!tag) return;
    setFormData(prev => {
      const notes = [...prev.notes];
      if (!notes[noteIndex].tags.includes(tag)) {
        notes[noteIndex] = {
          ...notes[noteIndex],
          tags: [...notes[noteIndex].tags, tag]
        };
      }
      return { ...prev, notes };
    });
    setNewTags(prev => {
      const copy = [...prev];
      copy[noteIndex] = [''];
      return copy;
    });
  }, [newTags]);

  const removeTag = useCallback((noteIndex: number, tag: string) => {
    setFormData(prev => {
      const notes = [...prev.notes];
      notes[noteIndex] = {
        ...notes[noteIndex],
        tags: notes[noteIndex].tags.filter(t => t !== tag)
      };
      return { ...prev, notes };
    });
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>, noteIndex: number) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData: ImageData = {
          id: Date.now() + Math.random(),
          name: file.name,
          url: reader.result as string,
          size: file.size
        };
        setFormData(prev => {
          const notes = [...prev.notes];
          notes[noteIndex] = {
            ...notes[noteIndex],
            images: [...notes[noteIndex].images, imageData]
          };
          return { ...prev, notes };
        });
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const removeImage = useCallback((noteIndex: number, imageId: number) => {
    setFormData(prev => {
      const notes = [...prev.notes];
      notes[noteIndex] = {
        ...notes[noteIndex],
        images: notes[noteIndex].images.filter(img => img.id !== imageId)
      };
      return { ...prev, notes };
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    for (const note of formData.notes) {
      if (!note.chapter || !note.content) {
        toast.error('Please fill in chapter and content for all notes');
        return;
      }
    }
    try {
      console.log('Saving Notes for', subjectId, classno, formData.notes);
      toast.success(`Successfully ${mode === 'edit' ? 'updated' : 'created'} notes!`);
    } catch (err) {
      toast.error('Failed to save notes');
    }
  }, [formData.notes, subjectId, classno, mode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {mode === 'edit' ? 'Edit' : 'Create'} Study Notes
                </h1>
                <div className="flex items-center gap-4 text-sm">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                    Class {classno}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                    {subjectId}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Total Notes</p>
              <p className="text-2xl font-bold text-blue-600">{formData.notes.length}</p>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="space-y-8">
          {formData.notes.map((note, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              {/* Note Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {note.chapter || `Note ${index + 1}`}
                      </h3>
                      <p className="text-blue-100 text-sm">
                        {note.topic || 'Add topic to organize better'}
                      </p>
                    </div>
                  </div>
                  {index === formData.notes.length - 1 && (
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={addNote}
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Note
                    </Button>
                  )}
                </div>
              </div>
              {/* Note Content */}
              <div className="p-8 space-y-8">
                {/* Basic Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Chapter *
                    </Label>
                    <Input
                      value={note.chapter}
                      onChange={e => handleNoteChange(index, 'chapter', e.target.value)}
                      placeholder="e.g., Algebra Basics"
                      className="border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      Topic
                    </Label>
                    <Input
                      value={note.topic}
                      onChange={e => handleNoteChange(index, 'topic', e.target.value)}
                      placeholder="e.g., Linear Equations"
                      className="border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      Category
                    </Label>
                    <Select
                      value={note.category}
                      onValueChange={value => handleNoteChange(index, 'category', value)}
                    >
                      <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3">
                        <SelectValue placeholder="Choose category" />
                      </SelectTrigger>
                      <SelectContent>
                        {NOTE_CATEGORIES.secondary.map(cat => (
                          <SelectItem key={cat} value={cat} className="py-3">{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {/* Content Editor */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Content *
                  </Label>
                  <div className="border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-blue-500">
                    <TextEditor
                      content={note.content}
                      setContent={value => handleNoteChange(index, 'content', value)}
                      id={`editor-${index}`}
                      label="Content"
                      placeholder="Write your study notes here... Include key concepts, formulas, examples, and explanations."
                    />
                  </div>
                </div>

                {/* Tags Section */}
                <div className="space-y-4">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Tags
                  </Label>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                    <div className="flex gap-3">
                      <Input
                        value={newTags[index]?.[0] || ''}
                        onChange={e => handleTagChange(index, e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && addTag(index)}
                        placeholder="Type a tag and press Enter"
                        className="flex-1 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                      />
                      <Button 
                        size="sm" 
                        onClick={() => addTag(index)}
                        className="px-6 bg-blue-600 hover:bg-blue-700 rounded-lg"
                      >
                        Add
                      </Button>
                    </div>
                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {note.tags.map(tag => (
                          <Badge 
                            key={tag} 
                            variant="secondary" 
                            className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                          >
                            {tag}
                            <X 
                              className="w-3 h-3 cursor-pointer hover:text-red-600" 
                              onClick={() => removeTag(index, tag)} 
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                    {note.tags.length === 0 && (
                      <p className="text-gray-500 text-sm italic">No tags added yet. Tags help organize and search your notes.</p>
                    )}
                  </div>
                </div>

                {/* Images Section */}
                <div className="space-y-4">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Images & Diagrams
                  </Label>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      className="hidden" 
                      id={`image-upload-${index}`} 
                      onChange={e => handleImageUpload(e, index)} 
                    />
                    <label 
                      htmlFor={`image-upload-${index}`} 
                      className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
                    >
                      <Upload className="w-12 h-12 text-gray-400 mb-4" />
                      <p className="text-lg font-medium text-gray-700 mb-2">Upload Images</p>
                      <p className="text-sm text-gray-500 text-center">
                        Drag & drop images here or click to browse<br/>
                        <span className="text-xs">PNG, JPG, GIF up to 5MB each</span>
                      </p>
                    </label>
                    
                    {note.images.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">
                          Uploaded Images ({note.images.length})
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {note.images.map(img => (
                            <div key={img.id} className="relative group bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
                              <img 
                                src={img.url} 
                                alt={img.name} 
                                className="w-full h-32 object-cover" 
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                                <button 
                                  onClick={() => removeImage(index, img.id)} 
                                  className="bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-200 hover:bg-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="p-2">
                                <p className="text-xs text-gray-600 truncate" title={img.name}>
                                  {img.name}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {(img.size / 1024).toFixed(1)} KB
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Action Buttons */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="text-sm text-gray-600">
                <p className="font-medium">Ready to save?</p>
                <p>Make sure all required fields are filled out.</p>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="px-6 py-3 rounded-xl border-2 border-gray-300 hover:border-gray-400"
                >
                  Save as Draft
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl flex items-center gap-2 text-white font-semibold shadow-lg"
                >
                  <Save className="w-5 h-5" /> 
                  {mode === 'edit' ? 'Update Notes' : 'Publish Notes'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
