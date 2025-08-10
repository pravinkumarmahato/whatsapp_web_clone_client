import { useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Typography } from '@mui/material';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import Login from './components/Login';
import Register from './components/Register';
import type { Conversation, Message, User } from './types';
import { getConversations, getMessagesByUser } from './services/api';
import { createSocket } from './socket/socket';
import type { Socket } from 'socket.io-client';
import SettingsIcon from './assets/SettingsIcon.svg?react';

const theme = createTheme({
  palette: {
    primary: { main: '#00a884' },
    background: { default: '#ffffff' },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
});

export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<string>('chats');
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        setIsAuthenticated(true);

        // Create socket after login
        const newSocket = createSocket(token);
        setSocketInstance(newSocket);
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated && socketInstance) {
      loadConversations();

      const handleMessage = (msg: Message) => {
        setConversations((prev) => {
          let updated = prev.map((conv) => {
            if (conv.wa_id === msg.from || conv.wa_id === msg.to) {
              // If receiver is not viewing this conversation, increment unreadCount
              const isReceiver = currentUser?.phone === msg.to;
              const isNotActive = !selected || selected.wa_id !== (isReceiver ? msg.from : msg.to);
              return {
                ...conv,
                messages: [...conv.messages, msg],
                lastMessage: msg.text,
                lastMessageTime: msg.timestamp,
                unreadCount: isReceiver && isNotActive ? (conv.unreadCount || 0) + 1 : conv.unreadCount,
              };
            }
            return conv;
          });
          // Add new conversation only if neither sender nor receiver exists
          const msgContactId = msg.from === currentUser?.phone ? msg.to : msg.from;
          if (!updated.some(conv => conv.wa_id === msgContactId)) {
            updated = [
              ...updated,
              {
                wa_id: msgContactId,
                name: msgContactId,
                messages: [msg],
                lastMessage: msg.text,
                lastMessageTime: msg.timestamp,
                unreadCount: 1,
              }
            ];
          }
          return updated;
        });
        // Always set selected to the latest reference using functional update
        setSelected(prevSelected => {
          if (prevSelected && (prevSelected.wa_id === msg.from || prevSelected.wa_id === msg.to)) {
            // Update the selected conversation with the new message
            return {
              ...prevSelected,
              messages: [...(prevSelected.messages || []), msg],
              lastMessage: msg.text,
              lastMessageTime: msg.timestamp,
            };
          }
          return prevSelected;
        });
      };

      socketInstance.on('message', handleMessage);

      return () => {
        socketInstance.off('message', handleMessage);
      };
    }
  }, [isAuthenticated, selected, currentUser?.phone, socketInstance]);

  const loadConversations = async () => {
    try {
      const convs = await getConversations();
      setConversations(convs);
    } catch {
      // API failed, clear conversations
      setConversations([]);
    }
  };

  const selectUser = async (wa_id: string) => {
    const conv = conversations.find((c) => c.wa_id === wa_id);
    let messages: Message[] = [];
    try {
      messages = await getMessagesByUser(wa_id);
    } catch {
      messages = [];
    }
    if (conv) {
      setSelected({ ...conv, messages });
      setConversations(prev => prev.map(c => (c.wa_id === wa_id ? { ...c, messages } : c)));
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowLogin(true);
    const token = localStorage.getItem('token');
    if (token) {
      const newSocket = createSocket(token);
      setSocketInstance(newSocket);
    }
  };

  const handleRegisterSuccess = () => {
    setShowLogin(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setConversations([]);
    setSelected(null);
    if (socketInstance) {
      socketInstance.disconnect();
      setSocketInstance(null);
    }
  };

  const switchToRegister = () => {
    setShowLogin(false);
  };

  const switchToLogin = () => {
    setShowLogin(true);
  };

  const openView = (view: string) => setActiveView(view);

  // Listen for startNewChat event from Sidebar
  useEffect(() => {
    const handler = async (e: Event) => {
      const customEvent = e as CustomEvent<{ name: string; phone: string }>;
      const contact = customEvent.detail;
      let conv = conversations.find(c => c.wa_id === contact.phone);
      let messages: Message[] = [];
      try {
        messages = await getMessagesByUser(contact.phone);
      } catch {
        messages = [];
      }
      if (!conv) {
        conv = {
          wa_id: contact.phone,
          name: contact.name,
          messages,
          unreadCount: 0,
        };
        setConversations(prev => [...prev, conv!]);
      } else {
        conv = { ...conv, messages };
        setConversations(prev => prev.map(c => (c.wa_id === contact.phone ? conv! : c)));
      }
      setSelected(conv ?? {
        wa_id: contact.phone,
        name: contact.name,
        messages,
        unreadCount: 0,
      });
      setActiveView('chats');
      if (isMobileView) {
        setShowSidebar(false);
      }
    };
    window.addEventListener('startNewChat', handler);
    return () => window.removeEventListener('startNewChat', handler);
  }, [conversations, isMobileView]);

  // Handle resize for mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowSidebar(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleConversationSelect = (wa_id: string) => {
    selectUser(wa_id);
    if (isMobileView) {
      setShowSidebar(false);
    }
  };

  const handleBackToList = () => {
    setShowSidebar(true);
    setSelected(null);
  };

  if (loading) {
    return (
      <Box sx={{ 
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#00a884'
      }}>
        <Typography variant="h6" color="white">
          Loading...
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        {showLogin ? (
          <Login onSwitchToRegister={switchToRegister} onLoginSuccess={handleLoginSuccess} />
        ) : (
          <Register onSwitchToLogin={switchToLogin} onRegisterSuccess={handleRegisterSuccess} />
        )}
      </>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        height: '100vh',
        display: 'flex',
        overflow: 'hidden',
        bgcolor: '#efeae2'
      }}>
        {/* Sidebar */}
        <Box sx={{ 
          width: isMobileView ? '100%' : 'var(--sidebar-width)',
          display: isMobileView && !showSidebar ? 'none' : 'block',
          height: '100%',
          position: isMobileView ? 'absolute' : 'relative',
          zIndex: 2,
          bgcolor: '#fff'
        }}>
          <Sidebar
            conversations={conversations}
            onSelect={handleConversationSelect}
            selectedConversation={selected?.wa_id}
            currentUser={currentUser ?? undefined}
            onOpenView={openView}
            activeView={activeView}
            handleLogout={handleLogout}
          />
        </Box>

        {/* Chat Window */}
        <Box sx={{ 
          flex: 1,
          display: isMobileView && showSidebar ? 'none' : 'flex',
          height: '100%'
        }}>
          <ChatWindow 
            conversation={selected}
            currentUser={currentUser ?? undefined}
            onMessageSent={(msg) => {
              if (selected) {
                const updatedConv = {
                  ...selected,
                  messages: [...selected.messages, msg]
                };
                setSelected(updatedConv);
                setConversations(prev =>
                  prev.map(c =>
                    c.wa_id === selected.wa_id ? updatedConv : c
                  )
                );
              }
            }}
            onBackClick={isMobileView ? handleBackToList : undefined}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{
          minHeight: '100vh',
          bgcolor: '#00a884',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Box sx={{ textAlign: 'center', color: 'white' }}>
            <Box sx={{ fontSize: '4rem', mb: 2 }}>
              <img 
                src="https://static.whatsapp.net/rsrc.php/v4/yP/r/rYZqPCBaG70.png" 
                alt="WhatsApp Icon" 
                style={{ width: '1em', height: '1em' }} 
              />
            </Box>
            <Box sx={{ fontSize: '1.5rem', fontWeight: 600 }}>
              Loading WhatsApp Web Clone...
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {showLogin ? (
          <Login
            onSwitchToRegister={switchToRegister}
            onLoginSuccess={handleLoginSuccess}
          />
        ) : (
          <Register
            onSwitchToLogin={switchToLogin}
            onRegisterSuccess={handleRegisterSuccess}
          />
        )}
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        display: 'flex',
        height: '100vh',
        bgcolor: '#ffffff',
        overflow: 'hidden',
        position: 'relative'
      }}>

        <Sidebar
          conversations={conversations}
          onSelect={selectUser}
          selectedConversation={selected?.wa_id}
          currentUser={currentUser || undefined}
          onOpenView={openView}
          activeView={activeView}
          handleLogout={handleLogout}
        />
        
        {/* Conditional rendering based on active view */}
        {activeView === 'chats' && (
          <ChatWindow
            conversation={selected}
            currentUser={currentUser || undefined}
            onMessageSent={(msg: Message) => {
              // Update selected conversation immediately
              setSelected((prev) => {
                if (!prev) return prev;
                return {
                  ...prev,
                  messages: [...prev.messages, msg],
                  lastMessage: msg.text,
                  lastMessageTime: msg.timestamp,
                };
              });
              // Also update conversations list for sidebar
              setConversations((prevConvs) => prevConvs.map((conv) =>
                conv.wa_id === msg.to || conv.wa_id === msg.from
                  ? {
                      ...conv,
                      messages: [...conv.messages, msg],
                      lastMessage: msg.text,
                      lastMessageTime: msg.timestamp,
                    }
                  : conv
              ));
            }}
          />
        )}
        {activeView === 'settings' && (
          <Box sx={{ 
            flex: 1, 
            bgcolor: '#efeae2', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
          }}>
            <Box sx={{ textAlign: 'center', maxWidth: 400 }}>
              <Typography variant="h3" sx={{ mb: 2, color: '#667781', opacity: 0.5 }}>
                <SettingsIcon width="60" height="60" />
              </Typography>
              <Typography variant="h4" sx={{ mb: 2, color: '#111b21', fontWeight: 300 }}>
                Settings
              </Typography>
            </Box>
          </Box>
        )}
        {/* Add more views here as needed, e.g. profile, status, calls */}
      </Box>
    </ThemeProvider>
  );
}