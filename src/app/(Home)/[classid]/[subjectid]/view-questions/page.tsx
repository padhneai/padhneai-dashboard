"use server";

import { getPaperById } from "@/services/paper";




const Page = async ({ searchParams }: RouteParams) => {
  
  const {id} = await searchParams;

const paperidno = Number(id)

// console.log(paperidno)
  // Fetch paper data
  const paperdata = await getPaperById(paperidno);
// console.log(paperdata)

      const htmlString = `
  ${paperdata.metadescription}
  ${paperdata.questions
    .map((q: any) => ` ${q.question_english}`)
    }
`;

  // Render HTML directly
  return (
    <div className="p-4">
      
      <div dangerouslySetInnerHTML={{ __html: htmlString }} className="px-6 py-12 max-w-7xl mx-auto min-h-[85vh]" />
    </div>
  );
};

export default Page;
