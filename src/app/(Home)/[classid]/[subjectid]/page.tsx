import SubjectPage from '@/components/customui/SubjectPage'
import { getAllNotes, getAllTOC } from '@/services/notes';

import React from 'react'

const page =async ({params}:RouteParams) => {
    const {subjectid,classid} = await params;
    const [a,b] = classid.split("_")
    const [c,d]= subjectid.split("_")
    const classname = decodeURIComponent(a)
// console.log(classname,b,c,d)
  // const data = await getAllNotes()
  const gettoc = await getAllTOC()
  // console.log(gettoc)
    const data = await getAllNotes()

    
  return (
    <SubjectPage subjectname = {c} subjectId={d} classname={classname} classid={b} />
  )
}

export default page