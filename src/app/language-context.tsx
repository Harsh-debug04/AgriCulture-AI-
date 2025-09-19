// src/app/language-context.tsx
'use client';

import { createContext, useState, useContext, ReactNode, useCallback } from 'react';

type LanguageContextType = {
  language: string;
  setLanguage: (language: string) => void;
  undoChat: () => void;
  undoCounter: number;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState('en');
  const [undoCounter, setUndoCounter] = useState(0);

  const triggerUndoChat = useCallback(() => {
    setUndoCounter(prev => prev + 1);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, undoChat: triggerUndoChat, undoCounter }}>
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
