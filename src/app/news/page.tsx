// src/app/news/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { getAgriNews, AgriNewsArticle } from '@/ai/flows/agri-news-flow';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '../language-context';
import { translations } from '@/lib/translations';

export default function NewsPage() {
    const [news, setNews] = useState<AgriNewsArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const { language } = useLanguage();
    const t = translations[language as keyof typeof translations].newsPage;
    const tAgriNews = translations[language as keyof typeof translations].agriNews;


    useEffect(() => {
        async function fetchNews() {
            try {
                setLoading(true);
                const newsArticles = await getAgriNews();
                setNews(newsArticles);
            } catch (error) {
                console.error("Error fetching news:", error);
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: t.error,
                });
            } finally {
                setLoading(false);
            }
        }
        fetchNews();
    }, [toast, t.error]);

    return (
        <main className="p-4 md:p-6">
            <Card className="bg-surface-light dark:bg-surface-dark shadow-card dark:shadow-card-dark rounded-2xl">
                <CardHeader>
                    <CardTitle>{t.title}</CardTitle>
                    <CardDescription>{t.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Card key={i} className="animate-pulse bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-card dark:shadow-card-dark">
                                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {news.map((article, index) => (
                                <Card key={index} className="bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-card dark:shadow-card-dark flex flex-col">
                                    <CardHeader className="p-2">
                                        <CardTitle className="text-lg">{article.headline}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-2 flex-grow">
                                        <p className="text-sm text-subtext-light dark:text-subtext-dark mb-4">{article.summary}</p>
                                    </CardContent>
                                    <div className="p-2 mt-auto">
                                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                                            <Button variant="link" className="text-accent-blue p-0">{tAgriNews.readMore}</Button>
                                        </a>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </main>
    );
}
