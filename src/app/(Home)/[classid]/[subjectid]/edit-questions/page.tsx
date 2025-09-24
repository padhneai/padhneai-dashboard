import React from 'react'
import QuestionForm from '@/components/addcontentforms/QuestionForm'
import { getPaperById } from '@/services/paper';

const page = async({params,searchParams}:RouteParams) => {
    const { subjectid,classid } =await params;
    const {id} = await searchParams;
  const paperidno = Number(id)
  
  const paperdata = await getPaperById(paperidno)
  console.log(paperdata)
  
  // In edit mode, QuestionForm will automatically use data from initialData
  // No need to pass subjectId and classno since they're in the paperdata
  return (
    <QuestionForm contentType="" initialData={paperdata} mode="edit" />
  )
}

export default page