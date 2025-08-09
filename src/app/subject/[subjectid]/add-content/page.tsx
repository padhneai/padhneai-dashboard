
import QuestionForm from '@/components/addcontentforms/QuestionForm';

import React from 'react'

const page = async({params,searchParams}:RouteParams) => {
  const {subjectid} = await params;
  const {type} = await searchParams;
  
  const [a,b] = type.split('_')

  
  
 
  return (
  // <AddContentPage subjectId={subjectid} contentType={type} />
  <QuestionForm  subjectId={subjectid} contentType={a} classno={b}/>

  )
}

export default page