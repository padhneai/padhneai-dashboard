"use client";
export default function EmptyState({ icon: Icon, title, subtitle, action }: any) {
  return (
    <div className="text-center py-8">
      <Icon className="mx-auto h-10 w-10 text-gray-400 mb-3" />
      <h3 className="text-sm font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">{subtitle}</p>
      {action}
    </div>
  );
}
