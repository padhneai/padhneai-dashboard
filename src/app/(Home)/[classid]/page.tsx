import Dashboard from '@/components/customui/Dashboard';

const page = async({params}:RouteParams) => {

    const {classid} = await params;
    // console.log(classid)

  return (
    <Dashboard classid={classid} />
  )
} 

export default page