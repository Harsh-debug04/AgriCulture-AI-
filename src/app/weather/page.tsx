import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Cloud,
  CloudRain,
  CloudSun,
  Droplets,
  Gauge,
  Sun,
  Sunrise,
  Sunset,
  Thermometer,
  Wind,
  AlertTriangle,
} from 'lucide-react';

const hourlyForecast = [
  { time: '3 PM', temp: 28, icon: <CloudSun className="w-6 h-6 text-yellow-500" /> },
  { time: '4 PM', temp: 27, icon: <Cloud className="w-6 h-6 text-gray-400" /> },
  { time: '5 PM', temp: 26, icon: <Cloud className="w-6 h-6 text-gray-400" /> },
  { time: '6 PM', temp: 25, icon: <CloudRain className="w-6 h-6 text-blue-500" /> },
  { time: '7 PM', temp: 24, icon: <CloudSun className="w-6 h-6 text-yellow-500" /> },
  { time: '8 PM', temp: 23, icon: <Sun className="w-6 h-6 text-yellow-500" /> },
];

const dailyForecast = [
  { day: 'Tue', high: 29, low: 22, icon: <CloudSun className="w-8 h-8 text-yellow-500" /> },
  { day: 'Wed', high: 30, low: 23, icon: <Sun className="w-8 h-8 text-yellow-500" /> },
  { day: 'Thu', high: 28, low: 21, icon: <CloudRain className="w-8 h-8 text-blue-500" /> },
  { day: 'Fri', high: 31, low: 24, icon: <Sun className="w-8 h-8 text-yellow-500" /> },
  { day: 'Sat', high: 29, low: 23, icon: <CloudSun className="w-8 h-8 text-yellow-500" /> },
];

export default function WeatherPage() {
  return (
    <div className="flex flex-col gap-6">
       <div>
        <h1 className="font-headline text-3xl font-bold">Weather Advisory</h1>
        <p className="text-muted-foreground mt-1">
          Detailed weather information for Pune, Maharashtra.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>5-Day Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-around items-center text-center">
                        {dailyForecast.map(day => (
                            <div key={day.day} className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-muted/50">
                                <span className="font-semibold text-muted-foreground">{day.day}</span>
                                {day.icon}
                                <div className="font-bold">{day.high}°<span className="text-muted-foreground">/{day.low}°</span></div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

             <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Hourly Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                     <div className="flex justify-around items-center text-center overflow-x-auto pb-2">
                        {hourlyForecast.map(hour => (
                             <div key={hour.time} className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-muted/50 min-w-[60px]">
                                <span className="text-sm font-medium text-muted-foreground">{hour.time}</span>
                                {hour.icon}
                                <span className="font-bold">{hour.temp}°C</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle className="text-amber-600 flex items-center gap-2"><AlertTriangle/>Special Advisory</CardTitle>
                </CardHeader>
                <CardContent>
                    <h3 className="font-semibold">High Humidity Warning</h3>
                    <p className="text-muted-foreground mt-1">High humidity (above 85%) expected over the next 48 hours. This may increase the risk of fungal diseases for vegetable crops. Ensure good air circulation and consider preventative fungicidal sprays if necessary.</p>
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Current Conditions</CardTitle>
                    <CardDescription>As of 2:30 PM</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center">
                     <CloudSun className="w-24 h-24 text-yellow-500 mb-4" />
                     <p className="text-6xl font-bold">28°C</p>
                     <p className="text-lg text-muted-foreground">Partly Cloudy</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Detailed Metrics</CardTitle>
                </CardHeader>
                 <CardContent>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className="flex items-center gap-2"><Thermometer className="w-4 h-4 text-primary"/> Feels Like</TableCell>
                                <TableCell className="text-right font-medium">30°C</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell className="flex items-center gap-2"><Wind className="w-4 h-4 text-primary"/> Wind</TableCell>
                                <TableCell className="text-right font-medium">12 km/h SW</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell className="flex items-center gap-2"><Droplets className="w-4 h-4 text-primary"/> Humidity</TableCell>
                                <TableCell className="text-right font-medium">65%</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="flex items-center gap-2"><Gauge className="w-4 h-4 text-primary"/> Pressure</TableCell>
                                <TableCell className="text-right font-medium">1012 hPa</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell className="flex items-center gap-2"><Sun className="w-4 h-4 text-primary"/> UV Index</TableCell>
                                <TableCell className="text-right font-medium">High</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                 </CardContent>
            </Card>
             <Card>
                 <CardContent className="flex justify-around items-center pt-6">
                    <div className="flex items-center gap-2">
                        <Sunrise className="w-8 h-8 text-accent"/>
                        <div>
                            <p className="text-sm text-muted-foreground">Sunrise</p>
                            <p className="font-bold">6:15 AM</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-2">
                        <Sunset className="w-8 h-8 text-accent"/>
                        <div>
                            <p className="text-sm text-muted-foreground">Sunset</p>
                            <p className="font-bold">7:05 PM</p>
                        </div>
                    </div>
                 </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
