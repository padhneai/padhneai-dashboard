"use client";

import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, FileText, Trash2 } from "lucide-react";
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{subjectId}</h1>
                <p className="text-gray-600 mt-1">Class {cl}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Class {cl}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* No Data Message */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Papers Available</h2>
            <p className="text-gray-600 mb-8">There are currently no papers or data available for this subject.</p>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Get started by creating your first content:</p>
              <div className="flex flex-wrap gap-4 justify-center">
                {contentCategories.map((category) => (
                  <Link key={category.id} href={`/${classno}/${subjectId}/add-content?type=${category.id}`}>
                    <Button variant="outline" className="flex items-center gap-2">
                      <category.icon className="w-4 h-4" />
                      Add {category.name}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }




  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
           
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{subjectId.toUpperCase()}</h1>
                
              </div>
           
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Class {cl}
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

          {contentCategories.map((category) => {
            // Get pre-filtered papers for this category
            const filteredPapers = categorizedPapers[category.id] || [];

            return (
              <TabsContent key={category.id} value={category.id} className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">{category.name}</h2>
                    <p className="text-gray-600 mt-1">{category.description}</p>
                  </div>
                  <Link href={`/${classno}/${subjectId}/add-content?type=${category.id}`}>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add {category.name}
                    </Button>
                  </Link>
                </div>

                {/* Display Papers as Table */}
                {filteredPapers.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Subject</TableHead>
                          <TableHead>Year</TableHead>
                          <TableHead>Province</TableHead>
                          <TableHead>Question Type</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPapers.map((paper) => (
                          <TableRow key={paper.id}>
                            <TableCell className="font-medium">{paper.subject}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{paper.year}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {paper.province}
                              </Badge>
                            </TableCell>
                            <TableCell>{paper.question_type}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Link href={`/${classno}/${subjectId}/view-questions?id=${paper.id}`}>
                                <Button variant="outline" size="sm">
                                  View
                                </Button>
                                </Link>
                                <Link href={`/${classno}/${subjectId}/edit-questions?id=${paper.id}`}>
                                <Button variant="outline" size="sm">
                                  Edit
                                </Button>
                                </Link>
                                <AlertDialogbox
                                  trigger={
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  }
                                  title="Delete Paper"
                                  description={`Are you sure you want to delete "${paper.subject} - ${paper.question_type} (${paper.year})"? This action cannot be undone.`}
                                  actionText="Delete"
                                  cancelText="Cancel"
                                  variant="destructive"
                                  onAction={() => handleDelete(paper.id!)}
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  /* Empty State */
                  <div className="text-center py-12">
                    <category.icon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No {category.name.toLowerCase()} yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating your first {category.name.toLowerCase()}.</p>
                    <div className="mt-6">
                      <Link href={`/${classno}/${subjectId}/add-content?type=${category.id}`}>
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Add {category.name}
                        </Button>
                      </Link>
                    </div>
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