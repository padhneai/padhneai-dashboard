
import QuestionForm from '@/components/addcontentforms/QuestionForm';
import { log } from 'node:console';

import React from 'react'

const page = async({params,searchParams}:RouteParams) => {
  const {subjectid} = await params;
  const {type} = await searchParams;
  
  const [a,b] = type.split('_') // this is for type (a)
  const[c,s]= subjectid.split("-") // this is for subjectid (s)
  const cl = c.split("_")[1] //this is for classno

  
  
 
  return (
  // <AddContentPage subjectId={subjectid} contentType={type} />
  <QuestionForm  subjectId={s} contentType={a} classno={cl}/>

  )
}

export default page