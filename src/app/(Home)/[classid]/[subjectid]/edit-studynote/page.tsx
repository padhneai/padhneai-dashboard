import StudyNotes from '@/components/addcontentforms/Studynotes'
import { getTOCById } from '@/services/notes';
import React from 'react'

const page = async({params,searchParams}:RouteParams) => {
  const {id} = await searchParams;
const tocid = Number(id);
  // const data = await partialUpdateTOC()
  const data = await getTOCById(tocid)
  // console.log(data)
  return (
        <StudyNotes tocid={tocid} initialData={data} mode="edit"/>
  
  )
}

export default page