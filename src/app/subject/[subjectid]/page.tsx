import SubjectPage from '@/components/customui/SubjectPage'
import { getAllPapers } from '@/services/paper';
import React from 'react'

const page =async ({params}:RouteParams) => {
    const {subjectid} = await params;
    const [a,b] = subjectid.split('_')
    const[c,s]= subjectid.split("-")
    const cl = c.split("_")[1]

 const data = await getAllPapers()
//  console.log(data)
  
    
  return (
    <SubjectPage subjectId = {s} classno={cl} data={data} />
  )
}

export default page