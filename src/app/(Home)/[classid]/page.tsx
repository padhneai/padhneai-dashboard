import Dashboard from '@/components/customui/Dashboard';
import React from 'react'

const page = async({params}:RouteParams) => {

    const {classid} = await params;

  return (
    <Dashboard classid={classid} />
  )
}

export default page