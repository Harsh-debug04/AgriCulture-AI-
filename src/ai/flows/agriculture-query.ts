'use server';

/**
 * @fileOverview An AI agent that answers agriculture related questions.
 *
 * - answerAgricultureQuery - A function that answers agriculture related queries.
 * - AnswerAgricultureQueryInput - The input type for the answerAgricultureQuery function.
 * - AnswerAgricultureQueryOutput - The return type for the answerAgricultureQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerAgricultureQueryInputSchema = z.object({
  query: z.string().describe('The agriculture related question to answer.'),
  language: z.string().optional().describe('The language for the answer, e.g., "en" or "hi".'),
});
export type AnswerAgricultureQueryInput = z.infer<typeof AnswerAgricultureQueryInputSchema>;

const AnswerAgricultureQueryOutputSchema = z.object({
  answer: z.string().describe('The answer to the agriculture related question.'),
  followUpQuestions: z.array(z.string()).optional().describe('A list of 3 relevant follow-up questions the user might ask.'),
});
export type AnswerAgricultureQueryOutput = z.infer<typeof AnswerAgricultureQueryOutputSchema>;

export async function answerAgricultureQuery(input: AnswerAgricultureQueryInput): Promise<AnswerAgricultureQueryOutput> {
  return answerAgricultureQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerAgricultureQueryPrompt',
  input: {schema: AnswerAgricultureQueryInputSchema},
  output: {schema: AnswerAgricultureQueryOutputSchema},
  prompt: `You are an expert in agriculture, with a focus on Indian farming practices. Provide answers that are well-structured, concise, and precise. After your answer, suggest 3 relevant follow-up questions a user might have.

  Please answer the following question to the best of your ability.
  {{#if language}}
  Please respond in the following language: {{language}}.
  {{else}}
  Please respond in English.
  {{/if}}

  Question: {{query}}`,
});

const answerAgricultureQueryFlow = ai.defineFlow(
  {
    name: 'answerAgricultureQueryFlow',
    inputSchema: AnswerAgricultureQueryInputSchema,
    outputSchema: AnswerAgricultureQueryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
