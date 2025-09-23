import Classes from '@/components/addclass/Classes'
import FullpageLoading from '@/components/Loading/FullpageLoading'
import { getAllClasses } from '@/services/classes'
import React, { Suspense } from 'react'

const page = async () => {
  const data = await getAllClasses()
  
  return (
    <Suspense fallback={<FullpageLoading />}>
      {/* @ts-ignore */}
      <Classes initialClasses={data} />
  </Suspense>
  )
}

export default page