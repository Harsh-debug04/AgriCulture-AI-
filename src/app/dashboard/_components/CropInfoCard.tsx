// src/app/dashboard/_components/CropInfoCard.tsx
'use client';
import { useState, useEffect } from 'react';
import { getCropInfoList, CropInfo } from '@/ai/flows/crop-info-flow';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function CropInfoCard({ onRemove }: { onRemove: () => void }) {
  const [crops, setCrops] = useState<CropInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchCrops() {
      try {
        setLoading(true);
        const cropList = await getCropInfoList();
        setCrops(cropList.slice(0, 4)); // Show a smaller list for the card
      } catch (error) {
        console.error("Error fetching crop list:", error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load crop information.',
        });
      } finally {
        setLoading(false);
      }
    }
    fetchCrops();
  }, [toast]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
            <CardTitle>Crop Information</CardTitle>
            <CardDescription>Learn about different crops.</CardDescription>
        </div>
        <Button variant="ghost" size="icon" className="ml-auto" onClick={onRemove}>
            <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
            <div className="flex justify-center items-center h-40">
                <Loader2 size={32} className="animate-spin text-primary" />
            </div>
        ) : (
          <div className="space-y-4">
            <ul className="grid gap-3">
              {crops.map((crop) => (
                <li key={crop.name} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{crop.name}</span>
                    <Link href={`/crop-info?name=${encodeURIComponent(crop.name)}`}>
                        <Button variant="outline" size="sm">View</Button>
                    </Link>
                </li>
               ))}
            </ul>
            <Button asChild className="w-full">
                <Link href="/crop-info">View All Crops</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
