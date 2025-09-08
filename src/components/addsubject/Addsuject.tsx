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
import { Book, Loader2 } from "lucide-react"

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
   const class_level = classId;
    try {
      setLoading(true)
      await createSubject({name, class_level})
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
   <div className="w-full p-6">
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      {/* Subject Name */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>

            <FormLabel className="text-gray-700 font-medium text-md mb-2">
              <Book className="h-6 w-6 text-blue-500"  />
              
              Subject Name</FormLabel>
            <FormControl>
              <Input
                placeholder="Physics"
                className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Submit Button with Spinner */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Adding...
          </>
        ) : (
          "Add Subject"
        )}
      </Button>
    </form>
  </Form>
</div>

  )
}
