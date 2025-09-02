import TokenPage from '@/components/auth/TokenPage'
import React from 'react'

const page = async ({searchParams}:RouteParams) => {
    const {user} = await searchParams;
    
  return (
    <TokenPage uid={user} />
  )
}

export default page