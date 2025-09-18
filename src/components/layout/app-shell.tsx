"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Bot,
  Bug,
  CloudSun,
  Home,
  LineChart,
  Sprout,
  Users,
  PanelLeft,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/icons/logo";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/crop-recommendation", label: "Crop Recommendation", icon: Sprout },
  { href: "/pest-disease", label: "Pest & Disease", icon: Bug },
  { href: "/weather", label: "Weather Advisory", icon: CloudSun },
  { href: "/market-prices", label: "Market Prices", icon: LineChart },
  { href: "/assistant", label: "AI Assistant", icon: Bot },
  { href: "/community", label: "Community Forum", icon: Users },
];

function MainSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar
      collapsible="icon"
      className="border-r"
      variant="sidebar"
      side="left"
    >
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="w-8 h-8 text-primary" />
          <span className="text-lg font-headline font-semibold">KrishiMitra AI</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                  asChild
                >
                  <div>
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </div>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://picsum.photos/seed/farmer/100/100" alt="Farmer" />
            <AvatarFallback>F</AvatarFallback>
          </Avatar>
          <div className="overflow-hidden whitespace-nowrap">
             <p className="font-semibold text-sm">A. Kumar</p>
             <p className="text-xs text-muted-foreground truncate">ankit.kumar@example.com</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

function MobileHeader() {
  const { toggleSidebar } = useSidebar();
  return (
     <header className="md:hidden flex items-center h-14 px-4 border-b bg-card">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} >
            <PanelLeft className="h-6 w-6"/>
            <span className="sr-only">Toggle Sidebar</span>
        </Button>
        <div className="flex items-center gap-2 ml-4">
            <Logo className="w-7 h-7 text-primary" />
            <span className="text-md font-headline font-semibold">KrishiMitra AI</span>
        </div>
     </header>
  )
}


export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <MainSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <MobileHeader />
          <SidebarInset className="p-4 sm:p-6 lg:p-8">
            {children}
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
