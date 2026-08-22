import { READING_QUESTIONS } from "./reading";
import { WRITING_QUESTIONS } from "./writing";
import { SPEAKING_QUESTIONS } from "./speaking";
import { LISTENING_QUESTIONS } from "./listening";

export interface DemoQuestionRaw {
    description: string;
    options: string[] | null;
    answer: string;
    skill: "Reading" | "Writing" | "Speaking" | "Listening";
}

export const DEMO_QUESTIONS: DemoQuestionRaw[] = [
    ...READING_QUESTIONS,
    ...WRITING_QUESTIONS,
    ...SPEAKING_QUESTIONS,
    ...LISTENING_QUESTIONS,
] as DemoQuestionRaw[];
