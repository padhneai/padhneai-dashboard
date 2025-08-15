'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

const capitalize = (s: string) =>
  s.charAt(0).toUpperCase() + s.slice(1);

// Custom label mapping for better readability
const LABEL_MAP: Record<string, string> = {
  'question-banks': '10 Set',
  'model-sets': 'Model Question',
  'add-content': 'Add Content',
  'add-studynote': 'Add Study Note',
  'view-questions': 'View Questions',
  'edit-questions': 'Edit Questions',
  'view-studynote': 'View Study Note',
  'edit-studynote': 'Edit Study Note',
};

export default function DynamicBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('?')[0].split('/').filter(Boolean);

  // Skip breadcrumbs for home page
  if (segments.length === 0) return null;

  const crumbs = [
    { href: '/', label: 'Home', isHome: true },
    ...segments.map((seg, i) => {
      const href = '/' + segments.slice(0, i + 1).join('/');
      const rawLabel = LABEL_MAP[seg] || capitalize(seg.replace(/[-_]/g, ' '));
      return { href, label: rawLabel, isHome: false };
    }),
  ];

  return (
    <nav className="bg-gray-50 border-b px-12 py-2">
      <div className=" mx-auto">
        <ol className="flex items-center space-x-2 text-sm">
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            
            return (
              <li key={crumb.href} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="h-3 w-3 text-gray-400 mx-2" />
                )}
                
                {isLast ? (
                  <span className="text-gray-900 font-medium">
                    {crumb.label}
                  </span>
                ) : (
                  <Link 
                    href={crumb.href}
                    className="text-gray-600 hover:text-gray-900 transition-colors flex items-center"
                  >
                    {crumb.isHome && <Home className="h-3 w-3 mr-1" />}
                    {crumb.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
