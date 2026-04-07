import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { allContent as seedContent, type ContentItem } from '../data/content';

interface ContentContextType {
  content: ContentItem[];
  updateContent: (id: string, updates: Partial<ContentItem>) => void;
  addContent: (item: ContentItem) => void;
  getContentById: (id: string) => ContentItem | undefined;
}

const ContentContext = createContext<ContentContextType | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ContentItem[]>(seedContent);

  const updateContent = useCallback((id: string, updates: Partial<ContentItem>) => {
    setContent(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  }, []);

  const addContent = useCallback((item: ContentItem) => {
    setContent(prev => [item, ...prev]);
  }, []);

  const getContentById = useCallback((id: string) => {
    return content.find(item => item.id === id);
  }, [content]);

  return (
    <ContentContext.Provider value={{ content, updateContent, addContent, getContentById }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
}
