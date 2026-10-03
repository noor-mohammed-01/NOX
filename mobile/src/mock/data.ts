import { User, Chat, Message, Contact, NearbyUser } from '../types';

export const mockCurrentUser: User = {
  id: '1',
  name: 'John Doe',
  phone: '+1234567890',
  avatar: undefined,
  status: 'Available',
  isOnline: true,
};

export const mockChats: Chat[] = [
  {
    id: '1',
    name: 'Alice Smith',
    avatar: undefined,
    lastMessage: 'Hey, how are you?',
    lastMessageTime: new Date(Date.now() - 300000),
    unreadCount: 2,
    isOnline: true,
    isTyping: false,
  },
  {
    id: '2',
    name: 'Bob Johnson',
    avatar: undefined,
    lastMessage: 'See you tomorrow!',
    lastMessageTime: new Date(Date.now() - 3600000),
    unreadCount: 0,
    isOnline: false,
    isTyping: false,
  },
  {
    id: '3',
    name: 'Carol Williams',
    avatar: undefined,
    lastMessage: 'That sounds great',
    lastMessageTime: new Date(Date.now() - 86400000),
    unreadCount: 1,
    isOnline: true,
    isTyping: true,
  },
  {
    id: '4',
    name: 'David Brown',
    avatar: undefined,
    lastMessage: 'Thanks for the help',
    lastMessageTime: new Date(Date.now() - 172800000),
    unreadCount: 0,
    isOnline: false,
    isTyping: false,
  },
];

export const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: '1',
      chatId: '1',
      senderId: '2',
      text: 'Hey, how are you?',
      timestamp: new Date(Date.now() - 300000),
      status: 'read',
      isOwn: false,
    },
    {
      id: '2',
      chatId: '1',
      senderId: '1',
      text: 'I am doing great, thanks!',
      timestamp: new Date(Date.now() - 240000),
      status: 'read',
      isOwn: true,
    },
    {
      id: '3',
      chatId: '1',
      senderId: '2',
      text: 'Are you free tomorrow?',
      timestamp: new Date(Date.now() - 180000),
      status: 'read',
      isOwn: false,
    },
  ],
  '2': [
    {
      id: '4',
      chatId: '2',
      senderId: '1',
      text: 'Let meet at 5pm',
      timestamp: new Date(Date.now() - 3600000),
      status: 'delivered',
      isOwn: true,
    },
    {
      id: '5',
      chatId: '2',
      senderId: '3',
      text: 'See you tomorrow!',
      timestamp: new Date(Date.now() - 3500000),
      status: 'read',
      isOwn: false,
    },
  ],
  '3': [
    {
      id: '6',
      chatId: '3',
      senderId: '4',
      text: 'That sounds great',
      timestamp: new Date(Date.now() - 86400000),
      status: 'read',
      isOwn: false,
    },
  ],
  '4': [
    {
      id: '7',
      chatId: '4',
      senderId: '5',
      text: 'Thanks for the help',
      timestamp: new Date(Date.now() - 172800000),
      status: 'read',
      isOwn: false,
    },
  ],
};

export const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Alice Smith',
    phone: '+1234567891',
    avatar: undefined,
  },
  {
    id: '2',
    name: 'Bob Johnson',
    phone: '+1234567892',
    avatar: undefined,
  },
  {
    id: '3',
    name: 'Carol Williams',
    phone: '+1234567893',
    avatar: undefined,
  },
  {
    id: '4',
    name: 'David Brown',
    phone: '+1234567894',
    avatar: undefined,
  },
  {
    id: '5',
    name: 'Eve Davis',
    phone: '+1234567895',
    avatar: undefined,
  },
];

export const mockNearbyUsers: NearbyUser[] = [
  {
    id: '1',
    name: 'Alice Smith',
    distance: 10,
    isOnline: true,
  },
  {
    id: '2',
    name: 'Bob Johnson',
    distance: 25,
    isOnline: false,
  },
  {
    id: '3',
    name: 'Frank Miller',
    distance: 50,
    isOnline: true,
  },
];
