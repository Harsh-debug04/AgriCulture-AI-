// src/app/pest-disease/page.tsx
'use client';

import { useState, useTransition, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { identifyPestsAndDiseases } from '@/ai/flows/pest-disease-identification';
import type { IdentifyPestsAndDiseasesOutput } from '@/ai/flows/pest-disease-identification';
import { useToast } from '@/hooks/use-toast';
import { Upload, Bug, Loader2, Lightbulb, CheckCircle, ShieldAlert } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Progress } from '@/components/ui/progress';

export default function PestDiseasePage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<IdentifyPestsAndDiseasesOutput | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const placeholderImage = PlaceHolderImages.find(p => p.id === 'pest-placeholder');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setResult(null);
    }
  };

  const handleSubmit = () => {
    if (!file || !preview) {
        toast({
            title: "No file selected",
            description: "Please select an image file to analyze.",
            variant: "destructive",
        })
      return;
    }
    
    setResult(null);
    startTransition(async () => {
      try {
        const identification = await identifyPestsAndDiseases({ photoDataUri: preview });
        setResult(identification);
      } catch (e) {
        console.error(e);
        toast({
            title: "Error",
            description: "Failed to identify pest/disease. Please try again.",
            variant: "destructive",
        })
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="flex flex-col gap-6">
         <div>
            <h1 className="font-headline text-3xl font-bold">Pest & Disease Identification</h1>
            <p className="text-muted-foreground mt-1">
            Upload a photo of your plant to get an AI-powered diagnosis.
            </p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Upload Plant Image</CardTitle>
                <CardDescription>Click the area below or drag and drop an image.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div 
                    className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    {preview ? (
                        <div className="relative aspect-video w-full">
                            <Image src={preview} alt="Plant preview" layout="fill" objectFit="contain" className="rounded-md" />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Upload className="w-12 h-12"/>
                            <p className="font-medium">Click to upload or drag and drop</p>
                            <p className="text-sm">PNG, JPG, or WEBP</p>
                        </div>
                    )}
                </div>
                 <Button onClick={handleSubmit} disabled={isPending || !file} className="w-full">
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Bug className="mr-2 h-4 w-4" />
                      Identify Pest/Disease
                    </>
                  )}
                </Button>
            </CardContent>
        </Card>
      </div>
      <div className="lg:sticky top-8">
        <Card>
          <CardHeader>
            <CardTitle>Diagnosis Result</CardTitle>
            <CardDescription>
              AI analysis of the uploaded plant image will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[400px]">
             {isPending && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <Bug className="w-12 h-12 text-primary animate-pulse"/>
                    <p className="mt-4 font-medium">Scanning for pests and diseases...</p>
                    <p className="text-sm text-muted-foreground">This may take a moment.</p>
                </div>
            )}
            {!isPending && !result && (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <Lightbulb className="w-12 h-12 text-muted-foreground"/>
                    <p className="mt-4 font-medium text-muted-foreground">Your diagnosis will be shown here.</p>
                </div>
            )}
            {result && (
                <div className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg text-primary">Identified Issue</h3>
                        <p className="text-2xl font-bold font-headline mt-1">{result.pestOrDisease}</p>
                    </div>
                     <div>
                        <h3 className="font-semibold text-lg text-primary">Confidence Score</h3>
                        <div className="flex items-center gap-2 mt-2">
                          <Progress value={result.confidence * 100} className="w-full" />
                          <span className="font-bold text-sm text-primary">{Math.round(result.confidence * 100)}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {result.confidence > 0.8 ? <><CheckCircle className="inline-block h-3 w-3 mr-1 text-green-600"/>High confidence match.</> : <><ShieldAlert className="inline-block h-3 w-3 mr-1 text-yellow-600"/>Confidence is moderate. Consider a second opinion.</>}
                        </p>
                    </div>
                     <div>
                        <h3 className="font-semibold text-lg text-primary">Treatment Options</h3>
                        <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-foreground/80">
                            {result.treatmentOptions.map((option, index) => (
                                <li key={index}>{option}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
