'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import useSWR from 'swr';
import dynamic from 'next/dynamic';

import { contentCategories } from '@/lib/constant';
import { getFilteredPapers, deletePaper } from '@/services/paper';
import SubjectHeader from '../Manageallcontent/SubjectHeader';
import ProvinceFilter from '../Manageallcontent/ProvinceFilter';
import TabsBar from '../Manageallcontent/TabsBar';
import PapersGrid from '../Manageallcontent/PaperGrid';
import { getAllTOC } from '@/services/notes';
import { toast } from 'sonner';
import DataDisplayLoading from '../Loading/DataDisplayLoading';

// Lazy load Notes component
const NotesTOCList = dynamic(() => import('../Manageallcontent/NoteTocList'), {
  ssr: false,
  loading: () => <DataDisplayLoading />,
});

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

  // Map tab ids to question types
  const categoryMap = useMemo(
    () => ({
      'model-sets': 'Model Question',
      'question-banks': '10 Set',
      notes: 'Notes',
    }),
    []
  );

  // SWR for papers (dynamic key based on tab and province)
  const { data: papersData, isLoading: papersLoading, mutate: mutatePapers } = useSWR(
    activeTab !== 'notes'
      ? ['/papers', activeTab, selectedProvince]
      : null,
    () =>
      getFilteredPapers({
        subject: subjectname,
        class_level: classname,
        question_type: categoryMap[activeTab],
        ...(selectedProvince !== 'all' && { province: selectedProvince }),
      }),
    { revalidateOnFocus: false }
  );

  // SWR for notes
  const { data: notesData } = useSWR(activeTab === 'notes' ? '/notes' : null, getAllTOC);

  const memoizedPapers = useMemo(() => papersData?.results || [], [papersData]);
  const headerCount = activeTab === 'notes' ? notesData?.results?.length ?? 0 : memoizedPapers.length;

  const onDeletePaper = async (id: number) => {
    try {
      await deletePaper(id);
      mutatePapers((prev: any) => {
        if (!prev) return prev;
        const filtered = prev.results.filter((p: any) => p.id !== id);
        return { ...prev, results: filtered, count: filtered.length };
      }, false);
      toast.success('Paper deleted successfully');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete paper';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <SubjectHeader subjectname={subjectname} classname={classname} itemCount={headerCount} />

      {/* Province Filter (only for papers) */}
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

            {/* Notes or Papers */}
            {c.id === 'notes' ? (
              <NotesTOCList
                subjectId={subjectId}
                classname={classname}
                classid={classid}
                subjectname={subjectname}
              />
            ) : (
              <>
                {papersLoading ? (
                 <DataDisplayLoading />
                ) : memoizedPapers.length > 0 ? (
                  <PapersGrid
                    papers={memoizedPapers}
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
