import { ChevronUp, LoaderIcon, Trash2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useSession } from '@/contexts/SessionContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { getAiGradientStyle } from './animation-assistant-icon';
import type { ClientSession } from '@chat-template/auth';
import { BrowserChatStorage } from '@/lib/browser-storage';
import { toast } from './toast';
import { languageFlags, languageNames, type Language } from '@/lib/i18n/translations';

export function SidebarUserNav({
  user,
  preferredUsername,
}: {
  user: ClientSession['user'];
  preferredUsername: string | null;
}) {
  const { session, loading } = useSession();
  const data = session;
  const status = loading
    ? 'loading'
    : session
      ? 'authenticated'
      : 'unauthenticated';
  const { setTheme, resolvedTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [showClearDialog, setShowClearDialog] = useState(false);

  // Use preferred username from Databricks Apps if available, otherwise fall back to existing logic
  const displayName =
    preferredUsername || data?.user?.name || user?.email || 'User';

  const handleClearHistory = () => {
    try {
      BrowserChatStorage.clearAllChats();
      toast({
        type: 'success',
        description: t.historyCleared,
      });
      // Trigger a page reload to refresh the history sidebar
      window.location.reload();
    } catch (error) {
      toast({
        type: 'error',
        description: t.failedToClear,
      });
    }
    setShowClearDialog(false);
  };

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {status === 'loading' ? (
                <SidebarMenuButton className="h-10 justify-between bg-background data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                  <div className="flex flex-row gap-2">
                    <div className="size-6 animate-pulse rounded-full bg-zinc-500/30" />
                    <span className="animate-pulse rounded-md bg-zinc-500/30 text-transparent">
                      {t.loadingAuth}
                    </span>
                  </div>
                  <div className="animate-spin text-zinc-500">
                    <LoaderIcon />
                  </div>
                </SidebarMenuButton>
              ) : (
                <SidebarMenuButton
                  data-testid="user-nav-button"
                  className="h-10 bg-background data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div
                    style={{ ...getAiGradientStyle().styling }}
                    className="flex size-6 items-center justify-center rounded-full"
                  >
                    {displayName.charAt(0)}
                  </div>
                  <span data-testid="user-email" className="truncate">
                    {displayName}
                  </span>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent
              data-testid="user-nav-menu"
              side="top"
              className="w-(--radix-popper-anchor-width)"
            >
              <DropdownMenuItem
                data-testid="user-nav-item-theme"
                className="cursor-pointer"
                onSelect={() =>
                  setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
                }
              >
                {`${t.toggleTheme} ${resolvedTheme === 'light' ? t.darkMode : t.lightMode}`}
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer">
                  <span className="mr-2">{languageFlags[language]}</span>
                  {t.language}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={() => setLanguage('en')}
                  >
                    <span className="mr-2">{languageFlags['en']}</span>
                    {languageNames['en']}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={() => setLanguage('pt-BR')}
                  >
                    <span className="mr-2">{languageFlags['pt-BR']}</span>
                    {languageNames['pt-BR']}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={() => setLanguage('es')}
                  >
                    <span className="mr-2">{languageFlags['es']}</span>
                    {languageNames['es']}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem
                className="cursor-pointer text-red-600 dark:text-red-400"
                onSelect={() => setShowClearDialog(true)}
              >
                <Trash2 className="mr-2 size-4" />
                {t.clearHistory}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.clearHistoryConfirm}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.clearHistoryDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearHistory}>
              {t.continue}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
