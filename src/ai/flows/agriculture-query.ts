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

const ChartDataSchema = z.array(
  z.object({
    name: z.string().describe('The name of the data point (e.g., a crop name or a month).'),
    value: z.number().describe('The value of the data point.'),
  })
).describe('An array of data points for the chart.');

const ChartSchema = z.object({
  type: z.enum(['bar', 'line']).describe('The type of chart to display.'),
  data: ChartDataSchema,
  xAxis: z.string().describe('Label for the X-axis.'),
  yAxis: z.string().describe('Label for the Y-axis.'),
});

const AnswerAgricultureQueryOutputSchema = z.object({
  answer: z.string().describe('The answer to the agriculture related question.'),
  followUpQuestions: z.array(z.string()).optional().describe('A list of 3 relevant follow-up questions the user might ask.'),
  chart: ChartSchema.optional().describe('Optional data for a chart to be displayed with the answer.'),
});
export type AnswerAgricultureQueryOutput = z.infer<typeof AnswerAgricultureQueryOutputSchema>;

export async function answerAgricultureQuery(input: AnswerAgricultureQueryInput): Promise<AnswerAgricultureQueryOutput> {
  return answerAgricultureQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerAgricultureQueryPrompt',
  input: {schema: AnswerAgricultureQueryInputSchema},
  output: {schema: AnswerAgricultureQueryOutputSchema},
  prompt: `You are an expert in agriculture, with a focus on Indian farming practices. Provide answers that are concise and precise. After your answer, suggest 3 relevant follow-up questions a user might have.

  If the user's query can be better understood with a chart (e.g., comparing production values, showing trends over time), provide the data for a 'bar' or 'line' chart. For example, if asked about top wheat producing states, you can provide a bar chart.

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
