import NoteContentForm from '@/components/Notes/NoteContentForm'
import { getNoteById } from '@/services/notes';
import React from 'react'

const page = async({params,searchParams}:RouteParams) => {
    const {id} = await searchParams;
    const tocid = Number(id)
     const data = await getNoteById(tocid)
        console.log("this data",data)
  return (
       <NoteContentForm
        tocEntryId={Number(tocid)}
        initialData={data}
        mode="edit"
      />
  )
}

export default page