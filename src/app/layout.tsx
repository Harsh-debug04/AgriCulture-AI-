// src/app/layout.tsx
'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Bot,
  PanelLeft,
  BarChartIcon,
  Thermometer,
  Leaf,
  Bug,
  Newspaper,
  CircleHelp,
  User as UserIcon,
  ChevronDown,
  PlusCircle,
  History,
  Star,
  MoreVertical
} from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { getMarketData, MarketData } from '@/ai/flows/market-data-flow';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getAgriNews, AgriNewsArticle } from '@/ai/flows/agri-news-flow';
import { Logo } from '@/components/icons/logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageProvider, useLanguage } from './language-context';


const navItems = [
    { href: '/', icon: CircleHelp, label: 'Chat Assistant' },
    { href: '/market-data', icon: BarChartIcon, label: 'Market Data' },
    { href: '/weather', icon: Thermometer, label: 'Weather' },
    { href: '/crop-info', icon: Leaf, label: 'Crop Info' },
    { href: '/pest-control', icon: Bug, label: 'Pest Diagnosis' },
    { href: '/news', icon: Newspaper, label: 'News' },
];

const allCommodities = ['Cotton', 'Soybean', 'Paddy', 'Wheat', 'Maize', 'Gram', 'Tur', 'Mustard', 'Sugarcane', 'Groundnut'];

function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [trackedCommodities, setTrackedCommodities] = useState(['cotton', 'soybean', 'paddy']);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [news, setNews] = useState<AgriNewsArticle[]>([]);
  const [loadingExtras, setLoadingExtras] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);

    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };


  useEffect(() => {
    async function fetchExtras() {
      setLoadingExtras(true);
      try {
        const [market, newsData] = await Promise.all([
          getMarketData(trackedCommodities),
          getAgriNews()
        ]);
        setMarketData(market);
        setNews(newsData);
      } catch (error) {
        console.error("Error fetching extras:", error);
      } finally {
        setLoadingExtras(false);
      }
    }
    fetchExtras();
  }, [trackedCommodities])
  
  const addCommodity = (commodity: string) => {
    const lowerCommodity = commodity.toLowerCase();
    if(!trackedCommodities.includes(lowerCommodity)){
        setTrackedCommodities(prev => [...prev, lowerCommodity]);
    }
  }

  return (
    <div className="flex h-screen w-full">
            {/* Desktop Sidebar */}
            <aside className="w-64 bg-surface-light dark:bg-surface-dark flex-col p-4 border-r border-gray-200 dark:border-gray-800/50 hidden md:flex">
                <div className="flex items-center space-x-3 mb-8">
                    <img alt="Agro Track Ai logo" className="w-10 h-10" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBC6QkH5v_bOQ1o8v0eB5i4a-YwD5j2p_qR-l2B5T4i6k_xXgG_pQzF2a-zHwO8wX6iK_jWzVvT-sC-aE5eL5fB0mS3hR7cO6kP9xQ=s96" />
                    <h1 className="text-xl font-bold text-text-light dark:text-text-dark">Agro Track Ai</h1>
                </div>
                <nav className="flex-1 space-y-2">
                    {navItems.map(({ href, icon: Icon, label }) => (
                         <Link key={href} href={href} className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-colors ${pathname === href ? 'bg-primary-green/10 dark:bg-primary-green/20 text-primary-green dark:text-secondary-green font-semibold' : 'text-subtext-light dark:text-subtext-dark hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}>
                            <Icon className="h-5 w-5" />
                            <span>{label}</span>
                        </Link>
                    ))}
                </nav>
                 <div className="mt-auto">
                     <div className="flex items-center space-x-3 mt-6">
                        <div className="w-10 h-10 bg-accent-blue rounded-full flex items-center justify-center flex-shrink-0">
                            <UserIcon className="text-white"/>
                        </div>
                         <div>
                            <p className="font-semibold text-text-light dark:text-text-dark">Guest</p>
                        </div>
                    </div>
                </div>
            </aside>
            <div className="flex-1 flex h-screen overflow-hidden">
                <main className="flex-1 flex flex-col bg-background-light dark:bg-background-dark">
                    <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800/50 bg-surface-light/50 dark:bg-surface-dark/50 backdrop-blur-sm">
                         <div className="flex items-center space-x-4">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button
                                    variant="ghost"
                                    size="icon"
                                    className="shrink-0 md:hidden"
                                    >
                                    <PanelLeft className="h-5 w-5" />
                                    <span className="sr-only">Toggle navigation menu</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-64 bg-surface-light dark:bg-surface-dark p-4 border-r-0">
                                   <div className="flex items-center space-x-3 mb-8">
                                        <img alt="Agro Track Ai logo" className="w-10 h-10" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBC6QkH5v_bOQ1o8v0eB5i4a-YwD5j2p_qR-l2B5T4i6k_xXgG_pQzF2a-zHwO8wX6iK_jWzVvT-sC-aE5eL5fB0mS3hR7cO6kP9xQ=s96" />
                                        <h1 className="text-xl font-bold text-text-light dark:text-text-dark">Agro Track Ai</h1>
                                    </div>
                                    <nav className="flex-1 space-y-2">
                                        {navItems.map(({ href, icon: Icon, label }) => (
                                             <Link key={href} href={href} className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-colors ${pathname === href ? 'bg-primary-green/10 dark:bg-primary-green/20 text-primary-green dark:text-secondary-green font-semibold' : 'text-subtext-light dark:text-subtext-dark hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}>
                                                <Icon className="h-5 w-5" />
                                                <span>{label}</span>
                                            </Link>
                                        ))}
                                    </nav>
                                </SheetContent>
                            </Sheet>
                            <div>
                                <h1 className="text-xl font-bold text-text-light dark:text-text-dark">AgriCart Assistant</h1>
                                <p className="text-sm text-subtext-light dark:text-subtext-dark flex items-center">
                                    <span className="material-symbols-outlined text-xs mr-1 text-secondary-green">circle</span> Online · Model v3.5
                                </p>
                            </div>
                         </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="icon" className="text-subtext-light dark:text-subtext-dark hover:bg-gray-200 dark:hover:bg-gray-700/50">
                                <History size={20} />
                            </Button>
                            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                                <Button
                                    variant={language === 'en' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    onClick={() => setLanguage('en')}
                                    className="px-2 py-1 h-auto text-xs"
                                >
                                    EN
                                </Button>
                                <Button
                                    variant={language === 'hi' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    onClick={() => setLanguage('hi')}
                                    className="px-2 py-1 h-auto text-xs"
                                >
                                    HI
                                </Button>
                            </div>
                            <Button variant="ghost" size="icon" className="text-subtext-light dark:text-subtext-dark hover:bg-gray-200 dark:hover:bg-gray-700/50">
                                <Star size={20} />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-subtext-light dark:text-subtext-dark hover:bg-gray-200 dark:hover:bg-gray-700/50">
                                {isDarkMode ? <span className="material-icons">light_mode</span> : <span className="material-icons">dark_mode</span>}
                            </Button>
                             <Button variant="ghost" size="icon" className="text-subtext-light dark:text-subtext-dark hover:bg-gray-200 dark:hover:bg-gray-700/50">
                                <MoreVertical size={20}/>
                            </Button>
                        </div>
                    </header>
                    <div className="flex-1 overflow-y-auto">
                        {children}
                    </div>
                </main>
                 <aside className="w-96 bg-surface-light/70 dark:bg-surface-dark/70 border-l border-gray-200 dark:border-gray-800/50 flex-col p-6 hidden lg:flex">
                     <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Market Watch</h2>
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="flex items-center gap-1">
                                    <PlusCircle size={14}/>
                                    Add Crop
                                    <ChevronDown size={14}/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {allCommodities.filter(c => !trackedCommodities.includes(c.toLowerCase())).map(commodity => (
                                     <DropdownMenuItem key={commodity} onClick={() => addCommodity(commodity)}>
                                        {commodity}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                     </div>
                     <div className="space-y-4">
                         {loadingExtras ? Array.from({length: 3}).map((_, i) => (
                             <Card key={i} className="bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-card dark:shadow-card-dark animate-pulse">
                                 <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                                 <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                             </Card>
                         )) : marketData.map(item => (
                             <div key={item.commodity} className="bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-card dark:shadow-card-dark">
                                 <div className="flex items-center justify-between mb-2">
                                     <h3 className="font-semibold text-text-light dark:text-text-dark">{item.commodity}</h3>
                                     <span className={`text-sm font-bold flex items-center ${item.trend === 'up' ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                                         {item.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                                         ₹{item.price.toLocaleString('en-IN')}
                                     </span>
                                 </div>
                                 <p className="text-xs text-subtext-light dark:text-subtext-dark">{item.location}</p>
                             </div>
                         ))}
                     </div>
                     <h2 className="text-xl font-bold mt-8 mb-4">Agri News</h2>
                     <div className="space-y-4 overflow-y-auto flex-1 chat-container pr-2">
                         {loadingExtras ? Array.from({length: 3}).map((_, i) => (
                              <Card key={i} className="bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-card dark:shadow-card-dark animate-pulse">
                                 <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-2"></div>
                                 <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
                                 <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                             </Card>
                         )) : news.map(article => (
                             <div key={article.headline} className="bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-card dark:shadow-card-dark">
                                 <h3 className="font-semibold text-text-light dark:text-text-dark mb-1">{article.headline}</h3>
                                 <p className="text-sm text-subtext-light dark:text-subtext-dark mb-2">{article.summary}</p>
                                 <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-xs text-accent-blue hover:underline">Read more...</a>
                             </div>
                         ))}
                     </div>
                 </aside>
            </div>
        </div>
    );
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
       <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

      </head>
      <body className="antialiased font-['Poppins',_sans-serif] bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
        <LanguageProvider>
          <AppLayout>
            {children}
          </AppLayout>
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}