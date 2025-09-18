// src/app/assistant/page.tsx
'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bot, Send, User, Loader2 } from 'lucide-react';
import { answerAgricultureQuery } from '@/ai/flows/agriculture-query';
import type { AnswerAgricultureQueryOutput } from '@/ai/flows/agriculture-query';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
};

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    startTransition(async () => {
      try {
        const result: AnswerAgricultureQueryOutput = await answerAgricultureQuery({ query: input });
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: result.answer,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        console.error('Error getting answer:', error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: 'Sorry, I encountered an error. Please try again.',
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    });
  };

  return (
    <div className="h-full flex flex-col">
       <div>
        <h1 className="font-headline text-3xl font-bold">AI Assistant</h1>
        <p className="text-muted-foreground mt-1">
          Ask me anything about agriculture in India.
        </p>
      </div>
      <Card className="flex-1 mt-6 flex flex-col">
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
             <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <Bot className="mx-auto h-12 w-12 text-gray-400" />
                    <h2 className="mt-2 text-lg font-medium text-gray-900">KrishiMitra AI Assistant</h2>
                    <p className="mt-1 text-sm text-gray-500">I can help with crop cycles, soil health, and more.</p>
                </div>
             </div>
          ) : (
            messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-4 ${
                message.role === 'user' ? 'justify-end' : ''
              }`}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-9 w-9 border">
                  <AvatarFallback>
                    <Bot className="h-5 w-5 text-primary" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[75%] rounded-lg p-3 text-sm ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.text}
              </div>
              {message.role === 'user' && (
                <Avatar className="h-9 w-9 border">
                   <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
            ))
          )}
          {isPending && (
             <div className="flex items-start gap-4">
                <Avatar className="h-9 w-9 border">
                    <AvatarFallback>
                        <Bot className="h-5 w-5 text-primary" />
                    </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg p-3">
                    <Loader2 className="h-5 w-5 animate-spin" />
                </div>
             </div>
          )}
           <div ref={messagesEndRef} />
        </CardContent>
        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="E.g., What are the best practices for wheat cultivation?"
              className="flex-1"
              disabled={isPending}
            />
            <Button type="submit" size="icon" disabled={isPending || !input.trim()}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
