// src/app/dashboard/_components/ChatAssistantCard.tsx
'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Bot, User, Send, Mic, Paperclip, X } from 'lucide-react';
import { answerAgricultureQuery, type AnswerAgricultureQueryOutput } from '@/ai/flows/agriculture-query';
import { useToast } from '@/hooks/use-toast';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, CartesianGrid, XAxis, YAxis, Bar } from 'recharts';
import { Markdown } from '@/components/ui/markdown';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { auth } from '@/lib/firebase';
import type { User as FirebaseUser } from 'firebase/auth';


type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  component?: React.ReactNode;
  followUpQuestions?: string[];
  chart?: AnswerAgricultureQueryOutput['chart'];
};


export default function ChatAssistantCard({ onRemove }: { onRemove: () => void }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isPending, startTransition] = useTransition();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    const [user, setUser] = useState<FirebaseUser | null>(null);


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(setUser);
        return () => unsubscribe();
    }, []);

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
            const result: AnswerAgricultureQueryOutput = await answerAgricultureQuery({ query: currentInput, language: 'en' });
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
        <Card className="col-span-1 lg:col-span-2 row-span-2 flex flex-col">
            <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                    <CardTitle>Chat Assistant</CardTitle>
                    <CardDescription>Your AI-powered agriculture expert.</CardDescription>
                </div>
                 <Button variant="ghost" size="icon" className="ml-auto" onClick={onRemove}>
                    <X className="w-4 h-4" />
                </Button>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
                <div className="flex-1 p-4 overflow-y-auto chat-container space-y-6 bg-background rounded-lg border">
                    {messages.map((message) => (
                        <div key={message.id} className={`flex items-start gap-3 max-w-xl ${message.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                            {message.role === 'assistant' ? (
                                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0 shadow-md text-white">
                                <Bot size={16} />
                                </div>
                            ) : user ? (
                                <Avatar className="w-8 h-8">
                                <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                                <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                                </Avatar>
                            ) : (
                                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 shadow-md text-white">
                                <User size={16} />
                                </div>
                            )}
                            <div className={`p-3 rounded-lg shadow-sm ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card border'}`}>
                                <Markdown text={message.text} />
                                {message.chart && (
                                    <div className="mt-2 w-full h-48">
                                    <ChartContainer config={{}} className="w-full h-full">
                                        <BarChart data={message.chart.data} margin={{ top: 10, right: 10, bottom: 5, left: -20 }}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} fontSize={10} />
                                        <YAxis fontSize={10} />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Bar dataKey="value" fill="hsl(var(--primary))" radius={2} />
                                        </BarChart>
                                    </ChartContainer>
                                    </div>
                                )}
                                {message.followUpQuestions && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                    {message.followUpQuestions.map((q, i) => (
                                        <Button key={i} variant="outline" size="sm" onClick={() => handleFollowUpClick(q)} className="rounded-full h-auto py-1 px-3 text-xs">
                                        {q}
                                        </Button>
                                    ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isPending && (
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0 shadow-md text-white">
                            <Bot size={16} />
                        </div>
                        <div className="p-3 rounded-lg shadow-sm bg-card border">
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        </div>
                    </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                 <form onSubmit={handleSubmit} className="relative">
                    <Textarea 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about crops, weather, or prices..."
                        rows={1}
                        className="w-full py-2 pl-10 pr-24 rounded-full shadow-inner resize-none bg-background"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e as any);
                          }
                        }}
                    />
                    <Button type="button" variant="ghost" size="icon" className="absolute left-2 top-1.5 text-muted-foreground h-7 w-7"><Paperclip size={16}/></Button>
                     <div className="absolute right-2 top-1.5 flex items-center gap-1">
                        <Button type="button" variant="ghost" size="icon" className="text-muted-foreground h-7 w-7"><Mic size={16}/></Button>
                        <Button type="submit" size="icon" className="bg-gradient-to-br from-primary to-secondary text-white rounded-full hover:opacity-90 h-7 w-7" disabled={isPending || !input.trim()}>
                            {isPending ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                        </Button>
                     </div>
                </form>
            </CardContent>
        </Card>
    );
}
