"use client"

import { useState } from "react"
import { BookOpen, Calculator, Microscope, Globe, Plus, ClipboardCheck, X } from "lucide-react"
import useSWR from "swr"

import AddSubjectForm from "../addsubject/Addsuject"
import AnalyticsCard from "../addcontentforms/Analyticsubject"
import SubjectCard from "../addsubject/Subjectcard"
import { Button } from "@/components/ui/button"
import { getAllSubjects } from "@/services/subjects"
import { getDashboadAnalytics, getEachSubjectAnalytics } from "@/services/dashboard"

interface SubjectAnalytics {
  subject_id: number | string
  subject_name: string
  total_10_sets: number
  total_model_papers: number
  total_model_questions: number
  total_notes: number
  total_questions: number
}

export default function Dashboard({
  classid,
  classname,
}: {
  classid: number
  classname: string
}) {
  const [showAddSubject, setShowAddSubject] = useState(false)

  // Fetch subjects
  const { data: classdata, mutate, isLoading } = useSWR("/subjects", () =>
    getAllSubjects()
  )

  // Fetch analytics
  const { data: subjectanalytics, mutate: subjectmutate, isLoading: isAnalyticsLoading } = useSWR<SubjectAnalytics[]>("/subjects-analytics", getEachSubjectAnalytics)
  const { data:dashboardanalytics , mutate: dashboardmutate, isLoading: isdashboardLoading } = useSWR<DashboardAnalytics>("/dashboard-analytics", getDashboadAnalytics)

  const handleAddSuccess = () => {
    mutate()
    subjectmutate()
    setShowAddSubject(false)
  }

  // Compute totals for AnalyticsCard
  const totalSubjects = dashboardanalytics?.total_subjects || 0
  const totalQuestions = dashboardanalytics?.total_questions || 0
  const totalModelSets = dashboardanalytics?.total_model_papers|| 0
  const totalNotes = dashboardanalytics?.total_notes || 0
  const total10set = dashboardanalytics?.total_10_sets || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <h1 className="text-4xl font-extrabold text-gray-800">Dashboard</h1>
        <Button
          onClick={() => setShowAddSubject(true)}
          className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 shadow-md"
        >
          <Plus className="h-5 w-5" /> Add Subject
        </Button>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-6 mb-10">
        <AnalyticsCard title="Total Subjects" value={totalSubjects} icon={BookOpen} colorFrom="from-blue-500" colorTo="to-blue-600" />
        <AnalyticsCard title="Total Questions" value={totalQuestions} icon={Calculator} colorFrom="from-green-500" colorTo="to-green-600" />
        <AnalyticsCard title="Model Sets" value={totalModelSets} icon={Microscope} colorFrom="from-purple-500" colorTo="to-purple-600" />
        <AnalyticsCard title="Study Notes" value={totalNotes} icon={Globe} colorFrom="from-orange-500" colorTo="to-orange-600" />
        <AnalyticsCard
  title="10 Set Questions"
  value={total10set}
  icon={ClipboardCheck}
  colorFrom="from-teal-500"
  colorTo="to-teal-600"
/>
      </div>

      {/* Subjects Grid */}
      {classdata && classdata.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {classdata.map((subject:any) => {
            // Find the analytics object for this subject
            const analyticsForSubject = subjectanalytics?.find(a => a.subject_id === subject.id)
            return (
              <SubjectCard
                key={subject.id}
                subject={subject}
                classname={classname}
                classid={classid}
                subjectanalytics={analyticsForSubject}
              />
            )
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-20">
          {isLoading || isAnalyticsLoading ? "Loading subjects..." : "No subjects found for this class."}
        </p>
      )}

      {/* Add Subject Modal */}
  {showAddSubject && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="relative w-full max-w-lg p-6 bg-white rounded-2xl shadow-2xl animate-fadeIn">
      {/* Close Button */}
      <button
        onClick={() => setShowAddSubject(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
      >
        <X/>
      </button>

      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Add New Subject</h2>
        <p className="text-gray-500 text-sm mt-1">
          Quickly create and manage subjects for this class.
        </p>
      </div>

      {/* Form */}
      <AddSubjectForm
        classId={classid}
        onSuccess={handleAddSuccess}
      />
    </div>
  </div>
)}

    </div>
  )
}
