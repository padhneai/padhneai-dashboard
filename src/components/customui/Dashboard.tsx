
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { subjects } from "@/lib/constant";
import { BookOpen, Calculator, Microscope, Globe } from "lucide-react";





export default function Dashboard({classid}:{classid:string}) {
  console.log(classid)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
     

      {/* Main Content */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Subjects</p>
                  <p className="text-3xl font-bold">{subjects.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Questions</p>
                  <p className="text-3xl font-bold">{subjects.reduce((acc, subj) => acc + subj.totalQuestions, 0)}</p>
                </div>
                <Calculator className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Model Sets</p>
                  <p className="text-3xl font-bold">{subjects.reduce((acc, subj) => acc + subj.modelSets, 0)}</p>
                </div>
                <Microscope className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Study Notes</p>
                  <p className="text-3xl font-bold">{subjects.reduce((acc, subj) => acc + subj.notes, 0)}</p>
                </div>
                <Globe className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {subjects.map((subject) => {
            const IconComponent = subject.icon;
            return (
                <Card key={subject.id} className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border-0 shadow-md bg-white">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-3 rounded-lg ${subject.color}`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                        {subject.totalQuestions} questions
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {subject.name}
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-sm">
                      {subject.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Model Sets</span>
                        <span className="font-semibold text-gray-900">{subject.modelSets}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Practice Sets</span>
                        <span className="font-semibold text-gray-900">{subject.practiceSets}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Question Banks</span>
                        <span className="font-semibold text-gray-900">{subject.questionBanks}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Study Notes</span>
                        <span className="font-semibold text-gray-900">{subject.notes}</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
              <Link  href={`/${classid}/${subject.id}`}>

                      <Button variant="outline" className="w-full group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-blue-700 transition-all">
                        Manage Content
                      </Button>
              </Link>
                    </div>
                  </CardContent>
                </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}