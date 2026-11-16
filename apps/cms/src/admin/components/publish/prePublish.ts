import type { ReactNode } from "react";

import type { Impact } from "../../../publish/confirmations";

export type PrePublishQuestion = (impact: Impact) => ReactNode | null;

export const prePublishQuestions: PrePublishQuestion[] = [];

export function registerPrePublishQuestion(question: PrePublishQuestion) {
  prePublishQuestions.push(question);
}
