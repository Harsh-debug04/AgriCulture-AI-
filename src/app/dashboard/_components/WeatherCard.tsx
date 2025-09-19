// src/app/dashboard/_components/WeatherCard.tsx
'use client';
import { useState, useEffect } from 'react';
import { getWeatherForecast, WeatherForecast } from '@/ai/flows/weather-flow';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Sun, Cloud, CloudRain, Wind, Droplets, MapPin, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const weatherIcons: { [key: string]: React.ElementType } = {
  'sunny': Sun,
  'clear': Sun,
  'partly cloudy': Cloud,
  'cloudy': Cloud,
  'rain': CloudRain,
  'default': Sun,
};

function WeatherIcon({ condition }: { condition: string }) {
  const conditionLower = condition.toLowerCase();
  for (const key in weatherIcons) {
    if (conditionLower.includes(key)) {
      const Icon = weatherIcons[key];
      return <Icon className="w-8 h-8 text-yellow-500" />;
    }
  }
  const Icon = weatherIcons['default'];
  return <Icon className="w-8 h-8 text-yellow-500" />;
}

export default function WeatherCard({ onRemove }: { onRemove: () => void }) {
  const [location, setLocation] = useState('New Delhi');
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchWeather = async (loc: string) => {
    try {
      setLoading(true);
      const data = await getWeatherForecast({ location: loc });
      setForecast(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to load weather for ${loc}.`,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(location);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      fetchWeather(location.trim());
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
            <CardTitle>Weather</CardTitle>
            <CardDescription>Current conditions and forecast.</CardDescription>
        </div>
        <Button variant="ghost" size="icon" className="ml-auto" onClick={onRemove}>
            <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
         <form onSubmit={handleSearch} className="flex w-full items-center space-x-2 mb-4">
            <Input
            type="text"
            placeholder="Enter location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            />
            <Button type="submit" size="icon" disabled={loading}>
                {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <MapPin className="h-4 w-4"/>}
            </Button>
        </form>
        {loading ? (
            <div className="flex justify-center items-center h-40">
                <Loader2 size={32} className="animate-spin text-primary" />
            </div>
        ) : forecast ? (
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
                    <div>
                        <p className="text-4xl font-bold">{forecast.current.temperature}°C</p>
                        <p className="text-md text-muted-foreground">{forecast.current.condition}</p>
                    </div>
                    <WeatherIcon condition={forecast.current.condition} />
                </div>
                 <div className="grid grid-cols-5 gap-2 text-center">
                    {forecast.daily.slice(0, 5).map(day => (
                        <div key={day.date} className="flex flex-col items-center p-2 bg-card rounded-lg border">
                            <p className="font-bold text-sm">{format(new Date(day.date), 'EEE')}</p>
                            <WeatherIcon condition={day.condition} />
                            <p className="text-sm font-bold mt-1">{day.temperature.high}°</p>
                        </div>
                    ))}
                </div>
            </div>
        ) : (
             <div className="text-center text-muted-foreground py-10">
                <p>Could not load weather.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
