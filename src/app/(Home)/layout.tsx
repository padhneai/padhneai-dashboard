
import Dashboardheader from "@/components/customui/Dashboardheader";
import Breadcrumbs from "@/components/customui/Breadcrumbs";
import { getCurrentsUser, getCurrentUserCached, isAuthenticated } from '@/Firebase/firebaseaction/auth.action';
import { redirect } from 'next/navigation';

import React, { ReactNode } from 'react';
import { Toaster } from 'sonner';


const Rootlayout =async ({children}:{children:ReactNode}) => {
  const isUserAuthenticated = await isAuthenticated();
  const data = await getCurrentUserCached()
// console.log(data)
  if(!isUserAuthenticated)  redirect("/sign-in")
  return (
    <div className="root-layout">
       
             {/* @ts-ignore */}
         <Dashboardheader data={data } />
         <Breadcrumbs/>
      {children}
    </div>
  )
}

export default Rootlayout