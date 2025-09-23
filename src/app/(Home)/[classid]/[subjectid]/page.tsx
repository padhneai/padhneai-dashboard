import SubjectPage from '@/components/customui/SubjectPage'
import FullpageLoading from '@/components/Loading/FullpageLoading';
import { getAllNotes, getAllTOC } from '@/services/notes';

import React, { Suspense } from 'react'

const page =async ({params}:RouteParams) => {
    const {subjectid,classid} = await params;
    const [a,b] = classid.split("_")
    const [c,d]= subjectid.split("_")
    const classname = decodeURIComponent(a)

    const [gettoc, data] = await Promise.all([
        getAllTOC(),
        getAllNotes()
      ])
 


    
  return (

     <Suspense fallback={<FullpageLoading />}>
    <SubjectPage subjectname = {c} subjectId={d} classname={classname} classid={b} />
          
        </Suspense>
  )
}

export default page

