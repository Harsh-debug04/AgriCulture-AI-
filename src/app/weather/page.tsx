// src/app/weather/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { getWeatherForecast, WeatherForecast } from '@/ai/flows/weather-flow';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Sun, Cloud, CloudRain, CloudSnow, Wind, Droplets, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useLanguage } from '../language-context';
import { translations } from '@/lib/translations';


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
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations].weatherPage;

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
        description: `${t.error} ${loc}.`,
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
      <main className="p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl">{t.title}</CardTitle>
                    <CardDescription>{t.description}</CardDescription>
                     <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2 pt-4">
                        <Input
                        type="text"
                        placeholder={t.searchPlaceholder}
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        />
                        <Button type="submit" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : t.searchButton}
                        </Button>
                    </form>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 size={48} className="animate-spin text-primary" />
                        </div>
                    ) : forecast ? (
                        <div className="space-y-8">
                             {/* Current Weather */}
                            <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-primary/10 rounded-xl">
                                <div className="flex items-center gap-6">
                                    <WeatherIcon condition={forecast.current.condition} />
                                    <div>
                                        <p className="text-6xl font-bold">{forecast.current.temperature}°C</p>
                                        <p className="text-xl text-muted-foreground">{forecast.current.condition}</p>
                                        <p className="font-semibold mt-2 flex items-center gap-2"><MapPin size={16}/> {forecast.location}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-6 sm:mt-0 text-lg">
                                    <div className="flex items-center gap-2"><Wind size={20} /> {t.current.wind}</div>
                                    <div className="font-semibold">{forecast.current.windSpeed} km/h</div>
                                    <div className="flex items-center gap-2"><Droplets size={20} /> {t.current.humidity}</div>
                                    <div className="font-semibold">{forecast.current.humidity}%</div>
                                </div>
                            </div>
                            {/* 7-Day Forecast */}
                            <div>
                                <h3 className="text-xl font-bold mb-4">{t.forecast}</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
                                    {forecast.daily.map(day => (
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
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground py-16">
                            <p>{t.loadError}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
