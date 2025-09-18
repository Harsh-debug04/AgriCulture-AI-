import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Bot,
  Bug,
  CloudSun,
  LayoutGrid,
  LineChart,
  Sprout,
  Users,
  Wind,
  Thermometer,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const features = [
  {
    title: 'Crop Recommendation',
    description: 'Get AI-powered crop suggestions.',
    href: '/crop-recommendation',
    icon: <Sprout className="w-8 h-8" />,
  },
  {
    title: 'Pest & Disease ID',
    description: 'Identify plant issues from photos.',
    href: '/pest-disease',
    icon: <Bug className="w-8 h-8" />,
  },
  {
    title: 'Market Prices',
    description: 'Track and analyze crop prices.',
    href: '/market-prices',
    icon: <LineChart className="w-8 h-8" />,
  },
  {
    title: 'AI Assistant',
    description: 'Ask any farming-related question.',
    href: '/assistant',
    icon: <Bot className="w-8 h-8" />,
  },
  {
    title: 'Weather Advisory',
    description: 'View detailed local weather forecasts.',
    href: '/weather',
    icon: <CloudSun className="w-8 h-8" />,
  },
  {
    title: 'Community Forum',
    description: 'Connect with other farmers.',
    href: '/community',
    icon: <Users className="w-8 h-8" />,
  },
];

const marketMovers = [
  { name: 'Tomato', change: 5.2, dir: 'up' },
  { name: 'Onion', change: -2.1, dir: 'down' },
  { name: 'Potato', change: 3.5, dir: 'up' },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-4xl font-bold text-primary">
          Welcome to KrishiMitra AI
        </h1>
        <p className="text-muted-foreground mt-2">
          Your all-in-one platform for smart farming in India.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-6 h-6 text-primary" />
              <CardTitle>Feature Dashboard</CardTitle>
            </div>
            <CardDescription>
              Explore our tools to enhance your farming practices.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {features.map((feature) => (
              <Link href={feature.href} key={feature.title} passHref>
                <div className="p-4 bg-background rounded-lg border hover:border-primary hover:shadow-lg transition-all cursor-pointer h-full flex flex-col items-center text-center">
                  <div className="text-primary">{feature.icon}</div>
                  <h3 className="font-semibold mt-2 text-sm">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CloudSun className="w-6 h-6 text-primary" />
                <CardTitle>Weather Today</CardTitle>
              </div>
              <CardDescription>Pune, Maharashtra</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-5xl font-bold">28°C</p>
                  <p className="text-muted-foreground">Partly Cloudy</p>
                </div>
                <CloudSun className="w-16 h-16 text-accent" />
              </div>
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-muted-foreground" />
                  <span>Humidity: 65%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-muted-foreground" />
                  <span>Wind: 12 km/h</span>
                </div>
              </div>
              <Button variant="outline" asChild>
                <Link href="/weather">
                  Full Forecast <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-primary" />
                <CardTitle>Market Movers</CardTitle>
              </div>
              <CardDescription>Top price changes today</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {marketMovers.map((mover) => (
                <div key={mover.name} className="flex justify-between items-center text-sm">
                  <span className="font-medium">{mover.name}</span>
                  <div className={`flex items-center gap-1 ${mover.dir === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {mover.dir === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                    <span>{mover.change}%</span>
                  </div>
                </div>
              ))}
               <Button variant="outline" asChild>
                <Link href="/market-prices">
                  View All Prices <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
