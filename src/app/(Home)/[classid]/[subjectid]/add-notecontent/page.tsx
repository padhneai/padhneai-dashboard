import NoteContentForm from '@/components/Notes/NoteContentForm'

import React from 'react'

const page = async({params,searchParams}:RouteParams) => {
    const {toc_id} = await  searchParams;
    const tocid = Number(toc_id);
    // console.log(toc_id)
    
  return (
   <NoteContentForm tocEntryId={tocid} />
  )
}

export default page