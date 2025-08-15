import React from 'react'
import Studynotes from '@/components/addcontentforms/Studynotes'

const page = async ({ params }:RouteParams) => {
  const { classid, subjectid } = await params;
  const cl = classid.split("_")[1]; // Extract class number from "class_10"
  
  return (
    <>
      <Studynotes subjectId={subjectid} classno={cl} />
    </>
  )
}

export default page