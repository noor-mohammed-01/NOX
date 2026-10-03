export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Phone: undefined;
  OTP: { phone: string };
  ProfileSetup: undefined;
  ChatList: undefined;
  Search: { chatId?: string } | undefined;
  NewChat: undefined;
  CreateContact: undefined;
  Contacts: undefined;
  Conversation: { chatId: string };
  Profile: undefined;
  UserProfile: { userId: string };
  NearbyUsers: undefined;
  MediaGallery: { chatId?: string } | undefined;
};

export type User = {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  status?: string;
  isOnline: boolean;
  lastSeen?: Date;
};

export type Message = {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  isOwn: boolean;
};

export type Chat = {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  isOnline: boolean;
  isTyping: boolean;
};

export type Contact = {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
};

export type NearbyUser = {
  id: string;
  name: string;
  distance: number;
  isOnline: boolean;
};
