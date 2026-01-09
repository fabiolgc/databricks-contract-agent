import { useEffect, useState } from 'react';
import { BrowserChatStorage, type BrowserChat } from '@/lib/browser-storage';

export function useBrowserHistory() {
  const [chats, setChats] = useState<BrowserChat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load chats from browser storage
    const loadChats = () => {
      try {
        const storedChats = BrowserChatStorage.getAllChats();
        setChats(storedChats);
      } catch (error) {
        console.error('Error loading browser history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChats();
  }, []);

  const refreshChats = () => {
    const storedChats = BrowserChatStorage.getAllChats();
    setChats(storedChats);
  };

  return {
    chats,
    isLoading,
    refreshChats,
  };
}
