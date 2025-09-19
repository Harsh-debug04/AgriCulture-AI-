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
import { useLanguage } from '../language-context';
import { translations } from '@/lib/translations';

export default function PestControlPage() {
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<PestDiagnosisOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations].pestDiagnosisPage;

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
        title: t.missingInfo,
        description: t.missingInfoDesc,
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
        title: t.diagnosisFailed,
        description: t.diagnosisFailedDesc,
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
                <p>{t.status.notAPlant}</p>
            </div>
        )
    }

    if (diagnosis.diagnosis.isHealthy) {
      return (
        <div className="flex items-center gap-2 text-lg text-green-600 dark:text-green-400">
          <CheckCircle />
          <p>{t.status.healthy}</p>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2 text-lg text-red-600 dark:text-red-400">
          <XCircle />
          <p>{t.status.unhealthy}</p>
        </div>
      );
    }
  };


  return (
      <main className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-surface-light dark:bg-surface-dark shadow-card dark:shadow-card-dark rounded-2xl">
          <CardHeader>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription>{t.description}</CardDescription>
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
                  <p>{t.uploadPrompt}</p>
                   {placeholderImage && <p className="text-xs">{t.usePlaceholder}</p>}
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
                    }}>{t.usePlaceholder}</Button>
                </div>
            )}


            <Textarea
              placeholder={t.symptomPlaceholder}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
            <div className="flex gap-2">
                <Button onClick={handleDiagnose} disabled={loading || !imagePreview || !description} className="w-full bg-primary-green hover:bg-primary-green/90">
                {loading ? <Loader2 className="animate-spin" /> : t.diagnoseButton}
                </Button>
                <Button onClick={handleReset} variant="outline" className="w-full">
                    {t.resetButton}
                </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-light dark:bg-surface-dark shadow-card dark:shadow-card-dark rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles className="text-primary-green"/> {t.aiResultTitle}</CardTitle>
            <CardDescription>{t.aiResultDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 size={48} className="animate-spin text-primary-green" />
              </div>
            ) : diagnosis ? (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg">{t.identification}</h3>
                   <div className="flex justify-between items-center">
                      <p><strong>{t.commonName}:</strong> {diagnosis.identification.isPlant ? diagnosis.identification.commonName : 'N/A'}</p>
                      {renderDiagnosisStatus()}
                   </div>
                  <p className="text-sm text-subtext-light dark:text-subtext-dark"><strong>{t.latinName}:</strong> {diagnosis.identification.isPlant ? diagnosis.identification.latinName : 'N/A'}</p>
                </div>
                <Separator/>
                <div>
                  <h3 className="font-semibold text-lg">{t.diagnosisDetails}</h3>
                   <Markdown text={diagnosis.diagnosis.details}/>
                </div>
                {diagnosis.diagnosis.remedy && diagnosis.diagnosis.remedy.length > 2 && <Separator/>}
                {diagnosis.diagnosis.remedy && diagnosis.diagnosis.remedy.length > 2 &&
                    <div>
                    <h3 className="font-semibold text-lg">{t.remedy}</h3>
                    <Markdown text={diagnosis.diagnosis.remedy} />
                    </div>
                }
              </div>
            ) : (
              <div className="text-center text-subtext-light dark:text-subtext-dark py-16">
                <p>{t.resultsAppearHere}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
  );
}
