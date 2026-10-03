import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { Chat, Contact, Message } from '../types';
import { mockChats, mockMessages } from '../mock/data';

type ChatContextType = {
  chats: Chat[];
  messages: Record<string, Message[]>;
  addMessage: (chatId: string, message: Message) => void;
  clearUnread: (chatId: string) => void;
  setActiveChat: (chatId: string | null) => void;
  startMockTyping: (chatId: string, durationMs?: number) => void;
  ensureChatForContact: (contact: Contact) => string;
  getChat: (chatId: string) => Chat | undefined;
  getMessages: (chatId: string) => Message[];
};

const EMPTY_MESSAGES: Message[] = [];
const MOCK_TYPING_MS = 2500;
const INITIAL_TYPING_MS = 10000;

const MOCK_REPLIES = [
  'Got it',
  'Sounds good!',
  'Haha, nice',
  'Let me check and get back to you',
  'Okay, talk later',
];

const updateChat = (
  chats: Chat[],
  chatId: string,
  update: (chat: Chat) => Chat,
): Chat[] => {
  let changed = false;

  const next = chats.map((chat) => {
    if (chat.id !== chatId) {
      return chat;
    }

    const updated = update(chat);

    if (updated !== chat) {
      changed = true;
    }

    return updated;
  });

  return changed ? next : chats;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [messages, setMessages] =
    useState<Record<string, Message[]>>(mockMessages);

  const typingTimersRef = useRef<
    Map<string, ReturnType<typeof setTimeout>>
  >(new Map());

  const replyCountRef = useRef(0);
  const activeChatIdRef = useRef<string | null>(null);

  const knownChatIdsRef = useRef<Set<string>>(
    new Set(mockChats.map((chat) => chat.id)),
  );

  const addMessage = useCallback((chatId: string, message: Message) => {
    setMessages((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] ?? []), message],
    }));

    setChats((prev) =>
      updateChat(prev, chatId, (chat) => ({
        ...chat,
        lastMessage: message.text,
        lastMessageTime: message.timestamp,
      })),
    );
  }, []);

  const clearUnread = useCallback((chatId: string) => {
    setChats((prev) =>
      updateChat(prev, chatId, (chat) =>
        chat.unreadCount === 0 ? chat : { ...chat, unreadCount: 0 },
      ),
    );
  }, []);

  const setActiveChat = useCallback(
    (chatId: string | null) => {
      activeChatIdRef.current = chatId;

      if (chatId !== null) {
        clearUnread(chatId);
      }
    },
    [clearUnread],
  );

  const ensureChatForContact = useCallback((contact: Contact): string => {
    const known = knownChatIdsRef.current;

    if (!known.has(contact.id)) {
      known.add(contact.id);

      const newChat: Chat = {
        id: contact.id,
        name: contact.name,
        avatar: contact.avatar,
        unreadCount: 0,
        isOnline: false,
        isTyping: false,
      };

      setChats((prev) =>
        prev.some((chat) => chat.id === contact.id)
          ? prev
          : [newChat, ...prev],
      );
    }

    return contact.id;
  }, []);

  const startMockTyping = useCallback(
    (chatId: string, durationMs: number = MOCK_TYPING_MS) => {
      const timers = typingTimersRef.current;

      if (timers.has(chatId)) {
        return;
      }

      setChats((prev) =>
        updateChat(prev, chatId, (chat) =>
          chat.isTyping ? chat : { ...chat, isTyping: true },
        ),
      );

      const timer = setTimeout(() => {
        timers.delete(chatId);

        const isActive = activeChatIdRef.current === chatId;

        const reply: Message = {
          id: `in-${Date.now()}-${replyCountRef.current}`,
          chatId,
          senderId: `contact-${chatId}`,
          text: MOCK_REPLIES[
            replyCountRef.current % MOCK_REPLIES.length
          ],
          timestamp: new Date(),
          status: 'read',
          isOwn: false,
        };

        replyCountRef.current += 1;

        setMessages((prev) => ({
          ...prev,
          [chatId]: [...(prev[chatId] ?? []), reply],
        }));

        setChats((prev) =>
          updateChat(prev, chatId, (chat) => ({
            ...chat,
            isTyping: false,
            lastMessage: reply.text,
            lastMessageTime: reply.timestamp,
            unreadCount: isActive
              ? chat.unreadCount
              : chat.unreadCount + 1,
          })),
        );
      }, durationMs);

      timers.set(chatId, timer);
    },
    [],
  );

  useEffect(() => {
    const timers = typingTimersRef.current;

    mockChats.forEach((chat) => {
      if (chat.isTyping) {
        startMockTyping(chat.id, INITIAL_TYPING_MS);
      }
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, [startMockTyping]);

  const getChat = useCallback(
    (chatId: string) => chats.find((chat) => chat.id === chatId),
    [chats],
  );

  const getMessages = useCallback(
    (chatId: string) => messages[chatId] ?? EMPTY_MESSAGES,
    [messages],
  );

  const value = useMemo(
    () => ({
      chats,
      messages,
      addMessage,
      clearUnread,
      setActiveChat,
      startMockTyping,
      ensureChatForContact,
      getChat,
      getMessages,
    }),
    [
      chats,
      messages,
      addMessage,
      clearUnread,
      setActiveChat,
      startMockTyping,
      ensureChatForContact,
      getChat,
      getMessages,
    ],
  );

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }

  return context;
};
