import { 
  Avatar, 
  IconButton, 
  InputBase, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Badge,
  Box,
  Typography,
  Tooltip
} from '@mui/material';
import {
  BsThreeDotsVertical
} from 'react-icons/bs';
import type { Conversation } from '../types';
import handleFeatureNotAvailable from '../utils/utils';
import NewChatIcon from '../assets/NewChatIcon.svg?react';
import SearchIcon from '../assets/SearchIcon.svg?react';

interface ChatMenuProps {
  conversations: Conversation[];
  onSelect: (id: string) => void;
  selectedConversation?: string;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  formatTime: (timestamp: string) => string;
  onOpenView: (view: string) => void;
}

export default function ChatMenu({
  conversations,
  onSelect,
  selectedConversation,
  searchTerm,
  setSearchTerm,
  formatTime,
  onOpenView
}: ChatMenuProps) {
  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: '#ffffff'
    }}>
      {/* Header */}
      <Box sx={{ 
        bgcolor: '#ffffff', 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#111b21' }}>
          WhatsApp
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="New Chat">
            <IconButton 
              size="small" 
              onClick={() => onOpenView('newChat')}
              sx={{ color: '#667781' }}
            >
              <NewChatIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Menu">
            <IconButton 
              size="small" 
              onClick={() => handleFeatureNotAvailable('Menu')}
              sx={{ color: '#667781' }}
            >
              <BsThreeDotsVertical size={20} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Search */}
      <Box sx={{ 
        bgcolor: '#ffffff', 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          bgcolor: '#f0f2f5', 
          borderRadius: 2, 
          px: 2, 
          py: 1, 
          flex: 1
        }}>
          <SearchIcon style={{ color: '#667781', marginRight: '8px' }} />
          <InputBase
            placeholder="Search or start new chat"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flex: 1, fontSize: '0.875rem' }}
          />
        </Box>
      </Box>

      {/* Conversations List */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ p: 0 }}>
          {filteredConversations.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {searchTerm ? 'No conversations found' : 'No conversations yet'}
              </Typography>
            </Box>
          ) : (
            filteredConversations.map(conv => {
              const lastMessage = conv.messages[conv.messages.length - 1];
              const isSelected = selectedConversation === conv.wa_id;

              return (
                <ListItem
                  key={conv.wa_id}
                  sx={{
                    cursor: 'pointer',
                    bgcolor: isSelected ? '#f0f2f5' : 'transparent',
                    '&:hover': {
                      bgcolor: isSelected ? '#f0f2f5' : '#f5f6f6'
                    },
                    borderBottom: '1px solid #e9edef',
                    px: 3,
                    py: 2
                  }}
                  onClick={() => onSelect(conv.wa_id)}
                >
                  <ListItemAvatar>
                    <Avatar 
                      sx={{ 
                        bgcolor: '#00a884', 
                        width: 48, 
                        height: 48 
                      }}
                    >
                      {conv.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontWeight: 600, 
                            color: '#111b21',
                            fontSize: '0.875rem'
                          }}
                        >
                          {conv.name}
                        </Typography>
                        {lastMessage && (
                          <span
                            style={{
                              fontSize: '0.75rem',
                              color: '#667781',
                              marginLeft: 8
                            }}
                          >
                            {formatTime(lastMessage.timestamp)}
                          </span>
                        )}
                      </Box>
                    }
                    secondary={
                      <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span
                          style={{
                            fontSize: '0.875rem',
                            color: '#667781',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: 200,
                            display: 'block'
                          }}
                        >
                          {lastMessage ? lastMessage.text : 'No messages yet'}
                        </span>
                        {conv.unreadCount && conv.unreadCount > 0 && (
                          <Badge
                            badgeContent={conv.unreadCount}
                            color="success"
                            sx={{
                              '& .MuiBadge-badge': {
                                bgcolor: '#00a884',
                                fontSize: '0.75rem',
                                minWidth: 20,
                                height: 20
                              }
                            }}
                          />
                        )}
                      </span>
                    }
                    sx={{ m: 0 }}
                  />
                </ListItem>
              );
            })
          )}
        </List>
      </Box>
    </Box>
  );
}
