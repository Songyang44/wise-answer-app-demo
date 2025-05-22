import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import uuid from "react-native-uuid";

interface Question {
  id: string;
  text: string;
  isEditing: boolean;
}

interface Answer {
  id: string;
  questionId: string;
  text: string;
  isEditing: boolean;
}

interface InterviewQuestionState {
  questions: Question[];
  answers: Answer[];
}

const questionList: Question[] = [
  {
    id: uuid.v4().toString(),
    text: "Why do you want to work here?",
    isEditing: false,
  },
  {
    id: uuid.v4().toString(),
    text: "What are your strengths?",
    isEditing: false,
  },
  {
    id: uuid.v4().toString(),
    text: "Tell me about a challenge you’ve faced.",
    isEditing: false,
  },
];

const initialState: InterviewQuestionState = {
  questions: questionList,
  answers: questionList.map((q) => ({
    id: uuid.v4().toString(),
    questionId: q.id,
    text: "",
    isEditing: false,
  })),
};

const interviewSlice = createSlice({
  name: "interview",
  initialState,
  reducers: {
    addQuestion: (state) => {
      const id = uuid.v4().toString();
      state.questions.push({
        id,
        text: "",
        isEditing: true,
      });
      state.answers.push({
        id: uuid.v4().toString(),
        questionId: id,
        text: "",
        isEditing: false,
      });
    },
    startEditing: (state, action: PayloadAction<string>) => {
      state.questions.forEach((q) => {
        q.isEditing = q.id === action.payload;
      });
    },
    updateQuestion: (
      state,
      action: PayloadAction<{ id: string; text: string }>
    ) => {
      const question = state.questions.find((q) => q.id === action.payload.id);
      if (question) question.text = action.payload.text;
    },
    stopEditing: (state, action: PayloadAction<string>) => {
      const question = state.questions.find((q) => q.id === action.payload);
      if (question) question.isEditing = false;
    },
    updateAnswerByQuestionId: (
      state,
      action: PayloadAction<{ questionId: string; text: string }>
    ) => {
      const { questionId, text } = action.payload;
      const answer = state.answers.find((a) => a.questionId === questionId);
      if (answer) {
        answer.text = text;
      }
    },
    reorderQuestions: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload;
    },
    setQuestions: (state, action: PayloadAction<string[]>) => {
      state.questions = action.payload.map((text) => ({
        id: uuid.v4().toString(),
        text,
        isEditing: false,
      }));
      state.answers = state.questions.map((q) => ({
        id: uuid.v4().toString(),
        questionId: q.id,
        text: "",
        isEditing: false,
      }));
    },
  },
});

export const {
  addQuestion,
  startEditing,
  updateQuestion,
  stopEditing,
  updateAnswerByQuestionId,
  reorderQuestions,
  setQuestions
} = interviewSlice.actions;

export default interviewSlice.reducer;
