import Dashboard from '@/components/customui/Dashboard';
import FullpageLoading from '@/components/Loading/FullpageLoading';
import { getDashboadAnalytics, getEachSubjectAnalytics } from '@/services/dashboard';
import { getAllSubjects } from '@/services/subjects';
import { Suspense } from 'react';

const page = async({params}:RouteParams) => {

    const {classid} = await params;
   
    const [a,b] = decodeURIComponent(classid).split("_")
const id = Number(b)

const [subjectdata, subjectAnalytics, dashboardanalytics] = await Promise.all([
  getAllSubjects(),
  getEachSubjectAnalytics(),
  getDashboadAnalytics()
]);



  


  
// console.log(a,b)
  return (
      <Suspense fallback={<FullpageLoading />}>
      <Dashboard classid={id}  classname={a} initialdata={{subjectdata, subjectAnalytics, dashboardanalytics}} />
    </Suspense>
  )
} 

export default page




