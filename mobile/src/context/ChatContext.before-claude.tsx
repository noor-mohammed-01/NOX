import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Chat, Message } from '../types';
import { mockChats, mockMessages } from '../mock/data';

type ChatContextType = {
  chats: Chat[];
  messages: Record<string, Message[]>;
  addMessage: (chatId: string, message: Message) => void;
  clearUnread: (chatId: string) => void;
  getChat: (chatId: string) => Chat | undefined;
  getMessages: (chatId: string) => Message[];
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages);

  const addMessage = (chatId: string, message: Message) => {
    setMessages((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), message],
    }));

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              lastMessage: message.text,
              lastMessageTime: message.timestamp,
            }
          : chat
      )
    );
  };

  const clearUnread = (chatId: string) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              unreadCount: 0,
            }
          : chat
      )
    );
  };

  const getChat = (chatId: string) => chats.find((c) => c.id === chatId);

  const getMessages = (chatId: string) => messages[chatId] || [];

  return (
    <ChatContext.Provider value={{ chats, messages, addMessage, clearUnread, getChat, getMessages }}>
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
