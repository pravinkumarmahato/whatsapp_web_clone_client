import { useState } from 'react';
import { 
  Box,
} from '@mui/material';
import type { Conversation } from '../types';
import ChatMenu from './chatMenu';
import Settings from './SettingsMenu';
import NewChatWindow from './NewChatWindow';
import handleFeatureNotAvailable from '../utils/utils';
import ChannelsIcon from '../assets/ChannelsIcon.svg?react';
import StatusIcon from '../assets/StatusIcon.svg?react';
import ChatsIcon from '../assets/ChatsIcon.svg?react';
import CommunitiesIcon from '../assets/CommunitiesIcon.svg?react';
import DefaultProfileImage from '../assets/DefaultProfileImage.svg?react';
import SettingsIcon from '../assets/SettingsIcon.svg?react';

interface SidebarProps {
  conversations: Conversation[];
  onSelect: (id: string) => void;
  selectedConversation?: string;
  currentUser?: { name: string; phone: string };
  onOpenView: (view: string) => void;
  activeView: string;
  handleLogout: () => void;
}

export default function Sidebar({ 
  conversations, 
  onSelect, 
  selectedConversation,
  currentUser,
  onOpenView,
  activeView,
  handleLogout
}: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  // Handler for starting a new chat
  const handleStartChat = (contact: { name: string; phone: string }) => {
    if (window && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('startNewChat', { detail: contact }));
    }
    onOpenView('chats');
  };

  return (
    <Box sx={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      bgcolor: '#ffffff',
      borderRight: '1px solid #e9edef'
    }}>
      {/* Left Navigation Bar */}
      <Box sx={{ 
        width: 72, 
        bgcolor: '#f0f2f5', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        pt: 2,
        pb: 2,
        gap: 1
      }}>
        {/* Chat Icon */}
        <Box sx={{
          width: 48,
          height: 48,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#667781',
          fontSize: '20px',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: '#e9edef'
          }
        }} onClick={() => onOpenView('chats')}>
          <ChatsIcon />
        </Box>

        {/* Status Icon */}
        <Box sx={{
          width: 48,
          height: 48,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#667781',
          fontSize: '20px',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: '#e9edef'
          }
        }} onClick={() => handleFeatureNotAvailable('Status')}>
          <StatusIcon />
        </Box>

        {/* Channels */}
        <Box sx={{
          width: 48,
          height: 48,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#667781',
          fontSize: '20px',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: '#e9edef'
          }
        }} onClick={() => handleFeatureNotAvailable('Channels')}>
          <ChannelsIcon />
        </Box>

        {/* Communities */}
        <Box sx={{
          width: 48,
          height: 48,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#667781',
          fontSize: '20px',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: '#e9edef'
          }
        }} onClick={() => handleFeatureNotAvailable('Communities')}>
          <CommunitiesIcon />
        </Box>

        {/* Spacer */}
        <Box sx={{ flex: 1 }} />

        {/* Settings */}
        <Box sx={{
          width: 48,
          height: 48,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#667781',
          fontSize: '20px',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: '#e9edef'
          }
        }} onClick={() => onOpenView('settings')}>
          <SettingsIcon />
        </Box>

        {/* Profile Picture */}
        <Box sx={{
          width: 48,
          height: 48,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#667781',
          fontSize: '20px',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: '#e9edef',
          }
        }} onClick={() => handleFeatureNotAvailable('Profile')}>
          <DefaultProfileImage height={48} width={48} />
        </Box>
      </Box>

      {/* Conditional rendering based on active view */}
      {activeView === 'chats' && (
        <ChatMenu
          conversations={conversations}
          onSelect={onSelect}
          selectedConversation={selectedConversation}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          formatTime={formatTime}
          onOpenView={onOpenView}
        />
      )}
      {activeView === 'settings' && (
        <Settings
          currentUser={currentUser!}
          onLogout={handleLogout}
        />
      )}
      {activeView === 'newChat' && (
        <NewChatWindow onStartChat={handleStartChat} />
      )}
    </Box>
  );
}
