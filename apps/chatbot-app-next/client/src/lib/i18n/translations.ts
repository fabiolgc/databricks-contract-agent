// Translation definitions for the application
export type Language = 'en' | 'pt-BR' | 'es';

export interface Translations {
  // Navigation and layout
  newChat: string;
  chatHistory: string;
  toggleSidebar: string;
  
  // User menu
  toggleTheme: string;
  darkMode: string;
  lightMode: string;
  language: string;
  clearHistory: string;
  clearHistoryConfirm: string;
  clearHistoryDescription: string;
  
  // Chat interface
  typeMessage: string;
  send: string;
  stop: string;
  regenerate: string;
  copy: string;
  copied: string;
  edit: string;
  delete: string;
  more: string;
  share: string;
  private: string;
  public: string;
  close: string;
  navigationMenu: string;
  
  // History
  today: string;
  yesterday: string;
  lastWeek: string;
  lastMonth: string;
  older: string;
  noHistory: string;
  historyDisabled: string;
  loadingChats: string;
  endOfHistory: string;
  
  // Confirmations
  areYouSure: string;
  cancel: string;
  continue: string;
  yes: string;
  no: string;
  
  // Messages
  deletingChat: string;
  chatDeleted: string;
  failedToDelete: string;
  historyCleared: string;
  failedToClear: string;
  
  // Chat status
  thinking: string;
  generating: string;
  ephemeral: string;
  readonly: string;
  
  // Auth
  loginToSave: string;
  loadingAuth: string;
  
  // Errors
  error: string;
  tryAgain: string;
  
  // Greeting
  greeting: string;
  greetingSubtitle: string;
  
  // Attachments
  fileTooLarge: string;
  attachFile: string;
  removeAttachment: string;
  
  // Scroll
  scrollToBottom: string;
  
  // Suggested actions
  suggestionHelp: string;
  suggestionTellMe: string;
  
  // Reasoning
  thinkingEllipsis: string;
  thoughtFor: string;
  thoughts: string;
  
  // MCP Tool Approval
  pending: string;
  allowed: string;
  denied: string;
  toolCallRequest: string;
  toolPermissionRequired: string;
  submitting: string;
  allow: string;
  deny: string;
}

export const translations: Record<Language, Translations> = {
  'en': {
    newChat: 'New Chat',
    chatHistory: 'Chat History',
    toggleSidebar: 'Toggle Sidebar',
    
    toggleTheme: 'Toggle theme',
    darkMode: 'dark mode',
    lightMode: 'light mode',
    language: 'Language',
    clearHistory: 'Clear history',
    clearHistoryConfirm: 'Clear all chat history?',
    clearHistoryDescription: 'This will permanently delete all chat history stored in your browser. This action cannot be undone.',
    
    typeMessage: 'Type a message...',
    send: 'Send',
    stop: 'Stop',
    regenerate: 'Regenerate',
    copy: 'Copy',
    copied: 'Copied!',
    edit: 'Edit',
    delete: 'Delete',
    more: 'More',
    share: 'Share',
    private: 'Private',
    public: 'Public',
    close: 'Close',
    navigationMenu: 'Navigation Menu',
    
    today: 'Today',
    yesterday: 'Yesterday',
    lastWeek: 'Last 7 days',
    lastMonth: 'Last 30 days',
    older: 'Older than last month',
    noHistory: 'Your conversations will appear here once you start chatting!',
    historyDisabled: 'Chat history is disabled - conversations are not saved',
    loadingChats: 'Loading Chats...',
    endOfHistory: 'You have reached the end of your chat history.',
    
    areYouSure: 'Are you absolutely sure?',
    cancel: 'Cancel',
    continue: 'Continue',
    yes: 'Yes',
    no: 'No',
    
    deletingChat: 'Deleting chat...',
    chatDeleted: 'Chat deleted successfully',
    failedToDelete: 'Failed to delete chat',
    historyCleared: 'Chat history cleared successfully',
    failedToClear: 'Failed to clear chat history',
    
    thinking: 'Thinking...',
    generating: 'Generating...',
    ephemeral: 'Ephemeral',
    readonly: 'Read Only',
    
    loginToSave: 'Login to save and revisit previous chats!',
    loadingAuth: 'Loading auth status',
    
    error: 'Error',
    tryAgain: 'Try again',
    
    greeting: 'Hello there!',
    greetingSubtitle: 'How can I help you today?',
    
    fileTooLarge: 'File is too large',
    attachFile: 'Attach file',
    removeAttachment: 'Remove attachment',
    
    scrollToBottom: 'Scroll to bottom',
    
    suggestionHelp: 'How can you help me?',
    suggestionTellMe: 'Tell me something I might not know',
    
    thinkingEllipsis: 'Thinking...',
    thoughtFor: 'Thought for',
    thoughts: 'Thoughts',
    
    pending: 'Pending',
    allowed: 'Allowed',
    denied: 'Denied',
    toolCallRequest: 'Tool Call Request',
    toolPermissionRequired: 'This tool requires your permission to run.',
    submitting: 'Submitting...',
    allow: 'Allow',
    deny: 'Deny',
  },
  
  'pt-BR': {
    newChat: 'Novo Chat',
    chatHistory: 'Histórico de Chats',
    toggleSidebar: 'Alternar Barra Lateral',
    
    toggleTheme: 'Alternar tema',
    darkMode: 'modo escuro',
    lightMode: 'modo claro',
    language: 'Idioma',
    clearHistory: 'Limpar histórico',
    clearHistoryConfirm: 'Limpar todo o histórico de chat?',
    clearHistoryDescription: 'Isso irá deletar permanentemente todo o histórico de chat armazenado no seu navegador. Esta ação não pode ser desfeita.',
    
    typeMessage: 'Digite uma mensagem...',
    send: 'Enviar',
    stop: 'Parar',
    regenerate: 'Regenerar',
    copy: 'Copiar',
    copied: 'Copiado!',
    edit: 'Editar',
    delete: 'Deletar',
    more: 'Mais',
    share: 'Compartilhar',
    private: 'Privado',
    public: 'Público',
    close: 'Fechar',
    navigationMenu: 'Menu de Navegação',
    
    today: 'Hoje',
    yesterday: 'Ontem',
    lastWeek: 'Últimos 7 dias',
    lastMonth: 'Últimos 30 dias',
    older: 'Mais antigo que o mês passado',
    noHistory: 'Suas conversas aparecerão aqui quando você começar a conversar!',
    historyDisabled: 'Histórico de chat desabilitado - conversas não são salvas',
    loadingChats: 'Carregando Chats...',
    endOfHistory: 'Você chegou ao fim do seu histórico de chat.',
    
    areYouSure: 'Você tem certeza absoluta?',
    cancel: 'Cancelar',
    continue: 'Continuar',
    yes: 'Sim',
    no: 'Não',
    
    deletingChat: 'Deletando chat...',
    chatDeleted: 'Chat deletado com sucesso',
    failedToDelete: 'Falha ao deletar chat',
    historyCleared: 'Histórico de chat limpo com sucesso',
    failedToClear: 'Falha ao limpar histórico de chat',
    
    thinking: 'Pensando...',
    generating: 'Gerando...',
    ephemeral: 'Efêmero',
    readonly: 'Somente Leitura',
    
    loginToSave: 'Faça login para salvar e revisar chats anteriores!',
    loadingAuth: 'Carregando status de autenticação',
    
    error: 'Erro',
    tryAgain: 'Tente novamente',
    
    greeting: 'Olá!',
    greetingSubtitle: 'Como posso ajudá-lo hoje?',
    
    fileTooLarge: 'Arquivo muito grande',
    attachFile: 'Anexar arquivo',
    removeAttachment: 'Remover anexo',
    
    scrollToBottom: 'Rolar para o fim',
    
    suggestionHelp: 'Como você pode me ajudar?',
    suggestionTellMe: 'Me conte algo que eu possa não saber',
    
    thinkingEllipsis: 'Pensando...',
    thoughtFor: 'Pensou por',
    thoughts: 'Pensamentos',
    
    pending: 'Pendente',
    allowed: 'Permitido',
    denied: 'Negado',
    toolCallRequest: 'Solicitação de Ferramenta',
    toolPermissionRequired: 'Esta ferramenta requer sua permissão para executar.',
    submitting: 'Enviando...',
    allow: 'Permitir',
    deny: 'Negar',
  },
  
  'es': {
    newChat: 'Nuevo Chat',
    chatHistory: 'Historial de Chats',
    toggleSidebar: 'Alternar Barra Lateral',
    
    toggleTheme: 'Cambiar tema',
    darkMode: 'modo oscuro',
    lightMode: 'modo claro',
    language: 'Idioma',
    clearHistory: 'Limpiar historial',
    clearHistoryConfirm: '¿Limpiar todo el historial de chat?',
    clearHistoryDescription: 'Esto eliminará permanentemente todo el historial de chat almacenado en su navegador. Esta acción no se puede deshacer.',
    
    typeMessage: 'Escribe un mensaje...',
    send: 'Enviar',
    stop: 'Detener',
    regenerate: 'Regenerar',
    copy: 'Copiar',
    copied: '¡Copiado!',
    edit: 'Editar',
    delete: 'Eliminar',
    more: 'Más',
    share: 'Compartir',
    private: 'Privado',
    public: 'Público',
    close: 'Cerrar',
    navigationMenu: 'Menú de Navegación',
    
    today: 'Hoy',
    yesterday: 'Ayer',
    lastWeek: 'Últimos 7 días',
    lastMonth: 'Últimos 30 días',
    older: 'Más antiguo que el mes pasado',
    noHistory: '¡Sus conversaciones aparecerán aquí una vez que comience a chatear!',
    historyDisabled: 'Historial de chat deshabilitado - las conversaciones no se guardan',
    loadingChats: 'Cargando Chats...',
    endOfHistory: 'Has llegado al final de tu historial de chat.',
    
    areYouSure: '¿Estás absolutamente seguro?',
    cancel: 'Cancelar',
    continue: 'Continuar',
    yes: 'Sí',
    no: 'No',
    
    deletingChat: 'Eliminando chat...',
    chatDeleted: 'Chat eliminado exitosamente',
    failedToDelete: 'Error al eliminar chat',
    historyCleared: 'Historial de chat limpiado exitosamente',
    failedToClear: 'Error al limpiar historial de chat',
    
    thinking: 'Pensando...',
    generating: 'Generando...',
    ephemeral: 'Efímero',
    readonly: 'Solo Lectura',
    
    loginToSave: '¡Inicia sesión para guardar y revisar chats anteriores!',
    loadingAuth: 'Cargando estado de autenticación',
    
    error: 'Error',
    tryAgain: 'Intentar de nuevo',
    
    greeting: '¡Hola!',
    greetingSubtitle: '¿Cómo puedo ayudarte hoy?',
    
    fileTooLarge: 'Archivo demasiado grande',
    attachFile: 'Adjuntar archivo',
    removeAttachment: 'Eliminar adjunto',
    
    scrollToBottom: 'Desplazar al final',
    
    suggestionHelp: '¿Cómo puedes ayudarme?',
    suggestionTellMe: 'Cuéntame algo que quizás no sepa',
    
    thinkingEllipsis: 'Pensando...',
    thoughtFor: 'Pensó durante',
    thoughts: 'Pensamientos',
    
    pending: 'Pendiente',
    allowed: 'Permitido',
    denied: 'Denegado',
    toolCallRequest: 'Solicitud de Herramienta',
    toolPermissionRequired: 'Esta herramienta requiere tu permiso para ejecutarse.',
    submitting: 'Enviando...',
    allow: 'Permitir',
    deny: 'Denegar',
  },
};

export const languageNames: Record<Language, string> = {
  'en': 'English',
  'pt-BR': 'Português',
  'es': 'Español',
};

// Flag emojis for each language
export const languageFlags: Record<Language, string> = {
  'en': '🇺🇸',
  'pt-BR': '🇧🇷',
  'es': '🇪🇸',
};
