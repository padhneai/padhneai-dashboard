'use client';
import { Input } from '@/components/ui/input';
import Texteditor from './TextEditor';




export default function MetadataForm({

    Metadescription,
setMetadescription,
  year,
  setYear,

 
}: MetadataFormProps) {
  return (
    <div className="space-y-2">
       <Texteditor
       id="metadescription"
  content={Metadescription}
  setContent={(content) => setMetadescription(content)}
/>
      <Input placeholder="Year" type='date' value={year} onChange={(e) => setYear(e.target.value)} />
 
    </div>
  );
}
