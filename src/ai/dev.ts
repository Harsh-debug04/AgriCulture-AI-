import { config } from 'dotenv';
config();

import '@/ai/flows/agriculture-query.ts';
import '@/ai/flows/market-data-flow.ts';
import '@/ai/flows/agri-news-flow.ts';
import '@/ai/flows/weather-flow.ts';
import '@/ai/flows/crop-info-flow.ts';
import '@/ai/flows/pest-diagnosis-flow.ts';
import '@/ai/flows/tts-flow.ts';
