// src/app/weather/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { getWeatherForecast, WeatherForecast } from '@/ai/flows/weather-flow';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Sun, Cloud, CloudRain, CloudSnow, Wind, Droplets, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { format } from 'date-fns';

const weatherIcons: { [key: string]: React.ElementType } = {
  'sunny': Sun,
  'clear': Sun,
  'partly cloudy': Cloud,
  'cloudy': Cloud,
  'rain': CloudRain,
  'snow': CloudSnow,
  'windy': Wind,
  'default': Sun,
};

function WeatherIcon({ condition }: { condition: string }) {
  const conditionLower = condition.toLowerCase();
  for (const key in weatherIcons) {
    if (conditionLower.includes(key)) {
      const Icon = weatherIcons[key];
      return <Icon className="w-12 h-12 text-yellow-500" />;
    }
  }
  const Icon = weatherIcons['default'];
  return <Icon className="w-12 h-12 text-yellow-500" />;
}

export default function WeatherPage() {
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
    // We only want to run this on initial load with the default location
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      fetchWeather(location.trim());
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="p-4 border-b flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/"><ArrowLeft /></Link>
        </Button>
        <h1 className="text-2xl font-bold">Weather Forecast</h1>
      </header>
      <main className="p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2 mb-8">
                <Input
                type="text"
                placeholder="Enter a location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                />
                <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : 'Search'}
                </Button>
            </form>

            {loading ? (
                <Card className="animate-pulse">
                    <CardHeader>
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mt-2"></div>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                            </div>
                            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            {Array.from({length:5}).map((_, i) => (
                                <div key={i} className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 space-y-2">
                                     <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
                                     <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto"></div>
                                     <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ) : forecast ? (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl flex items-center gap-2"><MapPin size={28}/> {forecast.location}</CardTitle>
                        <CardDescription>Current conditions and 5-day forecast.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {/* Current Weather */}
                        <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-primary/10 rounded-xl">
                            <div className="flex items-center gap-6">
                                <WeatherIcon condition={forecast.current.condition} />
                                <div>
                                    <p className="text-6xl font-bold">{forecast.current.temperature}°C</p>
                                    <p className="text-xl text-muted-foreground">{forecast.current.condition}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-6 sm:mt-0 text-lg">
                                <div className="flex items-center gap-2"><Wind size={20} /> Wind</div>
                                <div className="font-semibold">{forecast.current.windSpeed} km/h</div>
                                <div className="flex items-center gap-2"><Droplets size={20} /> Humidity</div>
                                <div className="font-semibold">{forecast.current.humidity}%</div>
                            </div>
                        </div>

                        {/* 5-Day Forecast */}
                        <div>
                             <h3 className="text-xl font-bold mb-4">5-Day Forecast</h3>
                             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                {forecast.daily.slice(0, 5).map(day => (
                                    <div key={day.date} className="flex flex-col items-center p-4 bg-card rounded-lg border">
                                        <p className="font-bold text-lg">{format(new Date(day.date), 'EEE')}</p>
                                        <p className="text-sm text-muted-foreground mb-2">{format(new Date(day.date), 'd MMM')}</p>
                                        <WeatherIcon condition={day.condition} />
                                        <p className="text-2xl font-bold mt-2">{day.temperature.high}°</p>
                                        <p className="text-muted-foreground">{day.temperature.low}°</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                 <div className="text-center text-muted-foreground py-16">
                    <p>Could not load weather forecast. Please try a different location.</p>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}
