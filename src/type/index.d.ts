interface  RouteParams {
    params: Promise<Record<string, string>>;
    searchParams: Promise<Record<string, string>>;
  }



   interface AnswerSheet {
    answersheet_title: string;
    answersheet_description: string;
    answersheet_image: string | null;
  }
  
  interface Question {
    q_no: number;
    group: string;
    question_title: string;
    question_description: string;
    question_image: string | null;
    answersheet: AnswerSheet;
  }
  
   interface QuestionPaper {
    subject: string;
    class: string;
    year: string;
    category: string;
    Metadescription:string;
    questions: Question[];
  }

  interface MetadataFormProps {
    Metadescription: string;
    setMetadescription: (value: string) => void;
    
      year,
      setYear,
    year: string;
    setYear: (value: string) => void;
  
  }
  
  interface AnswerSheetFormProps {
    index: number;
    answersheet: AnswerSheet;
    updateAnswerSheet: (index: number, field: keyof AnswerSheet, value: any) => void;
    handleImageUpload: (file: File, index: number, type: 'question' | 'answer') => void;
  }