'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ChevronRight } from 'lucide-react';

const capitalize = (s: string) =>
  s.charAt(0).toUpperCase() + s.slice(1);

// Optional custom label map
const LABEL_MAP: Record<string, string> = {
  'question-banks': '10 Set',
  'model-sets': 'Model Question',
};

export default function DynamicBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('?')[0].split('/').filter(Boolean);

  const crumbs = [
    { href: '/', label: 'Home' },
    ...segments.map((seg, i) => {
      const href = '/' + segments.slice(0, i + 1).join('/');
      const rawLabel = LABEL_MAP[seg] || capitalize(seg.replace(/[-_]/g, ' '));
      return { href, label: rawLabel };
    }),
  ];

  return (
    <Breadcrumb className='px-8 py-2'>
      <BreadcrumbList className="flex items-center space-x-1" aria-label="breadcrumb">
        {crumbs.map((c, i) => {
          const isActive = pathname === c.href;
          return (
            <React.Fragment key={c.href}>
              <BreadcrumbItem>
                {i < crumbs.length - 1 ? (
                  <BreadcrumbLink
                    href={c.href}
                    className={isActive ? 'text-primary font-semibold' : 'text-muted-foreground'}
                  >
                    {c.label}
                  </BreadcrumbLink>
                ) : (
                  <span className="text-muted-foreground">{c.label}</span>
                )}
              </BreadcrumbItem>

              {i < crumbs.length - 1 && (
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
