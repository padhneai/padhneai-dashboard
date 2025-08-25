import Dashboard from '@/components/customui/Dashboard';
import { getDashboadAnalytics, getEachSubjectAnalytics } from '@/services/dashboard';
import { getAllSubjects } from '@/services/subjects';

const page = async({params}:RouteParams) => {

    const {classid} = await params;
   
    const [a,b] = decodeURIComponent(classid).split("_")
const id = Number(b)

 const data = await getAllSubjects();
const subjectData = await getEachSubjectAnalytics();
const dashbaord = await getDashboadAnalytics()
// console.log(dashbaord)

  


  
// console.log(a,b)
  return (
    <Dashboard classid={id}  classname={a} />
  )
} 

export default page