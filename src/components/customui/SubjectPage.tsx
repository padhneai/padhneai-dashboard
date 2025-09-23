'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
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
  initialdata?: { toc: any; notes: any };
}

export default function SubjectPageContainer({
  subjectId,
  subjectname,
  classname,
  classid,
  initialdata,
}: SubjectPageProps) {
  const [activeTab, setActiveTab] = useState<TabId>('model-sets');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1); // pagination

  const categoryMap = useMemo(
    () => ({
      'model-sets': 'Model Question',
      'question-banks': '10 Set',
      notes: 'Notes',
    }),
    []
  );

  // SWR for papers with pagination
  const { data: papersData, isLoading: papersLoading, mutate: mutatePapers } = useSWR(
    activeTab !== 'notes'
      ? ['/papers', activeTab, selectedProvince, currentPage]
      : null,
    () =>
      getFilteredPapers({
        subject: subjectname,
        class_level: classname,
        question_type: categoryMap[activeTab],
        page: currentPage,
        page_size: 10, // adjust page size here
        ...(selectedProvince !== 'all' && { province: selectedProvince }),
      }),
    { revalidateOnFocus: false }
  );

  const { data: notesData } = useSWR(
    activeTab === 'notes' ? '/notes' : null,
    getAllTOC,
    { fallbackData: initialdata?.toc, revalidateOnFocus: false }
  );

  const memoizedPapers = useMemo(() => papersData?.results || [], [papersData]);
  const headerCount = activeTab === 'notes' ? notesData?.results?.length ?? 0 : papersData?.count ?? 0;

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

  // Pagination handlers
  const goToNextPage = () => {
    if (currentPage < (papersData?.total_pages || 1)) setCurrentPage((prev) => prev + 1);
  };
  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen">
      <SubjectHeader subjectname={subjectname} classname={classname} itemCount={headerCount} />

      {activeTab !== 'notes' && (
        <ProvinceFilter value={selectedProvince} onChange={setSelectedProvince} />
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <TabsBar value={activeTab} onValueChange={setActiveTab} />

        {contentCategories.map((c) => (
          <div key={c.id} className={`${activeTab === c.id ? 'block' : 'hidden'} space-y-4`}>
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

            {c.id === 'notes' ? (
              <NotesTOCList
                subjectId={subjectId}
                classname={classname}
                classid={classid}
                subjectname={subjectname}
                initialdata={initialdata?.notes}
              />
            ) : (
              <>
                {papersLoading ? (
                  <DataDisplayLoading />
                ) : memoizedPapers.length > 0 ? (
                  <>
                    <PapersGrid
                      papers={memoizedPapers}
                      routes={(paper) => ({
                        view: `/${classname}_${classid}/${subjectname}_${subjectId}/view-questions?id=${paper.id}`,
                        edit: `/${classname}_${classid}/${subjectname}_${subjectId}/edit-questions?id=${paper.id}`,
                      })}
                      onDelete={onDeletePaper}
                    />

                    {/* Pagination Controls */}
                    <div className="flex justify-center items-center gap-4 mt-6">
                      <Button
                        size="sm"
                        onClick={goToPrevPage}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="w-4 h-4" /> Previous
                      </Button>
                      <span>
                        Page {currentPage} of {papersData?.total_pages || 1}
                      </span>
                      <Button
                        size="sm"
                        onClick={goToNextPage}
                        disabled={currentPage === (papersData?.total_pages || 1)}
                      >
                        Next <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      No {c.name.toLowerCase()} yet
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Create your first {c.name.toLowerCase()}.
                    </p>
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
