// src/app/pest-control/page.tsx
'use client';
import { useState, useRef } from 'react';
import { diagnosePest, PestDiagnosisOutput } from '@/ai/flows/pest-diagnosis-flow';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload, CheckCircle, AlertTriangle, XCircle, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Markdown } from '@/components/ui/markdown';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Separator } from '@/components/ui/separator';

export default function PestControlPage() {
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<PestDiagnosisOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const placeholderImage = PlaceHolderImages.find(img => img.id === 'pest-placeholder');


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiagnose = async () => {
    if (!imagePreview || !description) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please provide both an image and a description.',
      });
      return;
    }

    setLoading(true);
    setDiagnosis(null);

    try {
        const result = await diagnosePest({
          photoDataUri: imagePreview,
          description: description,
        });
        setDiagnosis(result);
    } catch (error) {
      console.error("Error diagnosing pest:", error);
      toast({
        variant: 'destructive',
        title: 'Diagnosis Failed',
        description: 'An error occurred during diagnosis. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setDescription('');
    setImageFile(null);
    setImagePreview(null);
    setDiagnosis(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  const renderDiagnosisStatus = () => {
    if(!diagnosis) return null;

    if(!diagnosis.identification.isPlant) {
        return (
            <div className="flex items-center gap-2 text-lg text-orange-600 dark:text-orange-400">
                <AlertTriangle />
                <p>Not a plant</p>
            </div>
        )
    }

    if (diagnosis.diagnosis.isHealthy) {
      return (
        <div className="flex items-center gap-2 text-lg text-green-600 dark:text-green-400">
          <CheckCircle />
          <p>Healthy</p>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2 text-lg text-red-600 dark:text-red-400">
          <XCircle />
          <p>Unhealthy</p>
        </div>
      );
    }
  };


  return (
      <main className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-surface-light dark:bg-surface-dark shadow-card dark:shadow-card-dark rounded-2xl">
          <CardHeader>
            <CardTitle>Submit for Diagnosis</CardTitle>
            <CardDescription>Upload a photo of the affected plant and describe the issue.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={() => fileInputRef.current?.click()}
            >
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {imagePreview ? (
                <Image src={imagePreview} alt="Plant preview" width={400} height={300} className="mx-auto rounded-md" />
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <Upload size={40} />
                  <p>Click to upload an image</p>
                   {placeholderImage && <p className="text-xs">or use our placeholder image</p>}
                </div>
              )}
            </div>
            {placeholderImage && !imagePreview &&(
                <div className="text-center">
                    <Button variant="link" onClick={() => {
                        fetch(placeholderImage.imageUrl)
                        .then(res => res.blob())
                        .then(blob => {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                setImagePreview(reader.result as string);
                            };
                            reader.readAsDataURL(blob);
                        })
                    }}>Use placeholder image</Button>
                </div>
            )}


            <Textarea
              placeholder="Describe the symptoms, e.g., 'Yellow spots on leaves, black insects on the stem...'"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
            <div className="flex gap-2">
                <Button onClick={handleDiagnose} disabled={loading || !imagePreview || !description} className="w-full bg-primary-green hover:bg-primary-green/90">
                {loading ? <Loader2 className="animate-spin" /> : 'Diagnose'}
                </Button>
                <Button onClick={handleReset} variant="outline" className="w-full">
                    Reset
                </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-light dark:bg-surface-dark shadow-card dark:shadow-card-dark rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles className="text-primary-green"/> AI Diagnosis Result</CardTitle>
            <CardDescription>Our AI will analyze the image and description to identify potential issues.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 size={48} className="animate-spin text-primary-green" />
              </div>
            ) : diagnosis ? (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg">Identification</h3>
                   <div className="flex justify-between items-center">
                      <p><strong>Common Name:</strong> {diagnosis.identification.isPlant ? diagnosis.identification.commonName : 'N/A'}</p>
                      {renderDiagnosisStatus()}
                   </div>
                  <p className="text-sm text-subtext-light dark:text-subtext-dark"><strong>Latin Name:</strong> {diagnosis.identification.isPlant ? diagnosis.identification.latinName : 'N/A'}</p>
                </div>
                <Separator/>
                <div>
                  <h3 className="font-semibold text-lg">Diagnosis Details</h3>
                   <Markdown text={diagnosis.diagnosis.details}/>
                </div>
                {diagnosis.diagnosis.remedy && diagnosis.diagnosis.remedy.length > 2 && <Separator/>}
                {diagnosis.diagnosis.remedy && diagnosis.diagnosis.remedy.length > 2 &&
                    <div>
                    <h3 className="font-semibold text-lg">Recommended Actions</h3>
                    <Markdown text={diagnosis.diagnosis.remedy} />
                    </div>
                }
              </div>
            ) : (
              <div className="text-center text-subtext-light dark:text-subtext-dark py-16">
                <p>Results will appear here after diagnosis.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
  );
}
