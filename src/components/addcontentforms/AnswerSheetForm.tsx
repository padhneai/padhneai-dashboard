'use client';
import { Input } from '@/components/ui/input';
import { Editor } from '@tinymce/tinymce-react';
import Image from 'next/image';
import Texteditor from './TextEditor';




export default function AnswerSheetForm({
  index,
  answersheet,
  updateAnswerSheet,
  handleImageUpload
}: AnswerSheetFormProps) {
  return (
    <div>
      <h3 className="font-semibold mt-4">Answer Sheet</h3>
      <Input
        placeholder="Answer Title"
        value={answersheet.answersheet_title}
        onChange={(e) => updateAnswerSheet(index, 'answersheet_title', e.target.value)}
      />
 
<Texteditor
id={'answer'+index.toString()}
  content={answersheet.answersheet_description}
  setContent={(content) => updateAnswerSheet(index, 'answersheet_description', content)}
/>
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files && handleImageUpload(e.target.files[0], index, 'answer')}
        />
        {answersheet.answersheet_image && (
          <Image src={answersheet.answersheet_image} alt="Preview" width={200} height={200} />
        )}
      </div>
    </div>
  );
}
