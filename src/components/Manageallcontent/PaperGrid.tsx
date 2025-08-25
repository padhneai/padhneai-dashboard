"use client";
import PaperCard from "./PaperCard";

export default function PapersGrid({
  papers,
  routes,
  onDelete,
}: {
  papers: any[];
  routes: (paper: any) => { view: string; edit: string };
  onDelete: (id: number) => void;
}) {
  if (!papers.length) return null;
  return (
    <div className="grid gap-4">
      {papers.map((paper) => (
        <PaperCard
          key={paper.id}
          paper={paper}
          viewHref={routes(paper).view}
          editHref={routes(paper).edit}
          onDelete={() => onDelete(paper.id)}
        />
      ))}
    </div>
  );
}
