import { getCurrentUserCached } from '@/Firebase/firebaseaction/auth.action'
import { redirect } from 'next/navigation'

import React from 'react'

const TokenLayout = async ({ children }: { children: React.ReactNode }) => {
  const data = await getCurrentUserCached();
//   console.log(data);
  if (data?.role !== 'admin') redirect("/dashboard");

  return <>{children}</>;
};


export default TokenLayout