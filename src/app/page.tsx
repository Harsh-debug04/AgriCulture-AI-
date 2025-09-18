// src/app/page.tsx
'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Bot, User, Send, BarChart, Thermometer, Leaf, Bug, History, Star, MoreVertical, Cloudy, Spade, ArrowUp, ArrowDown, Mic, Paperclip, Circle as CircleIcon, Power } from 'lucide-react';
import { answerAgricultureQuery } from '@/ai/flows/agriculture-query';
import type { AnswerAgricultureQueryOutput } from '@/ai/flows/agriculture-query';
import Image from 'next/image';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  component?: React.ReactNode;
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
    model: 'Model v3.5',
    weatherForecast: 'Weather Forecast',
    pestControlBtn: 'Pest Control',
    cropAdvisory: 'Crop Advisory',
    inputPlaceholder: 'Type your message...',
    footerNotice: 'AgriCart Ai can make mistakes. Consider checking important information.',
    marketWatch: 'Market Watch',
    cotton: 'Cotton (Kapas)',
    soybean: 'Soybean',
    paddy: 'Paddy (Basmati)',
    agriNews: 'Agri News',
    monsoonNews: 'Monsoon advances, promising good Kharif season',
    monsoonDesc: 'The IMD reports a timely onset of the monsoon, crucial for summer crop sowing across the country.',
    organicScheme: 'New government scheme to boost organic farming',
    organicDesc: 'A new subsidy program aims to encourage farmers to adopt organic practices, improving soil health and crop value.',
    techRevolution: 'Tech startups are revolutionizing farm logistics',
    techDesc: 'From supply chain to cold storage, technology is helping reduce post-harvest losses for farmers.',
    readMore: 'Read more...',
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
    model: 'मॉडल v3.5',
    weatherForecast: 'मौसम पूर्वानुमान',
    pestControlBtn: 'कीट नियंत्रण',
    cropAdvisory: 'फसल सलाह',
    inputPlaceholder: 'अपना संदेश लिखें...',
    footerNotice: 'एग्रीकार्ट एआई गलतियाँ कर सकता है। महत्वपूर्ण जानकारी की जाँच करने पर विचार करें।',
    marketWatch: 'बाजार देखो',
    cotton: 'कपास',
    soybean: 'सोयाबीन',
    paddy: 'धान (बासमती)',
    agriNews: 'कृषि समाचार',
    monsoonNews: 'मानसून आगे बढ़ा, अच्छे खरीफ सीजन का वादा',
    monsoonDesc: 'आईएमडी ने मानसून के समय पर आने की सूचना दी है, जो देश भर में गर्मियों की फसल की बुवाई के लिए महत्वपूर्ण है।',
    organicScheme: 'जैविक खेती को बढ़ावा देने के लिए नई सरकारी योजना',
    organicDesc: 'एक नया सब्सिडी कार्यक्रम किसानों को जैविक प्रथाओं को अपनाने, मिट्टी के स्वास्थ्य और फसल के मूल्य में सुधार करने के लिए प्रोत्साहित करना है।',
    techRevolution: 'टेक स्टार्टअप कृषि रसद में क्रांति ला रहे हैं',
    techDesc: 'आपूर्ति श्रृंखला से लेकर कोल्ड स्टोरेज तक, प्रौद्योगिकी किसानों के लिए कटाई के बाद के नुकसान को कम करने में मदद कर रही है।',
    readMore: 'और पढ़ें...',
  }
};

export default function AssistantPage() {
  const [language, setLanguage] = useState('en');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');

    startTransition(async () => {
      try {
        const result: AnswerAgricultureQueryOutput = await answerAgricultureQuery({ query: currentInput, language });
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: result.answer,
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
                <BarChart /> <span>{t.marketData}</span>
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
                             <Bot />
                           </div>
                       )}
                       <div className={`p-4 rounded-xl shadow-md ${message.role === 'user' ? 'rounded-br-none bg-gradient-to-br from-primary to-secondary text-white' : 'rounded-tl-none bg-card dark:bg-card-dark border'}`}>
                           <p>{message.text}</p>
                           {message.component}
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
                      <Bot />
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
            <div className="space-y-4">
                <div className="bg-white dark:bg-card p-4 rounded-2xl shadow-md">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{t.cotton}</h3>
                        <span className="text-sm font-bold text-green-600 dark:text-green-500 flex items-center"><ArrowUp className="w-4 h-4"/> ₹7,200</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Gujarat, Rajkot Mandi</p>
                </div>
                 <div className="bg-white dark:bg-card p-4 rounded-2xl shadow-md">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{t.soybean}</h3>
                        <span className="text-sm font-bold text-red-600 dark:text-red-500 flex items-center"><ArrowDown className="w-4 h-4"/> ₹4,550</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Madhya Pradesh, Indore Mandi</p>
                </div>
                 <div className="bg-white dark:bg-card p-4 rounded-2xl shadow-md">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{t.paddy}</h3>
                        <span className="text-sm font-bold text-green-600 dark:text-green-500 flex items-center"><ArrowUp className="w-4 h-4"/> ₹3,800</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Haryana, Karnal Mandi</p>
                </div>
            </div>
             <h2 className="text-xl font-bold mt-8 mb-4">{t.agriNews}</h2>
            <div className="space-y-4 overflow-y-auto flex-1 chat-container pr-2">
                <div className="bg-white dark:bg-card p-4 rounded-2xl shadow-md">
                    <h3 className="font-semibold mb-1">{t.monsoonNews}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{t.monsoonDesc}</p>
                    <a href="#" className="text-xs text-accent hover:underline">{t.readMore}</a>
                </div>
                 <div className="bg-white dark:bg-card p-4 rounded-2xl shadow-md">
                    <h3 className="font-semibold mb-1">{t.organicScheme}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{t.organicDesc}</p>
                    <a href="#" className="text-xs text-accent hover:underline">{t.readMore}</a>
                </div>
                <div className="bg-white dark:bg-card p-4 rounded-2xl shadow-md">
                    <h3 className="font-semibold mb-1">{t.techRevolution}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{t.techDesc}</p>
                    <a href="#" className="text-xs text-accent hover:underline">{t.readMore}</a>
                </div>
            </div>
        </aside>
      </div>
    </div>
  );
}
