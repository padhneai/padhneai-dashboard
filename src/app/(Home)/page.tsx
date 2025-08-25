import Classes from '@/components/addclass/Classes'
import { getAllClasses } from '@/services/classes'
import React from 'react'

const page = async () => {
  const data = await getAllClasses()
  // console.log(data)
  return (
  <Classes />
  )
}

export default page