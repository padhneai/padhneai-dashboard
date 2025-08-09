import SubjectPage from '@/components/customui/SubjectPage'
import React from 'react'

const page =async ({params}:RouteParams) => {
    const {subjectid} = await params;
 const [a,b] = subjectid.split("_")
  
    
  return (
    <SubjectPage subjectId = {b} classno={a} />
  )
}

export default page