'use server';

/**
 * @fileOverview A plant pest and disease identification AI agent.
 *
 * - identifyPestsAndDiseases - A function that handles the identification process.
 * - IdentifyPestsAndDiseasesInput - The input type for the identifyPestsAndDiseases function.
 * - IdentifyPestsAndDiseasesOutput - The return type for the identifyPestsAndDiseases function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyPestsAndDiseasesInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IdentifyPestsAndDiseasesInput = z.infer<typeof IdentifyPestsAndDiseasesInputSchema>;

const IdentifyPestsAndDiseasesOutputSchema = z.object({
  pestOrDisease: z.string().describe('The identified pest or disease.'),
  confidence: z.number().describe('The confidence level of the identification (0-1).'),
  treatmentOptions: z.array(z.string()).describe('Suggested treatment options.'),
});
export type IdentifyPestsAndDiseasesOutput = z.infer<typeof IdentifyPestsAndDiseasesOutputSchema>;

export async function identifyPestsAndDiseases(input: IdentifyPestsAndDiseasesInput): Promise<IdentifyPestsAndDiseasesOutput> {
  return identifyPestsAndDiseasesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyPestsAndDiseasesPrompt',
  input: {schema: IdentifyPestsAndDiseasesInputSchema},
  output: {schema: IdentifyPestsAndDiseasesOutputSchema},
  prompt: `You are an expert in plant pathology and entomology. Analyze the image of the plant and identify any potential pests or diseases. Provide a confidence level for your identification (0-1). Suggest appropriate treatment options.

Image: {{media url=photoDataUri}}
`,
});

const identifyPestsAndDiseasesFlow = ai.defineFlow(
  {
    name: 'identifyPestsAndDiseasesFlow',
    inputSchema: IdentifyPestsAndDiseasesInputSchema,
    outputSchema: IdentifyPestsAndDiseasesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
