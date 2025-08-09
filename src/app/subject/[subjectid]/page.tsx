import SubjectPage from '@/components/customui/SubjectPage'
import React from 'react'

const page =async ({params,searchParams}:RouteParams) => {
    const {subjectid} = await params;
  const {classno} = await searchParams;
  
    
  return (
    <SubjectPage subjectId = {subjectid} classno={classno} />
  )
}

export default page