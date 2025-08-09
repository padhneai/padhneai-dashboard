// lib/constant.ts

import {
    BookOpen,
    ClipboardList,
    FileQuestion,
    StickyNote,
    Calculator,
    FlaskConical,
    Globe,
    Languages,
    Monitor,
    FileText,
  } from "lucide-react";
  
  // --- Subjects ---
  export const subjects = [
    {
      id: "english",
      name: "English",
      description: "Reading, grammar, writing, and literature",
      icon: BookOpen,
      color: "bg-blue-500",
      totalQuestions: 142,
      modelSets: 8,
      practiceSets: 15,
      questionBanks: 10,
      notes: 24,
    },
    {
      id: "math",
      name: "Mathematics",
      description: "Algebra, geometry, trigonometry, and more",
      icon: Calculator,
      color: "bg-green-500",
      totalQuestions: 215,
      modelSets: 12,
      practiceSets: 20,
      questionBanks: 10,
      notes: 30,
    },
    {
      id: "science",
      name: "Science",
      description: "Physics, chemistry, biology, and experiments",
      icon: FlaskConical,
      color: "bg-purple-500",
      totalQuestions: 189,
      modelSets: 10,
      practiceSets: 18,
      questionBanks: 10,
      notes: 28,
    },
    {
      id: "social",
      name: "Social Studies",
      description: "History, geography, civics, and economics",
      icon: Globe,
      color: "bg-orange-500",
      totalQuestions: 167,
      modelSets: 9,
      practiceSets: 16,
      questionBanks: 10,
      notes: 22,
    },
    {
      id: "nepali",
      name: "Nepali",
      description: "नेपाली भाषा, व्याकरण, कविता र गद्य",
      icon: Languages,
      color: "bg-red-500",
      totalQuestions: 124,
      modelSets: 7,
      practiceSets: 12,
      questionBanks: 10,
      notes: 18,
    },
    {
      id: "computer",
      name: "Computer Science",
      description: "Programming, theory, and applications",
      icon: Monitor,
      color: "bg-gray-500",
      totalQuestions: 98,
      modelSets: 6,
      practiceSets: 10,
      questionBanks: 10,
      notes: 15,
    },
  ] as const;
  
  // --- Content Categories ---
  export const contentCategories = [
    {
      id: "model-sets",
      name: "Model Sets",
      shortName: "Models",
      description: "Full-length practice exams with time and marks",
      icon: ClipboardList,
    },
    // {
    //   id: "practice-questions",
    //   name: "Practice Questions",
    //   shortName: "Practice",
    //   description: "Topic-wise questions for focused practice",
    //   icon: FileQuestion,
    // },
    {
      id: "question-banks",
      name: "10 Set Question Bank",
      shortName: "Banks",
      description: "10 sets of comprehensive question banks",
      icon: FileText,
    },
    {
      id: "notes",
      name: "Study Notes",
      shortName: "Notes",
      description: "Detailed notes and summaries for each topic",
      icon: StickyNote,
    },
  ] as const;
  
  // --- Content Sections (by subject) ---
  export const contentSections = {
    english: [
      { value: "reading-comprehension", label: "Reading Comprehension" },
      { value: "grammar", label: "Grammar" },
      { value: "writing", label: "Writing (Letters, Essays)" },
      { value: "literature", label: "Literature (Prose, Poetry)" },
      { value: "vocabulary", label: "Vocabulary" },
    ],
    math: [
      { value: "algebra", label: "Algebra" },
      { value: "geometry", label: "Geometry" },
      { value: "trigonometry", label: "Trigonometry" },
      { value: "statistics", label: "Statistics" },
      { value: "word-problems", label: "Word Problems" },
    ],
    science: [
      { value: "physics", label: "Physics" },
      { value: "chemistry", label: "Chemistry" },
      { value: "biology", label: "Biology" },
      { value: "environmental-science", label: "Environmental Science" },
    ],
    social: [
      { value: "history", label: "History" },
      { value: "geography", label: "Geography" },
      { value: "civics", label: "Civics" },
      { value: "economics", label: "Economics" },
    ],
    nepali: [
      { value: "vyakaran", label: "व्याकरण" },
      { value: "kavita", label: "कविता" },
      { value: "gadya", label: "गद्य" },
      { value: "lokopakathan", label: "लोकोपकथन" },
    ],
    computer: [
      { value: "programming", label: "Programming" },
      { value: "theory", label: "Computer Theory" },
      { value: "applications", label: "Software Applications" },
      { value: "networks", label: "Networks & Security" },
    ],
  };
  
  // --- Question Types ---
  export const questionTypes = {
    english: [
      { value: "multiple_choice", label: "Multiple Choice" },
      { value: "short_answer", label: "Short Answer" },
      { value: "long_answer", label: "Long Answer / Descriptive" },
      { value: "essay", label: "Essay Writing" },
      { value: "write_a_letter", label: "Write a Letter" },
      { value: "grammar_fill_in_blank", label: "Fill in the Blanks" },
      { value: "cloze_test", label: "Cloze Test" },
      { value: "grammar_error_correction", label: "Error Correction" },
      { value: "sentence_reordering", label: "Sentence Reordering" },
      { value: "match_the_following", label: "Match the Following" },
      { value: "true_false", label: "True / False" },
    ],
    // ... other subjects
  };

  export const subjectData ={
    english:{
      name:"English",
      description:''
    },
    math:{
      name:"math",
      description:''
    },
  }