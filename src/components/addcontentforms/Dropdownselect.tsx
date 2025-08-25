"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface OptionItem {
  id: number
  name: string
}

interface DropdownProps {
  data: OptionItem[]
  placeholder?: string
  value?: string | number
  onChange: (value: string) => void
}

const Dropdownselect: React.FC<DropdownProps> = ({
  data,
  placeholder = "Select...",
  value,
  onChange,
}) => {
  return (
    <Select onValueChange={onChange} value={value?.toString()}>
      <SelectTrigger
        className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200 text-gray-700 font-medium"
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent
        className="bg-white rounded-xl shadow-lg border border-gray-200 py-1"
      >
        {data.map((item) => (
          <SelectItem
            key={item.id}
            value={item.id.toString()}
            className="hover:bg-blue-100 cursor-pointer rounded-lg transition-colors duration-150 px-4 py-2"
          >
            {item.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default Dropdownselect
