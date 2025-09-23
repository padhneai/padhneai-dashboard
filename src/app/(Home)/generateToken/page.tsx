import FullpageLoading from '@/components/Loading/FullpageLoading';
import TokenManager from '@/components/TokenManager/TokenManager'
import { getAllTokens } from '@/Firebase/firebaseaction/token.action';
import React, { Suspense } from 'react'

const page = () => {
     

  return (
    <Suspense fallback={<FullpageLoading />}>
      <TokenManager />
    </Suspense>
  )
}

export default page