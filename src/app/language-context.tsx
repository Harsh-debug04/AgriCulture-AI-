// src/app/language-context.tsx
'use client';

import { createContext, useState, useContext, ReactNode, useCallback } from 'react';

type LanguageContextType = {
  language: string;
  setLanguage: (language: string) => void;
  clearChat: () => void;
  triggerClearChat: () => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState('en');
  const [clearCounter, setClearCounter] = useState(0);

  const triggerClearChat = useCallback(() => {
    setClearCounter(prev => prev + 1);
  }, []);
  
  const clearChat = useCallback(() => {
    // This is a placeholder that will be overridden by the page
  }, []);


  return (
    <LanguageContext.Provider value={{ language, setLanguage, clearChat: triggerClearChat, triggerClearChat }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
