// Browser storage utilities for chat history
export interface BrowserChatMessage {
  id: string;
  chatId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface BrowserChat {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: BrowserChatMessage[];
}

const STORAGE_KEY = 'databricks_chat_history';
const MAX_CHATS = 100; // Limit to prevent localStorage overflow

export class BrowserChatStorage {
  private static getStorage(): BrowserChat[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading chat history from localStorage:', error);
      return [];
    }
  }

  private static setStorage(chats: BrowserChat[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
    } catch (error) {
      console.error('Error saving chat history to localStorage:', error);
    }
  }

  static getAllChats(): BrowserChat[] {
    return this.getStorage().sort((a, b) => b.updatedAt - a.updatedAt);
  }

  static getChat(chatId: string): BrowserChat | null {
    const chats = this.getStorage();
    return chats.find((chat) => chat.id === chatId) || null;
  }

  static saveChat(chat: BrowserChat): void {
    const chats = this.getStorage();
    const existingIndex = chats.findIndex((c) => c.id === chat.id);

    if (existingIndex >= 0) {
      chats[existingIndex] = { ...chat, updatedAt: Date.now() };
    } else {
      chats.push({ ...chat, updatedAt: Date.now() });
    }

    // Keep only the most recent MAX_CHATS
    if (chats.length > MAX_CHATS) {
      chats.sort((a, b) => b.updatedAt - a.updatedAt);
      chats.splice(MAX_CHATS);
    }

    this.setStorage(chats);
  }

  static deleteChat(chatId: string): void {
    const chats = this.getStorage();
    const filtered = chats.filter((chat) => chat.id !== chatId);
    this.setStorage(filtered);
  }

  static clearAllChats(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  }

  static addMessageToChat(
    chatId: string,
    message: BrowserChatMessage,
  ): void {
    const chat = this.getChat(chatId);
    if (chat) {
      chat.messages.push(message);
      this.saveChat(chat);
    }
  }

  static getChatMessages(chatId: string): BrowserChatMessage[] {
    const chat = this.getChat(chatId);
    return chat ? chat.messages : [];
  }
}
