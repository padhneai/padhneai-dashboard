"use client";

import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, FileText, Trash2, BookOpen, Eye, Edit } from "lucide-react";
import Link from "next/link";
import { deletePaper } from "@/services/paper";
import { toast } from "sonner";
import AlertDialogbox from "./AlertDiologbox";

import { contentCategories } from "@/lib/constant";





export default function SubjectPage({subjectId,classno,data}:{subjectId:string,classno:string,data:Paper[]}) {
  const [activeTab, setActiveTab] = useState("model-sets");
  const [papers, setPapers] = useState<Paper[]>(data);
  const cl = classno.split("_")[1]
  // Memoize category mapping to prevent recreation on every render
  const categoryMap = useMemo(() => ({
    'model-sets': 'Model Question',
    'question-banks': '10 Set',
    'notes': 'Notes',
    'past-papers': 'Past Papers'
  }), []);

  // Delete handler with confirmation
  const handleDelete = useCallback(async (paperId: number) => {
    try {
      await deletePaper(paperId);
      setPapers(prevPapers => prevPapers.filter(paper => paper.id !== paperId));
      toast.success('Paper deleted successfully!', {
        duration: 3000,
        richColors: true,
      });
    } catch (error) {
      console.error('Error deleting paper:', error);
      toast.error('Failed to delete paper', {
        duration: 3000,
        richColors: true,
      });
    }
  }, []);

  // Memoize filtered papers for each category to prevent expensive filtering on every render
  const categorizedPapers = useMemo(() => {
    if (!papers || papers.length === 0) return {};
    
    const result: Record<string, Paper[]> = {};
    
    contentCategories.forEach(category => {
      result[category.id] = papers.filter(paper => 
        paper.question_type === categoryMap[category.id] &&
        paper.subject === subjectId &&
        paper.class_name === cl
      );
    });
    
    return result;
  }, [papers, subjectId, cl, categoryMap]);

  if (!subjectId) {
    return <div>Subject not found</div>;
  }

  // Check if data is empty or not available
  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b shadow-sm">
          <div className="mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <Link href={`/${classno}`}>
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <div className="border-l pl-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{subjectId}</h1>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                          Class {cl}
                        </Badge>
                        <span className="text-sm text-gray-500">No content yet</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Quick Add
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-lg font-medium text-gray-900 mb-2">No Content Yet</h2>
            <p className="text-gray-600 mb-6">Start by adding your first content to this subject.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {contentCategories.map((category) => (
                <Link key={category.id} href={`/${classno}/${subjectId}/add-content?type=${category.id}`}>
                  <Button variant="outline" size="sm">
                    <category.icon className="w-4 h-4 mr-2" />
                    Add {category.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }




  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white ">
        <div className="mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link href={`/${classno}`}>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  back
                </Button>
              </Link>
              <div className="border-l pl-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{subjectId.toUpperCase()}</h1>
                  
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 pr-6 ">
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                        Class {cl}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {papers.length} {papers.length === 1 ? 'item' : 'items'}
                      </span>
                    </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-white rounded-lg border">
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

          {contentCategories.map((category) => {
            const filteredPapers = categorizedPapers[category.id] || [];

            return (
              <TabsContent key={category.id} value={category.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">{category.name}</h2>
                  <Link href={category.id === 'notes' ? `/${classno}/${subjectId}/add-studynote` : `/${classno}/${subjectId}/add-content?type=${category.id}`}>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add {category.name}
                    </Button>
                  </Link>
                </div>

                {/* Content Cards */}
                {filteredPapers.length > 0 ? (
                  <div className="grid gap-4">
                    {filteredPapers.map((paper) => (
                      <Card key={paper.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">{paper.subject}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs">{paper.year}</Badge>
                                <Badge variant="outline" className="text-xs">{paper.province}</Badge>
                                <span className="text-xs text-gray-500">{paper.question_type}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Link href={category.id === 'notes' ? `/${classno}/${subjectId}/view-studynote?id=${paper.id}` : `/${classno}/${subjectId}/view-questions?id=${paper.id}`}>
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Link href={category.id === 'notes' ? `/${classno}/${subjectId}/edit-studynote?id=${paper.id}` : `/${classno}/${subjectId}/edit-questions?id=${paper.id}`}>
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </Link>
                              <AlertDialogbox
                                trigger={
                                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                }
                                title="Delete Content"
                                description={`Delete "${paper.subject} - ${paper.question_type} (${paper.year})"?`}
                                actionText="Delete"
                                cancelText="Cancel"
                                variant="destructive"
                                onAction={() => handleDelete(paper.id!)}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <category.icon className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                    <h3 className="text-sm font-medium text-gray-900 mb-1">No {category.name.toLowerCase()} yet</h3>
                    <p className="text-sm text-gray-500 mb-4">Create your first {category.name.toLowerCase()}.</p>
                    <Link href={category.id === 'notes' ? `/${classno}/${subjectId}/add-studynote` : `/${classno}/${subjectId}/add-content?type=${category.id}`}>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add {category.name}
                      </Button>
                    </Link>
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}