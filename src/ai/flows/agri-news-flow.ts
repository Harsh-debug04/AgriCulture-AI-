'use server';

/**
 * @fileOverview A flow for generating recent agricultural news articles.
 *
 * - getAgriNews - Generates a list of agricultural news articles.
 * - AgriNewsArticle - The type for a single news article.
 * - AgriNewsOutputSchema - The output schema for the getAgriNews flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AgriNewsArticleSchema = z.object({
  headline: z.string().describe('The headline of the news article.'),
  summary: z.string().describe('A brief summary of the news article.'),
  url: z.string().url().describe('The actual URL to the full article.'),
});

export type AgriNewsArticle = z.infer<typeof AgriNewsArticleSchema>;

const AgriNewsOutputSchema = z.array(AgriNewsArticleSchema);

export async function getAgriNews(): Promise<AgriNewsArticle[]> {
  return getAgriNewsFlow();
}

const getRealtimeAgriNewsTool = ai.defineTool(
  {
    name: 'getRealtimeAgriNews',
    description: 'Get the latest agricultural news from India by searching the web.',
    outputSchema: AgriNewsOutputSchema,
  },
  async () => {
    const { output } = await ai.generate({
      prompt: `You are an agriculture news reporter. Search the web to find 3 relevant news articles for Indian farmers from September 19, 2025. Provide a real headline, a short summary, and the actual URL for each article.`,
      output: { schema: AgriNewsOutputSchema },
    });
    return output || [];
  }
);


const getAgriNewsFlow = ai.defineFlow(
  {
    name: 'getAgriNewsFlow',
    outputSchema: AgriNewsOutputSchema,
  },
  async () => {
    return getRealtimeAgriNewsTool();
  }
);
