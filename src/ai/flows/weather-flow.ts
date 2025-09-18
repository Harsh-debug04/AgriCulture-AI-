'use server';

/**
 * @fileOverview A flow for fetching a weather forecast.
 *
 * - getWeatherForecast - Fetches the weather for a given location.
 * - WeatherForecast - The type for the weather forecast data.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { addDays, format } from 'date-fns';

const WeatherInputSchema = z.object({
  location: z.string().describe('The city or area to get the weather for, e.g. "Mumbai, India"'),
});

const CurrentWeatherSchema = z.object({
  temperature: z.number().describe('The current temperature in Celsius.'),
  condition: z.string().describe('A brief description of the current weather, e.g., "Partly Cloudy".'),
  windSpeed: z.number().describe('The wind speed in km/h.'),
  humidity: z.number().describe('The humidity percentage.'),
});

const DailyForecastSchema = z.object({
  date: z.string().describe('The date for the forecast in YYYY-MM-DD format.'),
  temperature: z.object({
    high: z.number().describe('The high temperature for the day in Celsius.'),
    low: z.number().describe('The low temperature for the day in Celsius.'),
  }),
  condition: z.string().describe('A brief description of the weather for the day.'),
});

const WeatherForecastSchema = z.object({
  location: z.string().describe('The location of the forecast.'),
  current: CurrentWeatherSchema,
  daily: z.array(DailyForecastSchema).length(7).describe('A 7-day weather forecast.'),
});

export type WeatherForecast = z.infer<typeof WeatherForecastSchema>;

export async function getWeatherForecast(input: z.infer<typeof WeatherInputSchema>): Promise<WeatherForecast> {
  return getWeatherForecastFlow(input);
}


// Mock tool to simulate fetching weather data. In a real app, this would call a weather API.
const getRealtimeWeatherTool = ai.defineTool(
    {
        name: 'getRealtimeWeather',
        description: 'Gets the current weather and a 7-day forecast for a specified location.',
        inputSchema: WeatherInputSchema,
        outputSchema: WeatherForecastSchema,
    },
    async ({ location }) => {
        // This is mock data. A real implementation would use an external API.
        const generateWeather = () => {
            const conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Rain", "Windy"];
            const condition = conditions[Math.floor(Math.random() * conditions.length)];
            const temp = Math.floor(Math.random() * (35 - 15 + 1) + 15);
            return { condition, temp };
        };

        const current = {
            temperature: generateWeather().temp,
            condition: generateWeather().condition,
            windSpeed: Math.floor(Math.random() * 20) + 5,
            humidity: Math.floor(Math.random() * 50) + 40,
        };

        const daily = Array.from({ length: 7 }).map((_, i) => {
            const { condition, temp } = generateWeather();
            return {
                date: format(addDays(new Date(), i), 'yyyy-MM-dd'),
                temperature: {
                    high: temp + Math.floor(Math.random() * 5),
                    low: temp - Math.floor(Math.random() * 5),
                },
                condition,
            };
        });

        return {
            location,
            current,
            daily,
        };
    }
);


const getWeatherForecastFlow = ai.defineFlow(
  {
    name: 'getWeatherForecastFlow',
    inputSchema: WeatherInputSchema,
    outputSchema: WeatherForecastSchema,
  },
  async (input) => {
    return getRealtimeWeatherTool(input);
  }
);
