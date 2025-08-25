"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { createSubject } from "@/services/subjects"

// ✅ Zod schema
const subjectSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).max(50, { message: "Max 50 characters" }),
  
})

type SubjectFormValues = z.infer<typeof subjectSchema>



interface AddSubjectFormProps {
  classId?: number;
  onSuccess:()=>void;
}


export default function AddSubjectForm({ classId,onSuccess }: AddSubjectFormProps) {
  const [loading, setLoading] = useState(false)

  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues: { name: ""},
  })

  const onSubmit = async (values: SubjectFormValues) => {
   const {name}= values;
   const class_level_id = classId;
    try {
      setLoading(true)
      await createSubject({name, class_level_id})
      toast.success("Subject added successfully ✅")
      // Reset the form (keep class_id if provided)
      form.reset({ name: "" })
      if (onSuccess) onSuccess()
    } catch (error) {
      toast.error("Failed to add subject ❌")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Subject</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Subject Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject Name</FormLabel>
                <FormControl>
                  <Input placeholder="Physics" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-transform hover:scale-[1.02]"
          >
            {loading ? "Adding..." : "Add Subject"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
