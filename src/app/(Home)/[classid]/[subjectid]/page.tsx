import SubjectPage from '@/components/customui/SubjectPage'
import { getAllPapers } from '@/services/paper';
import React from 'react'

const page =async ({params}:RouteParams) => {
    const {subjectid,classid} = await params;
    const cl = classid.split("_")[1]

 const data = await getAllPapers()
//  console.log(data)
  
    
  return (
    <SubjectPage subjectId = {subjectid} classno={classid} data={data} />
  )
}

export default page