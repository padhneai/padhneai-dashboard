import { ClassCard } from '@/components/customui/Class_card'

import { classLevels } from '@/lib/constant'
import React from 'react'

const page = () => {
  return (
     <div className="flex gap-6 justify-center p-6">
      {classLevels.map((level, idx) => (
        <ClassCard
          key={idx}
          title={level.title}
         href={level.href}
        />
      ))}
    </div>
 
  )
}

export default page