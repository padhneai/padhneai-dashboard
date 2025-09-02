// import { Timestamp } from "firebase/firestore";
interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface AnswerSheetFormProps {
  index: number;
  answersheet: AnswerSheet;
  updateAnswerSheet: (
    index: number,
    field: keyof AnswerSheet,
    value: any
  ) => void;
  handleImageUpload: (
    file: File,
    index: number,
    type: "question" | "answer"
  ) => void;
}

interface MetadataFormProps {
  Metadescription: string;
  setMetadescription: (value: string) => void;

  year;
  setYear;
  year: string;
  setYear: (value: string) => void;
}

interface categoryPaper {
  id: number;
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
  question_english: string;
  question_nepali: string;
  question_image?: string | null;
  answer_sheet: AnswerSheet;
}

interface ClassLevel{
  id:string,
  name:string,

}
interface Subjectlevel{
  class_level:ClassLevel,
  id:string,
  name:string,
}

interface Paper {
  id?: number;
  province: string;
  subject: Subjectlevel;
  class_level: ClassLevel;
  year: string;
  metadescription: string;
  question_type: string;
  questions: ExamQuestion[];
  slug:string;
}

interface QuestionItemProps {
  index: number;
  question: ExamQuestion[];
  updateQuestion: (
    index: number,
    field: keyof ExamQuestion,
    value: any
  ) => void;
  updateAnswerSheet: (
    index: number,
    field: keyof ExamQuestion["answer_sheet"],
    value: any
  ) => void;
  removeQuestion: (index: number) => void;
  handleImageUpload: (
    file: File,
    index: number,
    type: "question" | "answer"
  ) => void;
}


interface AlertDialogboxProps {
  trigger: ReactNode;
  title: string;
  description: string;
  cancelText?: string;
  actionText?: string;
  onAction: () => void;
  onCancel?: () => void;
  variant?: "default" | "destructive";
}

interface ClassItem {
  id: number
  name: string
}

interface ClassesProps {
  classdata: ClassItem[] // array of ClassItem
}



interface SubjectAnalytics {
  subject_id: number | string
  subject_name: string
  total_10_sets: number
  total_model_papers: number
  total_model_questions: number
  total_notes: number
  total_questions: number
}
interface DashboardAnalytics {
  total_subjects: number;
  total_questions: number;
  total_model_papers: number;
  total_notes: number;
  total_10_sets: number;
}


interface NoteToc{
      chapter_number:string,
      content_name_english: string,
      content_name_nepali: string,
      description_english: string,
      description_nepali:string,
}


interface User {
  name: string;
  email: string;
  id: string;
  
}

interface SignInParams {
  email: string;
  idToken: string;
}

interface SignUpParams {
  uid: string;
  name: string;
  email: string;
  password: string;
}


 interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user"; // if you only have these two roles
  createdAt: Date ;
  tokenVerified?:boolean;

}

interface UserInfoprops{
  data:UserInfo
}

 interface Token {
  value: string;
  createdAt: Date;
  usedBy?: string | null;
  expiresAt?: Date | null;
  tokenVerified?:boolean;
  usedemail?: string | null;

}
