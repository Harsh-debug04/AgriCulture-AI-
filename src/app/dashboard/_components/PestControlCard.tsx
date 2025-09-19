// src/app/dashboard/_components/PestControlCard.tsx
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Bug, X } from 'lucide-react';

export default function PestControlCard({ onRemove }: { onRemove: () => void }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
         <div className="grid gap-2">
            <CardTitle>Pest & Disease</CardTitle>
            <CardDescription>Diagnose plant issues.</CardDescription>
        </div>
        <Button variant="ghost" size="icon" className="ml-auto" onClick={onRemove}>
            <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center space-y-4 h-full">
            <Bug className="w-16 h-16 text-primary" />
            <p className="text-muted-foreground">
                Got a sick plant? Upload a photo and get an AI-powered diagnosis.
            </p>
            <Button asChild>
                <Link href="/pest-control">Start Diagnosis</Link>
            </Button>
      </CardContent>
    </Card>
  );
}
