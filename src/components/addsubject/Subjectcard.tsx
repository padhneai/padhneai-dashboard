"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LucideIcon } from "lucide-react"



interface SubjectCardProps {
  subject: {
    id: string | number
    name: string
    description?: string
    icon?: LucideIcon
    color?: string
  }
  classname: string
  classid: number
  subjectanalytics?: SubjectAnalytics
}

export default function SubjectCard({ subject, classname, classid, subjectanalytics }: SubjectCardProps) {
  const IconComponent = subject.icon

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border-0 shadow-md bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-3">
          {IconComponent && (
            <div className={`p-3 rounded-lg ${subject.color ?? "bg-gray-400"}`}>
              <IconComponent className="h-6 w-6 text-white" />
            </div>
          )}
          {subjectanalytics && (
            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
              {subjectanalytics.total_questions} questions
            </Badge>
          )}
        </div>
        <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {subject.name}
        </CardTitle>
        {subject.description && (
          <CardDescription className="text-gray-600 text-sm">{subject.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {subjectanalytics && (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Model Sets</span>
              <span className="font-semibold text-gray-900">{subjectanalytics.total_model_papers}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Ten Sets Question</span>
              <span className="font-semibold text-gray-900">{subjectanalytics.total_10_sets}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Study Notes</span>
              <span className="font-semibold text-gray-900">{subjectanalytics.total_notes}</span>
            </div>
          </div>
        )}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link href={`/${classname}_${classid}/${subject.name}_${subject.id}`}>
            <Button
              variant="outline"
              className="w-full group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-blue-700 transition-all"
            >
              Manage Content
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
