'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { contentCategories } from '@/lib/constant';

type TabId = typeof contentCategories[number]['id'];

interface TabsBarProps {
  value: TabId;
  onValueChange: (v: TabId) => void;
}

export default function TabsBar({ value, onValueChange }: TabsBarProps) {
  return (
    <Tabs value={value} onValueChange={(v) => onValueChange(v as TabId)}>
      <TabsList className="grid w-full grid-cols-4 bg-white rounded-lg border">
        {contentCategories.map((c) => (
          <TabsTrigger
            key={c.id}
            value={c.id}
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
          >
            <c.icon className="w-4 h-4 mr-2" />
            {c.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
