'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';



import { contentCategories } from '@/lib/constant';
import { getFilteredPapers, deletePaper } from '@/services/paper';
import SubjectHeader from '../Manageallcontent/SubjectHeader';
import ProvinceFilter from '../Manageallcontent/ProvinceFilter';
import TabsBar from '../Manageallcontent/TabsBar';
import NotesTOCList from '../Manageallcontent/NoteTocList';
import PapersGrid from '../Manageallcontent/PaperGrid';
import useSWR from 'swr';
import { getAllTOC } from '@/services/notes';

// Infer tab ids dynamically
type TabId = typeof contentCategories[number]['id'];

interface SubjectPageProps {
  subjectId: string;
  subjectname: string;
  classname: string;
  classid: string;
}

export default function SubjectPageContainer({
  subjectId,
  subjectname,
  classname,
  classid,
}: SubjectPageProps) {
  const [activeTab, setActiveTab] = useState<TabId>('model-sets');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [papers, setPapers] = useState<PaperApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  


  const categoryMap = useMemo(
    () => ({
      'model-sets': 'Model Question',
      'question-banks': '10 Set',
      notes: 'Notes',
    }),
    []
  );

 const { data: notedata, mutate, isLoading } = useSWR("/notes", () =>
    getAllTOC()
  )

  const fetchPapers = useCallback(async () => {
    setLoading(true);
    try {
      const questionType = categoryMap[activeTab];
      const params: Record<string, any> = {
        subject: subjectname,
        class_level: classname,
        question_type: questionType,
      };
      if (selectedProvince !== 'all') params.province = selectedProvince;

      const res = await getFilteredPapers(params);
      console.log(res)
      setPapers(res);
    } catch (err) {
      setPapers([]);
      // toast.error('Failed to fetch papers');
    } finally {
      setLoading(false);
    }
  }, [activeTab, selectedProvince, classname, subjectname, categoryMap]);

  useEffect(() => {
    if (activeTab !== 'notes') {
      fetchPapers();
    } else {
      setPapers(null);
      setLoading(false);
    }
  }, [activeTab, selectedProvince, fetchPapers]);

 const onDeletePaper = async (id: number) => {
  try {
    await deletePaper(id);

    // setPapers((prev) => (prev?.results.filter((p) => p.id !== id)));
    setPapers((prev) => {
  if (!prev) return prev; // or return null if you prefer

  const filteredResults = prev.results.filter((p) => p.id !== id);

  // Optional: if no results left, return null
  // if (filteredResults.length === 0) return null;

  return {
    ...prev,
    results: filteredResults,
    count: filteredResults.length, // 👈 Update count if needed
  };
});

    toast.success("Paper deleted successfully");
  } catch (error: unknown) {
    console.error("Delete paper failed:", error);

    const message =
      error instanceof Error ? error.message : "Failed to delete paper";

    toast.error(message);
  }
};


  const headerCount =
  activeTab === "notes"
    ? notedata?.results?.length ?? 0
    : papers?.results.length ?? 0;


  return (
    <div className="min-h-screen">
      {/* Header */}
      <SubjectHeader subjectname={subjectname} classname={classname} itemCount={headerCount} />

      {/* Province Filter */}
      {activeTab !== 'notes' && (
        <ProvinceFilter value={selectedProvince} onChange={setSelectedProvince} />
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <TabsBar value={activeTab} onValueChange={setActiveTab} />

        {/* Tab Contents */}
        {contentCategories.map((c) => (
          <div key={c.id} className={`${activeTab === c.id ? 'block' : 'hidden'} space-y-4`}>
            {/* Add Button */}
            <div className="flex items-center justify-between mt-4">
              <h2 className="text-lg font-medium text-gray-900">{c.name}</h2>
              <Link
                href={
                  c.id === 'notes'
                    ? `/${classname}_${classid}/${subjectname}_${subjectId}/add-studynote`
                    : `/${classname}_${classid}/${subjectname}_${subjectId}/add-content?type=${c.id}`
                }
              >
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" /> Add {c.name}
                </Button>
              </Link>
            </div>

            {/* Notes Tab */}
            {c.id === 'notes' ? (
              <NotesTOCList subjectId={subjectId} classname={classname} classid={classid} subjectname={subjectname} />
            ) : (
              <>
                {/* Loading Skeleton */}
                {loading ? (
                  <div className="grid gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="p-4 border rounded-lg animate-pulse bg-white shadow-sm"
                      >
                        <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
                        <div className="flex gap-2">
                          <div className="h-3 w-10 bg-gray-300 rounded"></div>
                          <div className="h-3 w-12 bg-gray-300 rounded"></div>
                          <div className="h-3 w-16 bg-gray-300 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : papers &&  papers?.results.length > 0 ? (
                  <PapersGrid
                    papers={papers?.results}
                    routes={(paper) => ({
                      view: `/${classname}_${classid}/${subjectname}_${subjectId}/view-questions?id=${paper.id}`,
                      edit: `/${classname}_${classid}/${subjectname}_${subjectId}/edit-questions?id=${paper.id}`,
                    })}
                    onDelete={onDeletePaper}
                  />
                ) : (
                  <div className="text-center py-8">
                    <c.icon className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      No {c.name.toLowerCase()} yet
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Create your first {c.name.toLowerCase()}.
                    </p>
                    <Link
                      href={
                        c.id === 'notes'
                          ? `/${classname}_${classid}/${subjectname}_${subjectId}/add-studynote`
                          : `/${classname}_${classid}/${subjectname}_${subjectId}/add-content?type=${c.id}`
                      }
                    >
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" /> Add {c.name}
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
