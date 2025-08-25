"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { createClass } from "@/services/classes"
import { toast } from "sonner"

// ✅ Zod schema
const nameSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Class name is required." })
    .max(20, { message: "Name cannot exceed 20 characters." })
    .regex(/^class\s\d+$/, {
      message: 'Class name must start with "class" followed by a number (e.g., class 1)',
    }),
})

type NameFormValues = z.infer<typeof nameSchema>

interface AddClassProps {
  onSuccess?: () => void // ✅ Add callback for parent
}

export default function AddClass({ onSuccess }: AddClassProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<NameFormValues>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: "" },
  })

  const handleSubmit = async (values: NameFormValues) => {
    setIsLoading(true)
    try {
      await createClass(values)
      toast.success("Successfully added class ✅")
      form.reset()
      
      // ✅ Trigger parent to refresh the data
      if (onSuccess) onSuccess()
    } catch (error: any) {
      toast.error("Failed to add class ❌")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto mt-10 p-8 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Add New Class
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Class Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Class 1"
                    maxLength={20}
                    className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition duration-200"
                  />
                </FormControl>
                <FormMessage className="text-red-500 mt-1 text-sm" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-transform hover:scale-[1.02]"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
