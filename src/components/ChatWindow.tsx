import { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Avatar, 
  IconButton, 
  Typography, 
  Paper, 
  InputBase,
  Tooltip,
  Chip
} from '@mui/material';
import { 
  BsTelephone, 
  BsCameraVideo, 
  BsSearch, 
  BsThreeDotsVertical,
  BsEmojiSmile,
  BsPaperclip,
  BsMic,
  BsSend
} from 'react-icons/bs';
import type { Conversation, Message } from '../types';
import { sendMessage } from '../services/api';

interface ChatWindowProps {
  conversation: Conversation | null;
  currentUser?: { phone: string };
  onMessageSent?: (msg: Message) => void;
  onBackClick?: () => void;
}

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function ChatWindow({ conversation, currentUser, onMessageSent, onBackClick }: ChatWindowProps) {
  console.log('ChatWindow rendered with conversation:', conversation);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const handleSend = async () => {
    if (!conversation || !text.trim() || sending) return;
    setSending(true);
    try {
      const messageData = {
        to: conversation.wa_id,
        text: text.trim(),
      };
      const sentMsg = await sendMessage(messageData);
      setText('');
      // Notify parent to update state
      if (onMessageSent) {
        onMessageSent(sentMsg);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const groupMessagesByDate = (messages: Message[]) => {
    // Sort messages by timestamp first (oldest → newest)
    const sorted = [...messages].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const groups: { [date: string]: Message[] } = {};

    sorted.forEach(message => {
      const dateLabel = formatDate(message.timestamp); // "Today", "Yesterday", or "MM/DD/YYYY"
      if (!groups[dateLabel]) {
        groups[dateLabel] = [];
      }
      groups[dateLabel].push(message);
    });

    return groups;
  };


  const handleFeatureNotAvailable = (feature: string) => {
    alert(`${feature} will be available in a future update!`);
  };

  if (!conversation) {
    return (
      <Box sx={{ 
        flex: 1, 
        bgcolor: '#efeae2', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23f0f2f5" fill-opacity="0.3"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
      }}>
        <Box sx={{ textAlign: 'center', maxWidth: 400 }}>
          <Typography variant="h3" sx={{ mb: 2, opacity: 1 }}>
            <img 
              src="https://static.whatsapp.net/rsrc.php/v4/yP/r/rYZqPCBaG70.png" 
              alt="WhatsApp Icon" 
              style={{ width: '1em', height: '1em' }} 
            />
          </Typography>
          <Typography variant="h4" sx={{ mb: 2, color: '#111b21', fontWeight: 300 }}>
            Welcome to WhatsApp Web Clone
          </Typography>
          <Typography variant="body1" sx={{ color: '#667781' }}>
            Select a conversation to start messaging
          </Typography>
        </Box>
      </Box>
    );
  }

  const messageGroups = groupMessagesByDate(conversation.messages);

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#efeae2' }}>
      {/* Header */}
      <Box sx={{ 
        bgcolor: '#f0f2f5', 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: '1px solid #e9edef'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {onBackClick && (
            <IconButton 
              onClick={onBackClick}
              
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          <Avatar 
            sx={{ 
              bgcolor: '#00a884', 
              width: 40, 
              height: 40 
            }}
          >
            {conversation.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#111b21' }}>
              {conversation.name}
            </Typography>
            <Typography variant="caption" sx={{ color: '#667781' }}>
              online
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Video Call">
            <IconButton 
              size="small" 
              onClick={() => handleFeatureNotAvailable('Video Call')}
              sx={{ color: '#667781' }}
            >
              <BsCameraVideo size={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Voice Call">
            <IconButton 
              size="small" 
              onClick={() => handleFeatureNotAvailable('Voice Call')}
              sx={{ color: '#667781' }}
            >
              <BsTelephone size={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Search">
            <IconButton 
              size="small" 
              onClick={() => handleFeatureNotAvailable('Search')}
              sx={{ color: '#667781' }}
            >
              <BsSearch size={20} />
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

      {/* Messages */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto', 
        p: 2,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23f0f2f5" fill-opacity="0.3"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
      }}>
        {Object.entries(messageGroups).map(([date, messages]) => (
          <Box key={date}>
            {/* Date separator */}
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <Chip
                label={date}
                size="small"
                sx={{
                  bgcolor: '#f0f2f5',
                  color: '#667781',
                  fontSize: '0.75rem',
                  '& .MuiChip-label': {
                    px: 2
                  }
                }}
              />
            </Box>
            
            {/* Messages for this date */}
            {messages.map((message, index) => {
              const isOwnMessage = message.from === currentUser?.phone;
              const showTime = index === messages.length - 1 || 
                messages[index + 1]?.from !== message.from ||
                new Date(messages[index + 1]?.timestamp).getTime() - new Date(message.timestamp).getTime() > 60000;
              
              return (
                <Box 
                  key={message._id || index} 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                    mb: 1
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: isOwnMessage ? 'row-reverse' : 'row',
                    alignItems: 'flex-end',
                    maxWidth: '70%',
                    gap: 1
                  }}>
                    <Paper
                      elevation={0}
                      sx={{
                        bgcolor: isOwnMessage ? '#d9fdd3' : '#ffffff',
                        color: '#111b21',
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        position: 'relative',
                        '&::before': isOwnMessage ? {
                          content: '""',
                          position: 'absolute',
                          right: -8,
                          bottom: 0,
                          width: 0,
                          height: 0,
                          borderStyle: 'solid',
                          borderWidth: '0 0 8px 8px',
                          borderColor: 'transparent transparent #d9fdd3 transparent'
                        } : {
                          content: '""',
                          position: 'absolute',
                          left: -8,
                          bottom: 0,
                          width: 0,
                          height: 0,
                          borderStyle: 'solid',
                          borderWidth: '0 8px 8px 0',
                          borderColor: 'transparent #ffffff transparent transparent'
                        }
                      }}
                    >
                      <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                        {message.text}
                      </Typography>
                      {showTime && (
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                          alignItems: 'center',
                          mt: 0.5,
                          gap: 0.5
                        }}>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: '#667781',
                              fontSize: '0.75rem'
                            }}
                          >
                            {formatTime(message.timestamp)}
                          </Typography>
                          {isOwnMessage && (
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: message.status === 'read' ? '#53bdeb' : '#667781',
                                fontSize: '0.75rem'
                              }}
                            >
                              {message.status === 'read' ? '✓✓' : message.status === 'delivered' ? '✓✓' : '✓'}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </Paper>
                  </Box>
                </Box>
              );
            })}
          </Box>
        ))}
        
        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Box sx={{ 
        bgcolor: '#f0f2f5', 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1
      }}>
        <Tooltip title="Emoji">
          <IconButton 
            size="small" 
            onClick={() => handleFeatureNotAvailable('Emoji')}
            sx={{ color: '#667781' }}
          >
            <BsEmojiSmile size={20} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Attachment">
          <IconButton 
            size="small" 
            onClick={() => handleFeatureNotAvailable('Attachment')}
            sx={{ color: '#667781' }}
          >
            <BsPaperclip size={20} />
          </IconButton>
        </Tooltip>
        <Box sx={{ 
          flex: 1, 
          bgcolor: '#ffffff', 
          borderRadius: 2, 
          px: 2, 
          py: 1 
        }}>
          <InputBase
            placeholder="Type a message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            fullWidth
            multiline
            maxRows={4}
            sx={{ 
              fontSize: '0.875rem',
              '& .MuiInputBase-input': {
                padding: 0
              }
            }}
          />
        </Box>
        {text.trim() ? (
          <Tooltip title="Send">
            <IconButton 
              color="primary" 
              onClick={handleSend}
              disabled={sending}
              sx={{ color: '#00a884' }}
            >
              <BsSend size={20} />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Voice Message">
            <IconButton 
              onClick={() => handleFeatureNotAvailable('Voice Message')}
              sx={{ color: '#667781' }}
            >
              <BsMic size={20} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
}
