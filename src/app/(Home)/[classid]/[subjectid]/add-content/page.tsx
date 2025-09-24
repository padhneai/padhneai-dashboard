
import QuestionForm from '@/components/addcontentforms/QuestionForm';
import FullpageLoading from '@/components/Loading/FullpageLoading';

import React, { Suspense } from 'react'

const page = async({params,searchParams}:RouteParams) => {
  const {classid,subjectid} = await params;
  const {type} = await searchParams;
  
  // this is for type (a)
  
  const [a,b] = classid.split("_")//this is for classno
  const [c,d] = subjectid.split("_")
const classname  = decodeURIComponent(a)
  
  console.log(type)
 
  return (
  // <AddContentPage subjectId={subjectid} contentType={type} />
  <Suspense fallback={<FullpageLoading />}>
    <QuestionForm  subjectname={c} subjectId={d} contentType={type} classname={classname} classid={b}/>
  </Suspense>

  )
}

export default page