// src/app/market-data/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { getMarketData, MarketData } from '@/ai/flows/market-data-flow';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const popularCommodities = ['Cotton', 'Soybean', 'Paddy', 'Wheat', 'Maize', 'Gram', 'Tur', 'Mustard'];

export default function MarketDataPage() {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    async function fetchMarketData() {
      try {
        setLoading(true);
        const data = await getMarketData(popularCommodities);
        setMarketData(data);
      } catch (error) {
        console.error("Error fetching market data:", error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load market data.',
        });
      } finally {
        setLoading(false);
      }
    }
    fetchMarketData();
  }, [toast]);
  
  const handleSearch = async (e: React.FormEvent) => {
      e.preventDefault();
      if(!searchTerm.trim()) return;
      
      try {
        setLoading(true);
        const data = await getMarketData([searchTerm, ...popularCommodities.filter(c => c.toLowerCase() !== searchTerm.toLowerCase())]);
        setMarketData(data);
      } catch (error) {
         console.error("Error searching market data:", error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to search for commodity.',
        });
      } finally {
          setLoading(false);
      }
  }

  const filteredData = marketData.filter(item => 
    item.commodity.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
        <header className="p-4 border-b flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/"><ArrowLeft /></Link>
          </Button>
          <h1 className="text-2xl font-bold">Market Data</h1>
        </header>
        <main className="p-4 md:p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Commodity Prices</CardTitle>
                    <CardDescription>Real-time prices from various mandis across India.</CardDescription>
                     <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2 pt-4">
                        <Input 
                            type="text" 
                            placeholder="Search for a commodity..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button type="submit" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : 'Search'}
                        </Button>
                    </form>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Commodity</TableHead>
                                <TableHead>Market (Mandi)</TableHead>
                                <TableHead className="text-right">Price (per quintal)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({length: 5}).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div></TableCell>
                                        <TableCell><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div></TableCell>
                                        <TableCell className="text-right"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 ml-auto"></div></TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                filteredData.map((item) => (
                                <TableRow key={`${item.commodity}-${item.location}`}>
                                    <TableCell className="font-medium">{item.commodity}</TableCell>
                                    <TableCell>{item.location}</TableCell>
                                    <TableCell className="text-right font-bold flex justify-end items-center gap-2">
                                        {item.trend === 'up' && <ArrowUp className="w-4 h-4 text-green-500" />}
                                        {item.trend === 'down' && <ArrowDown className="w-4 h-4 text-red-500" />}
                                        ₹{item.price.toLocaleString('en-IN')}
                                    </TableCell>
                                </TableRow>
                            )))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </main>
    </div>
  );
}
