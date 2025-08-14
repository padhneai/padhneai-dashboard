"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Clock, Award, CheckCircle, AlertCircle, FileText, BookOpen } from "lucide-react";
import Link from "next/link";

import { contentCategories, subjectData, subjects } from "@/lib/constant";





export default function SubjectPage({subjectId,classno}:{subjectId:string,classno:string}) {
 

  const [activeTab, setActiveTab] = useState("model-sets");

  if (!subjectId) {
    return <div>Subject not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
           
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{subjectId}</h1>
                <p className="text-gray-600 mt-1">{subjectId}</p>
              </div>
           
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Class 10
              </Badge>
            
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white rounded-lg shadow-sm border p-1">
            {contentCategories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                <category.icon className="w-4 h-4 mr-2" />
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {contentCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">{category.name}</h2>
                  <p className="text-gray-600 mt-1">{category.description}</p>
                </div>
               <Link href={`/subject/${classno}_${subjectId}/add-content?type=${category.id}`}>

                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add {category.name}
                  </Button>
                </Link>
              </div>

              {/* Empty State */}
              <div className="text-center py-12">
                <category.icon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No {category.name.toLowerCase()} yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating your first {category.name.toLowerCase()}.</p>
                <div className="mt-6">
                  <Link href={`/subject/${classno}_${subjectId}/add-content?type=${category.id}`}>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add {category.name}
                    </Button>
                  </Link>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}