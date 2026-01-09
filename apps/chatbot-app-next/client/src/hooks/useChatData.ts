import useSWR from 'swr';
import type { Chat } from '@chat-template/db';
import type { ChatMessage } from '@chat-template/core';
import { convertToUIMessages } from '@/lib/utils';
import { BrowserChatStorage } from '@/lib/browser-storage';

interface ChatData {
  chat: Chat;
  messages: ChatMessage[];
}

/**
 * Fetcher function that loads both chat metadata and messages
 * Returns null if chat is not found or user doesn't have access
 */
async function fetchChatData(url: string): Promise<ChatData | null> {
  const chatId = url.split('/').pop();
  if (!chatId) return null;

  try {
    // Try to fetch from server first
    const chatResponse = await fetch(`/api/chat/${chatId}`, {
      credentials: 'include',
    });

    if (chatResponse.ok) {
      const chat = await chatResponse.json();

      // Fetch messages
      const messagesResponse = await fetch(`/api/messages/${chatId}`, {
        credentials: 'include',
      });

      if (messagesResponse.ok) {
        const messagesFromDb = await messagesResponse.json();
        const messages = convertToUIMessages(messagesFromDb);

        return {
          chat,
          messages,
        };
      }
    }

    // If server fetch fails, try localStorage
    const browserChat = BrowserChatStorage.getChat(chatId);
    if (browserChat) {
      // Convert browser storage format to expected format
      const chat: Chat = {
        id: browserChat.id,
        title: browserChat.title,
        createdAt: new Date(browserChat.createdAt).toISOString(),
        userId: 'local-user',
        visibility: 'private' as const,
      };

      const messages: ChatMessage[] = browserChat.messages.map((msg) => ({
        id: msg.id,
        chatId: msg.chatId,
        role: msg.role,
        parts: [{ type: 'text' as const, text: msg.content }],
        createdAt: new Date(msg.timestamp).toISOString(),
      }));

      return {
        chat,
        messages,
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching chat data:', error);
    
    // Fallback to localStorage on error
    const browserChat = BrowserChatStorage.getChat(chatId);
    if (browserChat) {
      const chat: Chat = {
        id: browserChat.id,
        title: browserChat.title,
        createdAt: new Date(browserChat.createdAt).toISOString(),
        userId: 'local-user',
        visibility: 'private' as const,
      };

      const messages: ChatMessage[] = browserChat.messages.map((msg) => ({
        id: msg.id,
        chatId: msg.chatId,
        role: msg.role,
        parts: [{ type: 'text' as const, text: msg.content }],
        createdAt: new Date(msg.timestamp).toISOString(),
      }));

      return {
        chat,
        messages,
      };
    }

    return null;
  }
}

/**
 * Custom hook to fetch chat data using SWR
 * Provides automatic caching, deduplication, and race condition prevention
 *
 * @param chatId - The ID of the chat to load
 * @param enabled - Whether to fetch data (defaults to true when chatId is provided)
 * @returns Chat data, loading state, and error state
 */
export function useChatData(chatId: string | undefined, enabled = true) {
  const { data, error, isLoading, mutate } = useSWR<ChatData | null>(
    // Only fetch if chatId exists and enabled is true
    chatId && enabled ? `/chat/${chatId}` : null,
    fetchChatData,
    {
      // Revalidate when window regains focus
      revalidateOnFocus: false,
      // Don't revalidate on reconnect (messages are loaded via stream anyway)
      revalidateOnReconnect: false,
      // Keep previous data while loading new data to prevent flashing
      keepPreviousData: true,
      // Dedupe requests within 2 seconds
      dedupingInterval: 2000,
    }
  );

  return {
    chatData: data,
    isLoading,
    error: error ? 'Failed to load chat' : data === null && !isLoading ? 'Chat not found or you do not have access' : null,
    mutate, // Expose mutate for manual cache updates if needed
  };
}
