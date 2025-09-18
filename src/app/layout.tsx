import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Logo } from '@/components/icons/logo';

export const metadata: Metadata = {
  title: 'KrishiMitra AI',
  description: 'Your AI-powered agriculture assistant',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <main className="container mx-auto p-4 sm:p-6 lg:p-8 h-screen">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
