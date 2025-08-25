"use client";

export default function ProvinceFilter({
  value,
  onChange,
}: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-end">
      <select
        className="border rounded px-3 py-1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="all">All Provinces</option>
        <option value="Province 1">Province 1</option>
        <option value="Province 2">Province 2</option>
        <option value="Bagmati">Bagmati</option>
        <option value="Gandaki">Gandaki</option>
        <option value="Lumbini">Lumbini</option>
        <option value="Karnali">Karnali</option>
        <option value="Sudurpashchim">Sudurpashchim</option>
      </select>
    </div>
  );
}
