'use server';

/**
 * @fileOverview An AI agent for diagnosing plant pests and diseases.
 *
 * - diagnosePest - A function that handles the plant diagnosis process.
 * - PestDiagnosisInput - The input type for the diagnosePest function.
 * - PestDiagnosisOutput - The return type for the diagnosePest function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PestDiagnosisInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe('The description of the plant and its symptoms.'),
});
export type PestDiagnosisInput = z.infer<typeof PestDiagnosisInputSchema>;

const PestDiagnosisOutputSchema = z.object({
  identification: z.object({
    isPlant: z.boolean().describe('Whether or not the input image is a plant.'),
    commonName: z.string().describe('The common name of the identified plant. Return "N/A" if not a plant.'),
    latinName: z.string().describe('The Latin name of the identified plant. Return "N/A" if not a plant.'),
  }),
  diagnosis: z.object({
    isHealthy: z.boolean().describe('Whether or not the plant appears to be healthy.'),
    details: z.string().describe("A detailed diagnosis of the plant's health issue (pest or disease), formatted in markdown. If healthy, state that. If not a plant, explain why."),
    remedy: z.string().describe("Recommended actions or treatments, formatted in markdown. If healthy or not a plant, provide no remedy.")
  }),
});
export type PestDiagnosisOutput = z.infer<typeof PestDiagnosisOutputSchema>;

export async function diagnosePest(input: PestDiagnosisInput): Promise<PestDiagnosisOutput> {
  return diagnosePestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnosePestPrompt',
  input: { schema: PestDiagnosisInputSchema },
  output: { schema: PestDiagnosisOutputSchema },
  prompt: `You are an expert botanist specializing in diagnosing plant illnesses from images and descriptions.

  Analyze the provided image and description.

  1.  First, determine if the image contains a plant. Set the 'isPlant' field accordingly.
  2.  If it is a plant, identify its common and Latin names.
  3.  Assess the plant's health based on the visual evidence and user's description. Determine if it is 'isHealthy'.
  4.  Provide a detailed 'details' of the diagnosis. If it's a disease or pest, name it and describe its characteristics.
  5.  Suggest a 'remedy', including both organic and chemical treatment options if applicable, formatted clearly using markdown.
  
  If the image is not a plant, provide "N/A" for names and state that in the diagnosis details.

  Description: {{{description}}}
  Photo: {{media url=photoDataUri}}`,
});

const diagnosePestFlow = ai.defineFlow(
  {
    name: 'diagnosePestFlow',
    inputSchema: PestDiagnosisInputSchema,
    outputSchema: PestDiagnosisOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
