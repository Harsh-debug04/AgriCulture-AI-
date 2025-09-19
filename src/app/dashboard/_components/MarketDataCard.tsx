// src/app/dashboard/_components/MarketDataCard.tsx
'use client';
import { useState, useEffect } from 'react';
import { getMarketData, MarketData } from '@/ai/flows/market-data-flow';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowUp, ArrowDown, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

const popularCommodities = ['Cotton', 'Soybean', 'Paddy', 'Wheat'];

export default function MarketDataCard({ onRemove }: { onRemove: () => void }) {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [commodities, setCommodities] = useState(popularCommodities);
  const [newCommodity, setNewCommodity] = useState('');

  useEffect(() => {
    async function fetchMarketData() {
      if (commodities.length === 0) {
          setMarketData([]);
          setLoading(false);
          return;
      }
      try {
        setLoading(true);
        const data = await getMarketData(commodities);
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
  }, [toast, commodities]);

  const handleAddCommodity = (e: React.FormEvent) => {
    e.preventDefault();
    const commodityToAdd = newCommodity.trim();
    if (commodityToAdd && !commodities.find(c => c.toLowerCase() === commodityToAdd.toLowerCase())) {
        setCommodities([...commodities, commodityToAdd]);
    }
    setNewCommodity('');
  }

  const chartData = marketData.map(item => ({
      name: item.commodity.split(' ')[0],
      value: item.price,
      fill: `hsl(var(--primary) / ${Math.max(0.2, Math.random())})`
  }));
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
            <CardTitle>Market Data</CardTitle>
            <CardDescription>Real-time commodity prices.</CardDescription>
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
        ) : marketData.length > 0 ? (
           <ChartContainer config={{}} className="w-full h-48">
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: -20,
                  top: 10,
                  right: 10,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="value" radius={4} />
              </BarChart>
            </ChartContainer>
        ) : (
            <div className="text-center text-muted-foreground py-10">
                <p>No commodities selected.</p>
            </div>
        )}
        <div className="mt-4 space-y-2">
            <div className="flex flex-wrap gap-2">
                {commodities.map(c => (
                    <Badge key={c} variant="secondary" className="flex items-center gap-1">
                        {c}
                        <button onClick={() => setCommodities(commodities.filter(item => item !== c))}>
                            <X className="w-3 h-3"/>
                        </button>
                    </Badge>
                ))}
            </div>
            <form onSubmit={handleAddCommodity} className="flex w-full items-center space-x-2">
                <Input
                    type="text"
                    placeholder="Add commodity..."
                    value={newCommodity}
                    onChange={(e) => setNewCommodity(e.target.value)}
                />
                <Button type="submit" size="icon" disabled={!newCommodity.trim()}>
                    <Plus className="h-4 w-4"/>
                </Button>
            </form>
        </div>
      </CardContent>
    </Card>
  );
}
