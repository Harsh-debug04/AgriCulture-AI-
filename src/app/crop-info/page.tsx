// src/app/crop-info/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { getCropInfoList, getCropDetails, CropInfo, CropDetails } from '@/ai/flows/crop-info-flow';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Markdown } from '@/components/ui/markdown';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function CropInfoPage() {
  const [crops, setCrops] = useState<CropInfo[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<CropInfo | null>(null);
  const [cropDetails, setCropDetails] = useState<CropDetails | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    async function fetchCrops() {
      try {
        setLoadingList(true);
        const cropList = await getCropInfoList();
        setCrops(cropList);
      } catch (error) {
        console.error("Error fetching crop list:", error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load crop information.',
        });
      } finally {
        setLoadingList(false);
      }
    }
    fetchCrops();
  }, [toast]);

  const handleCropSelect = async (crop: CropInfo) => {
    setSelectedCrop(crop);
    setLoadingDetails(true);
    setCropDetails(null);
    try {
      const details = await getCropDetails(crop.name);
      setCropDetails(details);
    } catch (error) {
      console.error(`Error fetching details for ${crop.name}:`, error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to load details for ${crop.name}.`,
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  const filteredCrops = crops.filter(crop =>
    crop.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="p-4 border-b flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/"><ArrowLeft /></Link>
        </Button>
        <h1 className="text-2xl font-bold">Crop Information</h1>
      </header>
      <main className="p-4 md:p-6">
        {selectedCrop ? (
          <div>
            <Button variant="outline" onClick={() => { setSelectedCrop(null); setCropDetails(null); }} className="mb-4 flex items-center gap-2">
              <ArrowLeft size={16} /> Back to Crop List
            </Button>
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">{selectedCrop.name}</CardTitle>
                <CardDescription>{selectedCrop.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingDetails ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin" size={48} />
                  </div>
                ) : cropDetails ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Cultivation Details</h3>
                      <Markdown text={cropDetails.cultivationDetails} />
                    </div>
                    <Separator />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Pest and Disease Management</h3>
                      <Markdown text={cropDetails.pestAndDiseaseManagement} />
                    </div>
                     <Separator />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Post-Harvest and Market Information</h3>
                      <Markdown text={cropDetails.postHarvestAndMarketInfo} />
                    </div>
                  </div>
                ) : (
                  <p>Could not load details for {selectedCrop.name}.</p>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <Input
              placeholder="Search for a crop..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
            {loadingList ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredCrops.map(crop => (
                  <Card key={crop.name} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleCropSelect(crop)}>
                    <CardHeader>
                      <CardTitle>{crop.name}</CardTitle>
                      <CardDescription>{crop.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
