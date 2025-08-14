interface  RouteParams {
    params: Promise<Record<string, string>>;
    searchParams: Promise<Record<string, string>>;
  }


  interface AnswerSheetFormProps {
    index: number;
    answersheet: AnswerSheet;
    updateAnswerSheet: (index: number, field: keyof AnswerSheet, value: any) => void;
    handleImageUpload: (file: File, index: number, type: 'question' | 'answer') => void;
  }
   interface AnswerSheet {
    answersheet_english: string;
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
  




  interface RouteParams {
    params: Promise<Record<string, string>>;
    searchParams: Promise<Record<string, string>>;
  }




  interface AnswerSheet {
    id: number;
    answer_english: string;
    answer_nepali: string;
    answer_image: string | null;
  }
  
   interface Question {
    id: number;
    q_no: number;
    question_english: string;
    question_nepali: string;
    question_image: string | null;
    answer_sheet: AnswerSheet;
  }
  


  interface categoryPaper {
    id:number,
    subject: string;
    class_name: string;
    year: string;
  }
  


  interface AnswerSheet {
    answer_english: string;
    answer_nepali: string;
    answer_image?: string | null;
  }

  interface ExamQuestion {
    q_no: number;
    group: string;
    question_title: string;
    question_description: string;
    question_image?: string | null;
    answersheet: AnswerSheet;
  }



interface Paper {
  id?: number;
  province: string;
  subject: string;
  class_name: string;
  year: string; // You can change this to Date if you parse it
  metadescription: string;
  question_type: string;
  questions: ExamQuestion[];
}
interface QuestionItemProps {
  index: number;
  question: Question;
  updateQuestion: (index: number, field: keyof Question, value: any) => void;
  updateAnswerSheet: (index: number, field: keyof Question['answer_sheet'], value: any) => void;
  removeQuestion: (index: number) => void;
  handleImageUpload: (file: File, index: number, type: 'question' | 'answer') => void;
}