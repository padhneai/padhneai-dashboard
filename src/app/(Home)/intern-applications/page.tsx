import { getAllApplications } from '@/Firebase/firebaseaction/internapplication.action';
import { Suspense } from 'react';
import DataDisplayLoading from '@/components/Loading/DataDisplayLoading';
import ApplicationTable from '@/components/Intern-Application/ApplicationTable';





const Page = async () => {
  // Fetch data on server
  const applications = await getAllApplications();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Intern Applications</h1>

      <Suspense fallback={<DataDisplayLoading count={6} />}>
        {/* Pass server-fetched data */}
        <ApplicationTable applications={applications || []} />
      </Suspense>
    </div>
  );
};

export default Page;
