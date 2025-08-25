'use client';
import { Input } from '@/components/ui/input';
import Texteditor from './TextEditor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface MetadataFormProps {
  Metadescription: string;
  setMetadescription: (content: string) => void;
  year: string;
  setYear: (year: string) => void;
}

export default function MetadataForm({
  Metadescription,
  setMetadescription,
  year,
  setYear,
}: MetadataFormProps) {
  // Get current Nepali year dynamically
  const today = new Date();
  const currentNepaliYear = today.getMonth() + 1 < 4 ? today.getFullYear() + 56 : today.getFullYear() + 57;

  // Generate Nepali years starting from 2070 up to current year
  const nepaliYears: number[] = Array.from({ length: currentNepaliYear - 2070 + 1 }, (_, i) => 2070 + i);

  return (
    <div className="space-y-4">
      <Texteditor
        label=""
        id="metadescription"
        content={Metadescription}
        setContent={(content) => setMetadescription(content)}
      />

      {/* Nepali Year Dropdown */}
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-700 mb-1">Year (Nepali)</span>
        <Select value={year} onValueChange={(e) => setYear(e)}>
          <SelectTrigger className="w-40 bg-white border-gray-200 rounded-md px-3 py-2">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {nepaliYears.map((yr) => (
              <SelectItem key={yr} value={yr.toString()}>
                {yr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
