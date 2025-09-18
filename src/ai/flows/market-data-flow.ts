'use server';

/**
 * @fileOverview A flow for fetching real-time market data for agricultural commodities.
 *
 * - getMarketData - Fetches market prices for a list of commodities.
 * - MarketData - The type for a single market data item.
 * - MarketDataInputSchema - The input schema for the getMarketData flow.
 * - MarketDataOutputSchema - The output schema for the getMarketData flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MarketDataSchema = z.object({
  commodity: z.string().describe('The name of the commodity, e.g., "Cotton"'),
  price: z.number().describe('The current market price per quintal.'),
  location: z.string().describe('The market location (mandi) for the price, e.g., "Gujarat, Rajkot Mandi"'),
  trend: z.enum(['up', 'down', 'stable']).describe('The recent price trend.'),
});

export type MarketData = z.infer<typeof MarketDataSchema>;

const MarketDataInputSchema = z.array(z.string());
const MarketDataOutputSchema = z.array(MarketDataSchema);

export async function getMarketData(commodities: string[]): Promise<MarketData[]> {
  return getMarketDataFlow(commodities);
}

const getCommodityPriceTool = ai.defineTool(
  {
    name: 'getCommodityPrice',
    description: 'Returns the current market value of an agricultural commodity in a specific region of India.',
    inputSchema: z.object({
      commodity: z.string().describe('The ticker symbol or name of the commodity, e.g., "cotton"'),
    }),
    outputSchema: MarketDataSchema,
  },
  async (input) => {
    // In a real application, you would fetch this data from a live API.
    // This is mock data for demonstration purposes.
    const mockData: Record<string, MarketData> = {
      cotton: {
        commodity: 'Cotton (Kapas)',
        price: 7200,
        location: 'Gujarat, Rajkot Mandi',
        trend: 'up',
      },
      soybean: {
        commodity: 'Soybean',
        price: 4550,
        location: 'Madhya Pradesh, Indore Mandi',
        trend: 'down',
      },
      paddy: {
        commodity: 'Paddy (Basmati)',
        price: 3800,
        location: 'Haryana, Karnal Mandi',
        trend: 'up',
      },
      wheat: {
        commodity: 'Wheat',
        price: 2150,
        location: 'Punjab, Ludhiana Mandi',
        trend: 'stable'
      }
    };
    const commodity = input.commodity.toLowerCase();
    if(mockData[commodity]){
        return mockData[commodity];
    }
    // Return a default if not found in mock data
    return {
        commodity: input.commodity,
        price: Math.floor(Math.random() * (10000 - 1000 + 1) + 1000),
        location: 'Unknown Mandi',
        trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable'
    }
  }
);

const getMarketDataFlow = ai.defineFlow(
  {
    name: 'getMarketDataFlow',
    inputSchema: MarketDataInputSchema,
    outputSchema: MarketDataOutputSchema,
  },
  async (commodities) => {
    const prices = await Promise.all(
        commodities.map(commodity => getCommodityPriceTool({commodity}))
    );
    return prices;
  }
);
