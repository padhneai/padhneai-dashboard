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

interface Paper {
  id?: number;
  province: string;
  subject: string;
  class_name: string;
  year: string;
  metadescription: string;
  question_type: string;
  questions: ExamQuestion[];
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