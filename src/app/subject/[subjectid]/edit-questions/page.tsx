import React from 'react'
import QuestionForm from '@/components/addcontentforms/QuestionForm'
import { getPaperById } from '@/services/paper';

const page = async({params,searchParams}:RouteParams) => {
    const { subjectid } =await params;
    const {id} = await searchParams;
  const paperidno = Number(id)
  
  const[c,s]= subjectid.split("-") // this is for subjectid (s)
  const cl = c.split("_")[1] //this is for classno
  const paperdata = await getPaperById(paperidno)
  
  
  return (
    <QuestionForm contentType="" subjectId={s} classno={cl} initialData={paperdata} mode="edit" />
  )
}

export default page