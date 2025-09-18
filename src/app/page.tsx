// src/app/page.tsx
'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Bot, User, Send, BarChart as BarChartIcon, Thermometer, Leaf, Bug, History, Star, MoreVertical, LogOut, Cloudy, Spade, ArrowUp, ArrowDown, Mic, Paperclip, Circle as CircleIcon, Power, Plus } from 'lucide-react';
import { answerAgricultureQuery } from '@/ai/flows/agriculture-query';
import type { AnswerAgricultureQueryOutput } from '@/ai/flows/agriculture-query';
import Image from 'next/image';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { getMarketData, type MarketData } from '@/ai/flows/market-data-flow';
import { getAgriNews, type AgriNewsArticle } from '@/ai/flows/agri-news-flow';
import { Input } from '@/components/ui/input';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, CartesianGrid, XAxis, YAxis, Bar } from 'recharts';


type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  component?: React.ReactNode;
  followUpQuestions?: string[];
  chart?: AnswerAgricultureQueryOutput['chart'];
};

const translations = {
  en: {
    initialMessage: 'Namaste! How can I assist you with your farming needs today? You can ask me about crop information, weather forecasts, or market prices.',
    chatAssistant: 'Chat Assistant',
    marketData: 'Market Data',
    weather: 'Weather',
    cropInfo: 'Crop Info',
    pestControl: 'Pest Control',
    assistantTitle: 'AgriCart Ai Assistant',
    onlineStatus: 'Online',
    model: 'Model v0.013',
    weatherForecast: 'Weather Forecast',
    pestControlBtn: 'Pest Control',
    cropAdvisory: 'Crop Advisory',
    inputPlaceholder: 'Type your message...',
    footerNotice: 'AgriCart Ai can make mistakes. Consider checking important information.',
    marketWatch: 'Market Watch',
    agriNews: 'Agri News',
    readMore: 'Read more...',
    addCommodityPlaceholder: 'e.g., Wheat',
    add: 'Add',
  },
  hi: {
    initialMessage: 'नमस्ते! आज मैं आपकी खेती की ज़रूरतों में कैसे सहायता कर सकता हूँ? आप मुझसे फसल की जानकारी, मौसम के पूर्वानुमान, या बाज़ार की कीमतों के बारे में पूछ सकते हैं।',
    chatAssistant: 'चैट सहायक',
    marketData: 'बाजार डेटा',
    weather: 'मौसम',
    cropInfo: 'फसल जानकारी',
    pestControl: 'कीट नियंत्रण',
    assistantTitle: 'एग्रीकार्ट एआई सहायक',
    onlineStatus: 'ऑनलाइन',
    model: 'मॉडल v0.013',
    weatherForecast: 'मौसम पूर्वानुमान',
    pestControlBtn: 'कीट नियंत्रण',
    cropAdvisory: 'फसल सलाह',
    inputPlaceholder: 'अपना संदेश लिखें...',
    footerNotice: 'एग्रीकार्ट एआई गलतियाँ कर सकता है। महत्वपूर्ण जानकारी की जाँच करने पर विचार करें।',
    marketWatch: 'बाजार देखो',
    agriNews: 'कृषि समाचार',
    readMore: 'और पढ़ें...',
    addCommodityPlaceholder: 'उदा., गेहूं',
    add: 'जोड़ें',
  }
};

export default function AssistantPage() {
  const [language, setLanguage] = useState('en');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [agriNews, setAgriNews] = useState<AgriNewsArticle[]>([]);
  const [trackedCommodities, setTrackedCommodities] = useState<string[]>(['cotton', 'soybean', 'paddy']);
  const [newCommodity, setNewCommodity] = useState('');


  const t = translations[language as keyof typeof translations];

  useEffect(() => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        text: t.initialMessage,
      }
    ]);
  }, [language, t.initialMessage]);

  useEffect(() => {
    async function fetchNews() {
      try {
        const news = await getAgriNews();
        setAgriNews(news);
      } catch (error) {
        console.error('Error fetching news:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not load news data.',
        });
      }
    }
    fetchNews();
  }, [toast]);
  
  useEffect(() => {
    async function fetchMarketData() {
      if (trackedCommodities.length === 0) {
        setMarketData([]);
        return;
      }
      try {
        const market = await getMarketData(trackedCommodities);
        setMarketData(market);
      } catch (error) {
        console.error('Error fetching market data:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not load market data.',
        });
      }
    }
    fetchMarketData();
  }, [toast, trackedCommodities]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Dark mode toggle logic
  useEffect(() => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const toggleTheme = (isDark: boolean) => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        }
    }
    
    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        toggleTheme(true);
    } else {
        toggleTheme(false);
    }

    const handleClick = () => {
        toggleTheme(!document.documentElement.classList.contains('dark'));
    }
    
    themeToggleBtn?.addEventListener('click', handleClick);

    return () => {
        themeToggleBtn?.removeEventListener('click', handleClick);
    }
  }, []);

  const handleFollowUpClick = (question: string) => {
    setInput(question);
    // We are using a fake form event to trigger the submit handler
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent<HTMLFormElement>;
    // We need to wrap this in a timeout to allow the state to update before submitting
    setTimeout(() => handleSubmit(fakeEvent, question), 0);
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, question?: string) => {
    e.preventDefault();
    const currentInput = question || input;
    if (!currentInput.trim()) return;
  
    const userMessage: Message = { id: Date.now().toString(), role: 'user', text: currentInput };
    setMessages((prev) => [...prev, userMessage]);
    if(!question) {
      setInput('');
    }
  
    startTransition(async () => {
      try {
        const result: AnswerAgricultureQueryOutput = await answerAgricultureQuery({ query: currentInput, language });
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: result.answer,
          followUpQuestions: result.followUpQuestions,
          chart: result.chart,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        console.error('Error getting answer:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Sorry, I encountered an error. Please try again.',
        });
      }
    });
  };

  const handleAddCommodity = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const commodityToAdd = newCommodity.trim().toLowerCase();
    if (commodityToAdd && !trackedCommodities.includes(commodityToAdd)) {
      setTrackedCommodities([...trackedCommodities, commodityToAdd]);
    }
    setNewCommodity('');
  };

  return (
    <div className="flex h-screen w-full bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark">
      {/* Left Sidebar */}
      <aside className="w-64 bg-card dark:bg-card-dark flex-col p-4 border-r hidden md:flex">
        <div className="flex items-center space-x-3 mb-8">
            <Image alt="AgriCart logo" width={40} height={40} src="https://lh3.googleusercontent.com/aida-public/AB6AXuBC6QkH5v_bOQ1o8v0eB5i4a-YwD5j2p_qR-l2B5T4i6k_xXgG_pQzF2a-zHwO8wX6iK_jWzVvT-sC-aE5eL5fB0mS3hR7cO6kP9xQ=s96"/>
            <h1 className="text-xl font-bold">AgriCart Ai</h1>
        </div>
        <nav className="flex-1 space-y-2">
            <Link href="/" className="flex items-center space-x-3 px-4 py-2.5 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-secondary font-semibold">
                <Bot /> <span>{t.chatAssistant}</span>
            </Link>
            <Link href="/market-data" className="flex items-center space-x-3 px-4 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 text-muted-foreground transition-colors">
                <BarChartIcon /> <span>{t.marketData}</span>
            </Link>
            <Link href="/weather" className="flex items-center space-x-3 px-4 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 text-muted-foreground transition-colors">
                <Thermometer /> <span>{t.weather}</span>
            </Link>
            <Link href="/crop-info" className="flex items-center space-x-3 px-4 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 text-muted-foreground transition-colors">
                <Leaf /> <span>{t.cropInfo}</span>
            </Link>
            <Link href="/pest-control" className="flex items-center space-x-3 px-4 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 text-muted-foreground transition-colors">
                <Bug /> <span>{t.pestControl}</span>
            </Link>
        </nav>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex h-screen overflow-hidden">
        <main className="flex-1 flex flex-col bg-background dark:bg-background">
            <header className="flex items-center justify-between p-4 border-b bg-card/50 dark:bg-card/50 backdrop-blur-sm">
                <div className="flex items-center space-x-4">
                    <div>
                        <h1 className="text-xl font-bold">{t.assistantTitle}</h1>
                        <p className="text-sm text-muted-foreground flex items-center">
                            <CircleIcon className="text-xs mr-1 text-secondary fill-current" /> {t.onlineStatus} &nbsp;&middot;&nbsp; {t.model}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="flex items-center border rounded-full p-1">
                      <Button variant={language === 'en' ? 'secondary': 'ghost'} size="sm" className="rounded-full px-3" onClick={() => setLanguage('en')}>EN</Button>
                      <Button variant={language === 'hi' ? 'secondary': 'ghost'} size="sm" className="rounded-full px-3" onClick={() => setLanguage('hi')}>HI</Button>
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground"><History /></Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground"><Star /></Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground" id="theme-toggle" type="button">
                        <Power className="dark:hidden" />
                        <Power className="hidden dark:block" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground"><MoreVertical /></Button>
                </div>
            </header>
            
            <div className="flex-1 p-6 overflow-y-auto chat-container space-y-8">
                {messages.map((message) => (
                    <div key={message.id} className={`flex items-start gap-4 max-w-2xl ${message.role === 'user' ? 'ml-auto justify-end' : ''}`}>
                       {message.role === 'assistant' && (
                           <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0 shadow-md text-white">
                             <Plus />
                           </div>
                       )}
                       <div className={`p-4 rounded-xl shadow-md ${message.role === 'user' ? 'rounded-br-none bg-gradient-to-br from-primary to-secondary text-white' : 'rounded-tl-none bg-card dark:bg-card-dark border'}`}>
                           <p>{message.text}</p>
                           {message.chart && (
                            <div className="mt-4 w-full h-64">
                              <ChartContainer config={{}} className="w-full h-full">
                                <BarChart data={message.chart.data} margin={{ top: 20, right: 20, bottom: 5, left: 20 }}>
                                  <CartesianGrid vertical={false} />
                                  <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                                  <YAxis />
                                  <ChartTooltip content={<ChartTooltipContent />} />
                                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={4} />
                                </BarChart>
                              </ChartContainer>
                            </div>
                           )}
                           {message.component}
                           {message.followUpQuestions && message.followUpQuestions.length > 0 && (
                            <div className="mt-4 flex flex-col items-start gap-2">
                              {message.followUpQuestions.map((q, i) => (
                                <Button key={i} variant="outline" size="sm" onClick={() => handleFollowUpClick(q)} className="rounded-full">
                                  {q}
                                </Button>
                              ))}
                            </div>
                           )}
                       </div>
                        {message.role === 'user' && (
                           <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center flex-shrink-0 shadow-md text-white">
                             <User />
                           </div>
                       )}
                    </div>
                ))}
                {isPending && (
                  <div className="flex items-start gap-4 max-w-2xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0 shadow-md text-white">
                      <Plus />
                    </div>
                    <div className="p-4 rounded-xl shadow-md bg-card dark:bg-card-dark border">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <footer className="p-4 bg-card dark:bg-card border-t">
                <div className="flex items-center gap-2 mb-3 px-2">
                  <Button variant="outline" size="sm" className="rounded-full flex items-center gap-1.5"><Cloudy className="text-base"/>{t.weatherForecast}</Button>
                  <Button variant="outline" size="sm" className="rounded-full flex items-center gap-1.5"><Bug className="text-base"/>{t.pestControlBtn}</Button>
                  <Button variant="outline" size="sm" className="rounded-full flex items-center gap-1.5"><Spade className="text-base"/>{t.cropAdvisory}</Button>
                </div>
                <form onSubmit={handleSubmit} className="relative">
                    <Textarea 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t.inputPlaceholder}
                        rows={1}
                        className="w-full py-3 pl-12 pr-28 rounded-full shadow-inner resize-none bg-background dark:bg-background"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e as any);
                          }
                        }}
                    />
                    <Button type="button" variant="ghost" size="icon" className="absolute left-3 top-2 text-muted-foreground"><Paperclip /></Button>
                     <div className="absolute right-3 top-1.5 flex items-center gap-1">
                        <Button type="button" variant="ghost" size="icon" className="text-muted-foreground"><Mic/></Button>
                        <Button type="submit" size="icon" className="bg-gradient-to-br from-primary to-secondary text-white rounded-full hover:opacity-90" disabled={isPending || !input.trim()}>
                            {isPending ? <Loader2 className="animate-spin" /> : <Send />}
                        </Button>
                     </div>
                </form>
                 <p className="text-xs text-center text-muted-foreground mt-2">{t.footerNotice}</p>
            </footer>
        </main>

        {/* Right Sidebar */}
        <aside className="w-96 bg-card/70 dark:bg-card/70 border-l flex-col p-6 hidden lg:flex">
            <h2 className="text-xl font-bold mb-4">{t.marketWatch}</h2>
            <form onSubmit={handleAddCommodity} className="flex items-center gap-2 mb-4">
              <Input
                type="text"
                value={newCommodity}
                onChange={(e) => setNewCommodity(e.target.value)}
                placeholder={t.addCommodityPlaceholder}
                className="bg-white dark:bg-card"
              />
              <Button type="submit" size="icon" disabled={!newCommodity.trim()}>
                <Plus />
              </Button>
            </form>
            <div className="space-y-4">
              {marketData.length === 0 && trackedCommodities.length > 0 ? (
                Array.from({ length: trackedCommodities.length }).map((_, i) => (
                  <div key={i} className="bg-white dark:bg-card p-4 rounded-2xl shadow-md animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                ))
              ) : (
                marketData.map((item) => (
                  <div key={item.commodity} className="bg-white dark:bg-card p-4 rounded-2xl shadow-md">
                      <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{item.commodity}</h3>
                          <span className={`text-sm font-bold ${item.trend === 'up' ? 'text-green-600 dark:text-green-500' : item.trend === 'down' ? 'text-red-600 dark:text-red-500' : ''} flex items-center`}>
                            {item.trend === 'up' ? <ArrowUp className="w-4 h-4"/> : <ArrowDown className="w-4 h-4"/>}
                             ₹{item.price.toLocaleString('en-IN')}
                          </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{item.location}</p>
                  </div>
                ))
              )}
            </div>
             <h2 className="text-xl font-bold mt-8 mb-4">{t.agriNews}</h2>
            <div className="space-y-4 overflow-y-auto flex-1 chat-container pr-2">
                {agriNews.length === 0 ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-white dark:bg-card p-4 rounded-2xl shadow-md animate-pulse">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/5 mb-4"></div>
                       <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    </div>
                  ))
                ) : (
                  agriNews.map((article) => (
                    <div key={article.headline} className="bg-white dark:bg-card p-4 rounded-2xl shadow-md">
                        <h3 className="font-semibold mb-1">{article.headline}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{article.summary}</p>
                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline">{t.readMore}</a>
                    </div>
                  ))
                )}
            </div>
        </aside>
      </div>
    </div>
  );
}
    
