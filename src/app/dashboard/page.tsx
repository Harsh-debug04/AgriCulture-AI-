// src/app/dashboard/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

import ChatAssistantCard from './_components/ChatAssistantCard';
import WeatherCard from './_components/WeatherCard';
import MarketDataCard from './_components/MarketDataCard';
import CropInfoCard from './_components/CropInfoCard';
import PestControlCard from './_components/PestControlCard';

type CardType = 'chat' | 'weather' | 'market' | 'crop' | 'pest';

const componentMap: Record<CardType, React.ComponentType<any>> = {
    chat: ChatAssistantCard,
    weather: WeatherCard,
    market: MarketDataCard,
    crop: CropInfoCard,
    pest: PestControlCard,
};

export default function DashboardPage() {
    const [cards, setCards] = useState<CardType[]>(['chat', 'weather', 'market']);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const addCard = (type: CardType) => {
        if (!cards.includes(type)) {
            setCards([...cards, type]);
        }
    };

    const removeCard = (type: CardType) => {
        setCards(cards.filter(card => card !== type));
    };

    if (!isClient) {
        return null;
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center space-x-2">
                    {/* Add Card Dropdown can be implemented here */}
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Card
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {cards.map((cardType) => {
                    const CardComponent = componentMap[cardType];
                    return <CardComponent key={cardType} onRemove={() => removeCard(cardType)} />;
                })}

                <Card className="flex flex-col items-center justify-center border-2 border-dashed bg-transparent">
                     <CardHeader>
                        <CardTitle>Add New Card</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        {!cards.includes('weather') && <Button onClick={() => addCard('weather')}>Weather</Button>}
                        {!cards.includes('market') && <Button onClick={() => addCard('market')}>Market</Button>}
                        {!cards.includes('crop') && <Button onClick={() => addCard('crop')}>Crop Info</Button>}
                        {!cards.includes('pest') && <Button onClick={() => addCard('pest')}>Pest Control</Button>}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
