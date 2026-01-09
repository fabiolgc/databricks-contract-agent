import { isToday, isYesterday, subMonths, subWeeks } from 'date-fns';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

type ClientUser = {
  email: string;
  name?: string;
  preferredUsername?: string;
};
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useConfig } from '@/hooks/use-config';
import { useLanguage } from '@/contexts/LanguageContext';
import { BrowserChatStorage, type BrowserChat } from '@/lib/browser-storage';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  useSidebar,
} from '@/components/ui/sidebar';
import type { Chat } from '@chat-template/db';
import { fetcher } from '@/lib/utils';
import { ChatItem } from './sidebar-history-item';
import useSWRInfinite from 'swr/infinite';
import { LoaderIcon } from 'lucide-react';

type GroupedChats = {
  today: Chat[];
  yesterday: Chat[];
  lastWeek: Chat[];
  lastMonth: Chat[];
  older: Chat[];
};

export interface ChatHistory {
  chats: Array<Chat>;
  hasMore: boolean;
}

const PAGE_SIZE = 20;

const groupChatsByDate = (chats: Chat[]): GroupedChats => {
  const now = new Date();
  const oneWeekAgo = subWeeks(now, 1);
  const oneMonthAgo = subMonths(now, 1);

  return chats.reduce(
    (groups, chat) => {
      const chatDate = new Date(chat.createdAt);

      if (isToday(chatDate)) {
        groups.today.push(chat);
      } else if (isYesterday(chatDate)) {
        groups.yesterday.push(chat);
      } else if (chatDate > oneWeekAgo) {
        groups.lastWeek.push(chat);
      } else if (chatDate > oneMonthAgo) {
        groups.lastMonth.push(chat);
      } else {
        groups.older.push(chat);
      }

      return groups;
    },
    {
      today: [],
      yesterday: [],
      lastWeek: [],
      lastMonth: [],
      older: [],
    } as GroupedChats,
  );
};

export function getChatHistoryPaginationKey(
  pageIndex: number,
  previousPageData: ChatHistory,
) {
  if (previousPageData && previousPageData.hasMore === false) {
    return null;
  }

  if (pageIndex === 0) return `/api/history?limit=${PAGE_SIZE}`;

  const firstChatFromPage = previousPageData.chats.at(-1);

  if (!firstChatFromPage) return null;

  return `/api/history?ending_before=${firstChatFromPage.id}&limit=${PAGE_SIZE}`;
}

export function SidebarHistory({ user }: { user?: ClientUser | null }) {
  const { setOpenMobile } = useSidebar();
  const { id } = useParams();
  const { chatHistoryEnabled } = useConfig();
  const { t } = useLanguage();

  const {
    data: paginatedChatHistories,
    setSize,
    isValidating,
    isLoading,
    mutate,
  } = useSWRInfinite<ChatHistory>(getChatHistoryPaginationKey, fetcher, {
    fallbackData: [],
  });

  // Browser storage state
  const [browserChats, setBrowserChats] = useState<BrowserChat[]>([]);
  const [isBrowserLoading, setIsBrowserLoading] = useState(true);

  // Load browser storage chats
  useEffect(() => {
    const loadBrowserChats = () => {
      const chats = BrowserChatStorage.getAllChats();
      setBrowserChats(chats);
      setIsBrowserLoading(false);
    };

    loadBrowserChats();

    // Listen for updates to browser history
    const handleBrowserHistoryUpdate = () => {
      loadBrowserChats();
    };

    window.addEventListener('browser-history-updated', handleBrowserHistoryUpdate);

    return () => {
      window.removeEventListener('browser-history-updated', handleBrowserHistoryUpdate);
    };
  }, []);

  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const hasReachedEnd = paginatedChatHistories
    ? paginatedChatHistories.some((page) => page.hasMore === false)
    : false;

  const hasEmptyChatHistory = paginatedChatHistories
    ? paginatedChatHistories.every((page) => page.chats.length === 0)
    : false;

  const handleDelete = async () => {
    if (!deleteId) return;

    // If chatHistoryEnabled, delete from server
    if (chatHistoryEnabled) {
      const deletePromise = fetch(`/api/chat/${deleteId}`, {
        method: 'DELETE',
      });

      toast.promise(deletePromise, {
        loading: t.deletingChat,
        success: () => {
          mutate((chatHistories) => {
            if (chatHistories) {
              return chatHistories.map((chatHistory) => ({
                ...chatHistory,
                chats: chatHistory.chats.filter((chat) => chat.id !== deleteId),
              }));
            }
          });

          return t.chatDeleted;
        },
        error: t.failedToDelete,
      });
    } else {
      // Delete from browser storage
      try {
        BrowserChatStorage.deleteChat(deleteId);
        setBrowserChats(BrowserChatStorage.getAllChats());
        toast.success(t.chatDeleted);
      } catch (error) {
        toast.error(t.failedToDelete);
      }
    }

    setShowDeleteDialog(false);

    // Navigate away if we're viewing the deleted chat
    if (window.location.pathname === `/chat/${deleteId}` || deleteId === id) {
      navigate('/');
    }
  };

  if (!user) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="flex w-full flex-row items-center justify-center gap-2 px-2 text-sm text-zinc-500">
            {t.loginToSave}
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  // Show loading state
  const isLoadingAny = chatHistoryEnabled ? isLoading : isBrowserLoading;
  if (isLoadingAny) {
    return (
      <SidebarGroup>
        <div className="px-2 py-1 text-sidebar-foreground/50 text-xs">
          {t.today}
        </div>
        <SidebarGroupContent>
          <div className="flex flex-col">
            {[44, 32, 28, 64, 52].map((item) => (
              <div
                key={item}
                className="flex h-8 items-center gap-2 rounded-md px-2"
              >
                <div
                  className="h-4 max-w-(--skeleton-width) flex-1 rounded-md bg-sidebar-accent-foreground/10"
                  style={
                    {
                      '--skeleton-width': `${item}%`,
                    } as React.CSSProperties
                  }
                />
              </div>
            ))}
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  // Check if empty
  const isEmpty = chatHistoryEnabled 
    ? hasEmptyChatHistory 
    : browserChats.length === 0;

  if (isEmpty) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="flex w-full flex-row items-center justify-center gap-2 px-2 text-sm text-zinc-500">
            {t.noHistory}
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  // Convert browser chats to Chat format for rendering
  const convertBrowserChatToChat = (browserChat: BrowserChat): Chat => ({
    id: browserChat.id,
    title: browserChat.title,
    createdAt: new Date(browserChat.createdAt).toISOString(),
    userId: 'local-user',
    visibility: 'private' as const,
  });

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {(() => {
              // Use browser chats if no database, otherwise use server chats
              const chatsFromHistory = chatHistoryEnabled
                ? paginatedChatHistories?.flatMap(
                    (paginatedChatHistory) => paginatedChatHistory.chats,
                  ) || []
                : browserChats.map(convertBrowserChatToChat);

              const groupedChats = groupChatsByDate(chatsFromHistory);

                return (
                  <div className="flex flex-col gap-6">
                    {groupedChats.today.length > 0 && (
                      <div>
                        <div className="px-2 py-1 text-sidebar-foreground/50 text-xs">
                          {t.today}
                        </div>
                        {groupedChats.today.map((chat) => (
                          <ChatItem
                            key={chat.id}
                            chat={chat}
                            isActive={chat.id === id}
                            onDelete={(chatId) => {
                              setDeleteId(chatId);
                              setShowDeleteDialog(true);
                            }}
                            setOpenMobile={setOpenMobile}
                          />
                        ))}
                      </div>
                    )}

                    {groupedChats.yesterday.length > 0 && (
                      <div>
                        <div className="px-2 py-1 text-sidebar-foreground/50 text-xs">
                          {t.yesterday}
                        </div>
                        {groupedChats.yesterday.map((chat) => (
                          <ChatItem
                            key={chat.id}
                            chat={chat}
                            isActive={chat.id === id}
                            onDelete={(chatId) => {
                              setDeleteId(chatId);
                              setShowDeleteDialog(true);
                            }}
                            setOpenMobile={setOpenMobile}
                          />
                        ))}
                      </div>
                    )}

                    {groupedChats.lastWeek.length > 0 && (
                      <div>
                        <div className="px-2 py-1 text-sidebar-foreground/50 text-xs">
                          {t.lastWeek}
                        </div>
                        {groupedChats.lastWeek.map((chat) => (
                          <ChatItem
                            key={chat.id}
                            chat={chat}
                            isActive={chat.id === id}
                            onDelete={(chatId) => {
                              setDeleteId(chatId);
                              setShowDeleteDialog(true);
                            }}
                            setOpenMobile={setOpenMobile}
                          />
                        ))}
                      </div>
                    )}

                    {groupedChats.lastMonth.length > 0 && (
                      <div>
                        <div className="px-2 py-1 text-sidebar-foreground/50 text-xs">
                          {t.lastMonth}
                        </div>
                        {groupedChats.lastMonth.map((chat) => (
                          <ChatItem
                            key={chat.id}
                            chat={chat}
                            isActive={chat.id === id}
                            onDelete={(chatId) => {
                              setDeleteId(chatId);
                              setShowDeleteDialog(true);
                            }}
                            setOpenMobile={setOpenMobile}
                          />
                        ))}
                      </div>
                    )}

                    {groupedChats.older.length > 0 && (
                      <div>
                        <div className="px-2 py-1 text-sidebar-foreground/50 text-xs">
                          {t.older}
                        </div>
                        {groupedChats.older.map((chat) => (
                          <ChatItem
                            key={chat.id}
                            chat={chat}
                            isActive={chat.id === id}
                            onDelete={(chatId) => {
                              setDeleteId(chatId);
                              setShowDeleteDialog(true);
                            }}
                            setOpenMobile={setOpenMobile}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
          </SidebarMenu>

          {/* Only show pagination controls for server-based history */}
          {chatHistoryEnabled && (
            <>
              <motion.div
                onViewportEnter={() => {
                  if (!isValidating && !hasReachedEnd) {
                    setSize((size) => size + 1);
                  }
                }}
              />

              {hasReachedEnd ? (
                <div className="mt-8 flex w-full flex-row items-center justify-center gap-2 px-2 text-sm text-zinc-500">
                  {t.endOfHistory}
                </div>
              ) : (
                <div className="mt-8 flex flex-row items-center gap-2 p-2 text-zinc-500 dark:text-zinc-400">
                  <div className="animate-spin">
                    <LoaderIcon />
                  </div>
                  <div>{t.loadingChats}</div>
                </div>
              )}
            </>
          )}
        </SidebarGroupContent>
      </SidebarGroup>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.areYouSure}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.clearHistoryDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              {t.continue}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
