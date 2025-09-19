// src/app/page.tsx
'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, User, Mic, Paperclip, Send } from 'lucide-react';
import { answerAgricultureQuery, type AnswerAgricultureQueryOutput } from '@/ai/flows/agriculture-query';
import { useToast } from '@/hooks/use-toast';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, CartesianGrid, XAxis, YAxis, Bar } from 'recharts';
import { Markdown } from '@/components/ui/markdown';


type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  component?: React.ReactNode;
  followUpQuestions?: string[];
  chart?: AnswerAgricultureQueryOutput['chart'];
};

interface HomePageProps {
    language: string;
}


export default function Home({ language }: HomePageProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isPending, startTransition] = useTransition();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        setMessages([
        {
            id: '1',
            role: 'assistant',
            text: 'Namaste! How can I assist you with your farming needs today?',
        }
        ]);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleFollowUpClick = (question: string) => {
        setInput(question);
        const fakeEvent = { preventDefault: () => {} } as React.FormEvent<HTMLFormElement>;
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
            const result: AnswerAgricultureQueryOutput = await answerAgricultureQuery({ query: currentInput, language: language });
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
    
    return (
        <div className="flex-1 flex flex-col h-full">
            <div className="flex-1 p-6 overflow-y-auto chat-container space-y-8">
                {messages.map((message) => (
                    <div key={message.id} className={`flex items-start gap-4 max-w-2xl ${message.role === 'user' ? 'ml-auto justify-end' : ''}`}>
                         {message.role === 'assistant' ? (
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-green to-secondary-green rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                                <span className="material-symbols-outlined text-white">psychology</span>
                            </div>
                        ) : (
                            <div className="w-10 h-10 bg-accent-blue rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                                <User size={20} className="text-white"/>
                            </div>
                        )}
                        <div className={`p-4 rounded-xl shadow-md ${message.role === 'user' ? 'chat-bubble-user rounded-br-none text-white' : 'chat-bubble-ai rounded-tl-none border border-gray-200/50 dark:border-gray-700/50'}`}>
                            <Markdown text={message.text} />
                            {message.chart && (
                                <div className="mt-2 w-full h-64 bg-white dark:bg-surface-dark/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700/50">
                                <ChartContainer config={{}} className="w-full h-full">
                                    <BarChart data={message.chart.data} margin={{ top: 10, right: 10, bottom: 5, left: -20 }}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} fontSize={10} />
                                    <YAxis fontSize={10} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="value" fill="var(--primary-green)" radius={4} />
                                    </BarChart>
                                </ChartContainer>
                                </div>
                            )}
                            {message.followUpQuestions && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                {message.followUpQuestions.map((q, i) => (
                                    <Button key={i} variant="outline" size="sm" onClick={() => handleFollowUpClick(q)} className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-full text-subtext-light dark:text-subtext-dark hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                    {q}
                                    </Button>
                                ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {isPending && (
                <div className="flex items-start gap-4 max-w-2xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-green to-secondary-green rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                        <span className="material-symbols-outlined text-white">psychology</span>
                    </div>
                    <div className="chat-bubble-ai p-4 rounded-xl rounded-tl-none shadow-md border border-gray-200/50 dark:border-gray-700/50">
                        <Loader2 className="h-6 w-6 animate-spin text-primary-green" />
                    </div>
                </div>
                )}
                <div ref={messagesEndRef} />
            </div>
             <footer className="p-4 bg-surface-light dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800/50">
                 <form onSubmit={handleSubmit} className="relative">
                    <Textarea 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        rows={1}
                        className="w-full py-3 pl-12 pr-28 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark rounded-full focus:outline-none focus:ring-2 focus:ring-primary-green/50 shadow-inner-light dark:shadow-inner-dark resize-none"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e as any);
                            }
                        }}
                    />
                    <Button type="button" variant="ghost" size="icon" className="absolute left-3 top-2.5 text-subtext-light dark:text-subtext-dark hover:text-primary-green"><Paperclip size={22}/></Button>
                     <div className="absolute right-3 top-2.5 flex items-center gap-1">
                        <Button type="button" variant="ghost" size="icon" className="text-subtext-light dark:text-subtext-dark hover:text-primary-green"><Mic size={22}/></Button>
                        <Button type="submit" size="icon" className="p-2 bg-gradient-to-br from-primary-green to-secondary-green text-white rounded-full hover:opacity-90 transition-opacity" disabled={isPending || !input.trim()}>
                            {isPending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                        </Button>
                     </div>
                </form>
                <p className="text-xs text-center text-subtext-light dark:text-subtext-dark mt-2">Agro Track Ai can make mistakes. Consider checking important information.</p>
            </footer>
        </div>
    );
}
