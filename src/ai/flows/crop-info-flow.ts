'use server';

/**
 * @fileOverview A flow for fetching crop information.
 *
 * - getCropInfoList - Fetches a list of common crops.
 * - getCropDetails - Fetches detailed information for a specific crop.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Schema for a single crop in the list
const CropInfoSchema = z.object({
  name: z.string().describe('The common name of the crop.'),
  description: z.string().describe('A brief, one-sentence description of the crop.'),
});
export type CropInfo = z.infer<typeof CropInfoSchema>;

// Schema for the list of crops
const CropInfoListSchema = z.array(CropInfoSchema);
export type CropInfoList = z.infer<typeof CropInfoListSchema>;

// Schema for detailed crop information
const CropDetailsSchema = z.object({
  name: z.string(),
  cultivationDetails: z.string().describe('Detailed markdown-formatted information on soil preparation, sowing, and irrigation.'),
  pestAndDiseaseManagement: z.string().describe('Detailed markdown-formatted information on common pests and diseases and their management.'),
  postHarvestAndMarketInfo: z.string().describe('Detailed markdown-formatted information on harvesting, storage, and market value.'),
});
export type CropDetails = z.infer<typeof CropDetailsSchema>;


export async function getCropInfoList(): Promise<CropInfoList> {
  return getCropInfoListFlow();
}

export async function getCropDetails(cropName: string): Promise<CropDetails> {
  return getCropDetailsFlow({ name: cropName });
}


const getCropInfoListFlow = ai.defineFlow(
  {
    name: 'getCropInfoListFlow',
    outputSchema: CropInfoListSchema,
  },
  async () => {
    const { output } = await ai.generate({
      prompt: `Generate a list of 12 common agricultural crops grown in India. For each crop, provide its name and a brief, one-sentence description.`,
      output: { schema: CropInfoListSchema },
    });
    return output || [];
  }
);


const getCropDetailsFlow = ai.defineFlow(
  {
    name: 'getCropDetailsFlow',
    inputSchema: z.object({ name: z.string() }),
    outputSchema: CropDetailsSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
        prompt: `You are an agriculture expert. Provide detailed information for the crop: ${input.name}. 
        Organize the information into the following sections, using markdown for formatting:
        1.  **Cultivation Details**: Cover soil preparation, seed treatment, sowing time and method, and irrigation schedule.
        2.  **Pest and Disease Management**: Describe common pests and diseases and recommend organic and chemical control methods.
        3.  **Post-Harvest and Market Information**: Explain harvesting techniques, storage best practices, and typical market prices/demand.
        
        Ensure the content is practical and easy for a farmer in India to understand.`,
        output: { schema: CropDetailsSchema },
    });
    return { ...output!, name: input.name };
  }
);
