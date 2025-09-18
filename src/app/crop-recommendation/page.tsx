// src/app/crop-recommendation/page.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { recommendCrops } from '@/ai/flows/crop-recommendation';
import type { CropRecommendationOutput } from '@/ai/flows/crop-recommendation';
import { useState, useTransition } from 'react';
import { Sprout, Loader2, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FormSchema = z.object({
  soilType: z.string({ required_error: 'Please select a soil type.' }),
  historicalWeatherData: z.string().min(10, 'Please provide some weather data.'),
  marketDemand: z.string().min(10, 'Please provide some market demand info.'),
});

export default function CropRecommendationPage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<CropRecommendationOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
        soilType: 'alluvial',
        historicalWeatherData: 'Average annual rainfall: 1200mm. Average temperature: 25°C. Humidity: 70%. Region: Indo-Gangetic Plain.',
        marketDemand: 'High demand for wheat and rice. Medium demand for sugarcane and pulses. Low demand for exotic vegetables.',
    }
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setResult(null);
    startTransition(async () => {
      try {
        const recommendation = await recommendCrops(data);
        setResult(recommendation);
      } catch (e) {
        console.error(e);
        toast({
            title: "Error",
            description: "Failed to get recommendations. Please try again.",
            variant: "destructive",
        })
      }
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="flex flex-col gap-6">
        <div>
            <h1 className="font-headline text-3xl font-bold">Crop Recommendation</h1>
            <p className="text-muted-foreground mt-1">
            Fill in the details to get AI-powered crop suggestions.
            </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Farm Details</CardTitle>
            <CardDescription>Provide information about your farm's conditions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="soilType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Soil Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a soil type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="alluvial">Alluvial Soil</SelectItem>
                          <SelectItem value="black">Black Soil</SelectItem>
                          <SelectItem value="red">Red Soil</SelectItem>
                          <SelectItem value="laterite">Laterite Soil</SelectItem>
                          <SelectItem value="desert">Desert Soil</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="historicalWeatherData"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Historical Weather Data</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Average rainfall, temperature, humidity for your region."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Be as detailed as possible for better results.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="marketDemand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Market Demand</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., High demand for wheat, medium for maize..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                       <FormDescription>
                        Information on crop prices and demand in your area.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sprout className="mr-2 h-4 w-4" />
                      Get Recommendations
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="lg:sticky top-8">
        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Recommendations</CardTitle>
            <CardDescription>
              Our analysis of your farm's conditions will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[400px]">
            {isPending && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <Sprout className="w-12 h-12 text-primary animate-bounce"/>
                    <p className="mt-4 font-medium">Analyzing your data...</p>
                    <p className="text-sm text-muted-foreground">This may take a moment.</p>
                </div>
            )}
            {!isPending && !result && (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <Lightbulb className="w-12 h-12 text-muted-foreground"/>
                    <p className="mt-4 font-medium text-muted-foreground">Your recommended crops will be shown here.</p>
                </div>
            )}
            {result && (
                <div className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg text-primary">Recommended Crops</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {result.recommendedCrops.map(crop => (
                                <div key={crop} className="bg-primary/10 text-primary font-medium px-3 py-1 rounded-full text-sm">
                                    {crop}
                                </div>
                            ))}
                        </div>
                    </div>
                     <div>
                        <h3 className="font-semibold text-lg text-primary">Reasoning</h3>
                        <p className="text-sm text-foreground/80 whitespace-pre-wrap">{result.reasoning}</p>
                    </div>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
