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
  url: z.string().url().describe('A placeholder URL to the full article.'),
});

export type AgriNewsArticle = z.infer<typeof AgriNewsArticleSchema>;

const AgriNewsOutputSchema = z.array(AgriNewsArticleSchema);

export async function getAgriNews(): Promise<AgriNewsArticle[]> {
  return getAgriNewsFlow();
}

const getAgriNewsFlow = ai.defineFlow(
  {
    name: 'getAgriNewsFlow',
    outputSchema: AgriNewsOutputSchema,
  },
  async () => {
    const { output } = await ai.generate({
      prompt: `You are an agriculture news reporter. Generate a list of 3 recent and relevant news articles for Indian farmers. Provide a headline, a short summary, and a placeholder URL for each.`,
      output: { schema: AgriNewsOutputSchema },
    });
    return output!;
  }
);
