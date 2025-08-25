'use client';
import { Input } from '@/components/ui/input';
import Texteditor from './TextEditor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';




export default function MetadataForm({

    Metadescription,
setMetadescription,
  year,
  setYear,

 
}: MetadataFormProps) {
      const years: number[] = Array.from({ length: 3079 - 2070 + 1 }, (_, i) => 2070 + i);

  return (
    <div className="space-y-2">
       <Texteditor
       label=''
       id="metadescription"
  content={Metadescription}
  setContent={(content) => setMetadescription(content)}
/>
      <Input placeholder="Year" type='date' value={year} onChange={(e) => setYear(e.target.value)} />

          {/* <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Subject</span>
          <Select value={year} onValueChange={(e) => setYear(e)}>
            <SelectTrigger className="w-40 bg-white border-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className='bg-white'>
              <SelectItem value="all">All</SelectItem>
              {years.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div> */}
 
    </div>
  );
}
