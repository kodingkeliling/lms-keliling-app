import { DEMO_QUESTIONS as englishQuestions } from "./english";
import { DEMO_QUESTIONS as japaneseQuestions } from "./japanese";
import { DEMO_QUESTIONS as koreanQuestions } from "./korean";
import { DEMO_QUESTIONS as frenchQuestions } from "./french";
import { DEMO_QUESTIONS as spanishQuestions } from "./spanish";
import { DEMO_QUESTIONS as mandarinQuestions } from "./mandarin";
import { DEMO_QUESTIONS as arabicQuestions } from "./arabic";
import { DEMO_QUESTIONS as germanQuestions } from "./german";
import { DEMO_QUESTIONS as italianQuestions } from "./italian";
import { DEMO_QUESTIONS as portugueseQuestions } from "./portuguese";
import { DEMO_QUESTIONS as russianQuestions } from "./russian";
import { DEMO_QUESTIONS as hindiQuestions } from "./hindi";
import { DEMO_QUESTIONS as sundaneseQuestions } from "./sundanese";
import { DEMO_QUESTIONS as javaneseQuestions } from "./javanese";

export interface DemoQuestionRaw {
    description: string;
    options: string[] | null;
    answer: string;
    skill: "Reading" | "Writing" | "Speaking" | "Listening";
}

export const DEMO_QUESTIONS_BY_LANGUAGE: Record<string, DemoQuestionRaw[]> = {
    English: englishQuestions,
    Japanese: japaneseQuestions,
    Korean: koreanQuestions,
    French: frenchQuestions,
    Spanish: spanishQuestions,
    Mandarin: mandarinQuestions,
    Arabic: arabicQuestions,
    German: germanQuestions,
    Italian: italianQuestions,
    Portuguese: portugueseQuestions,
    Russian: russianQuestions,
    Hindi: hindiQuestions,
    Sundanese: sundaneseQuestions,
    Javanese: javaneseQuestions,
};

export const getRandomDemoQuestions = (count: number, skills: string[], language: string = "English") => {
    const questionsForLang = DEMO_QUESTIONS_BY_LANGUAGE[language] || DEMO_QUESTIONS_BY_LANGUAGE.English;

    let filtered = questionsForLang;
    if (skills && skills.length > 0) {
        filtered = questionsForLang.filter((q) => skills.includes(q.skill));
    }

    if (filtered.length === 0) {
        filtered = questionsForLang;
    }

    const selected = [];
    while (selected.length < count) {
        const shuffled = [...filtered].sort(() => 0.5 - Math.random());
        const toTake = Math.min(count - selected.length, shuffled.length);
        selected.push(...shuffled.slice(0, toTake));
    }

    return selected.map((q) => ({
        id: crypto.randomUUID(),
        description: q.description,
        options: q.options,
        answer: q.answer,
        skill: q.skill as "Reading" | "Writing" | "Speaking" | "Listening",
    }));
};
