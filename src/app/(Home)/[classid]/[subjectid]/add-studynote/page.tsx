import React from 'react'
import Studynotes from '@/components/addcontentforms/Studynotes'

const page = async ({ params }:RouteParams) => {
  const { classid, subjectid } = await params;
  const cl = classid.split("_")[0]; // Extract class number from "class_10"
  const classname = decodeURIComponent(cl)
  const [a,b] = subjectid.split("_")
  
  return (
    <>
      <Studynotes subjectId={b}  />
    </>
  )
}

export default page