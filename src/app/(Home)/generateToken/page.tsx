import TokenManager from '@/components/TokenManager/TokenManager'
import { getEmailByUid } from '@/Firebase/firebaseaction/auth.action';
import { getAllTokens } from '@/Firebase/firebaseaction/token.action';
import React from 'react'

const page = async() => {
      const allTokens = await getAllTokens();



  return (
    <TokenManager />
  )
}

export default page