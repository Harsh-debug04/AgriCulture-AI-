// src/app/layout.tsx
'use client';

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
  MoreVertical,
  LogOut,
  LogIn,
  User as UserIcon
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';


const navItems = [
    { href: '/', icon: Bot, label: 'Chat Assistant' },
    { href: '/market-data', icon: BarChartIcon, label: 'Market Data' },
    { href: '/weather', icon: Thermometer, label: 'Weather' },
    { href: '/crop-info', icon: Leaf, label: 'Crop Info' },
    { href: '/pest-control', icon: Bug, label: 'Pest Control' },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const { toast } = useToast();

   useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast({ title: 'Logged in successfully!' });
    } catch (error) {
      console.error("Error signing in:", error);
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Could not sign in with Google. Please try again.',
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: 'Logged out' });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: 'Could not sign out. Please try again.',
      });
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
       <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased font-['Poppins',_sans-serif]">
        <div className="flex min-h-screen w-full flex-col bg-background">
          <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6 z-10">
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold md:text-base"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0 shadow-md text-white">
                    <Bot />
                </div>
                <span className="sr-only">Agro Track Ai</span>
              </Link>
              {navItems.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`transition-colors hover:text-foreground ${
                    pathname === href ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <nav className="grid gap-6 text-lg font-medium">
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-lg font-semibold"
                  >
                     <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0 shadow-md text-white">
                        <Bot />
                    </div>
                    <span className="sr-only">Agro Track Ai</span>
                  </Link>
                  {navItems.map(({ href, icon: Icon, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className={`flex items-center gap-4 px-2.5 ${
                        pathname === href ? 'text-foreground' : 'text-muted-foreground'
                      } hover:text-foreground`}
                    >
                      <Icon className="h-5 w-5" />
                      {label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                <div className="ml-auto flex-1 sm:flex-initial"></div>
                 {user ? (
                   <Avatar className="w-8 h-8 shadow-md">
                     <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'}/>
                     <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                   </Avatar>
                 ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0 shadow-md text-white">
                    <UserIcon />
                  </div>
                 )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-muted-foreground"><MoreVertical /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {user ? (
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={handleLogin}>
                        <LogIn className="mr-2 h-4 w-4" />
                        <span>Login with Google</span>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}