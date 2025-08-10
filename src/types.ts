export interface Message {
  _id?: string;
  from: string;
  to: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  senderName?: string;
  messageId?: string;
}

export interface Conversation {
  wa_id: string;
  name: string;
  messages: Message[];
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

export interface Contact {
  name: string;
  phone: string;
}

export interface User {
  _id: string;
  phone: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  phone: string;
  name: string;
}

export interface LoginCredentials {
  phone: string;
  password: string;
}

export interface RegisterCredentials {
  phone: string;
  name: string;
  password: string;
  confirmPassword?: string;
}