import { Box, Avatar, Typography, InputBase } from "@mui/material";
import handleFeatureNotAvailable from '../utils/utils';
import AccountSettingsIcon from '../assets/AccountSettingsIcon.svg?react';
import PrivacySettingsIcon from '../assets/PrivacySettingsIcon.svg?react';
import ChatsIcon from '../assets/ChatsIcon.svg?react';
import NotificationsSettingsIcon from '../assets/NotificationsSettingsIcon.svg?react';
import KeyboardSettingsIcon from '../assets/KeyboardSettingsIcon.svg?react';
import HelpSettingsIcon from '../assets/HelpSettingsIcon.svg?react';
import LogoutIcon from '../assets/LogoutIcon.svg?react';
import SearchIcon from '../assets/SearchIcon.svg?react';

interface SettingsProps {
  currentUser: { name: string; phone: string };
  onLogout: () => void;
}

export default function Settings({ currentUser, onLogout }: SettingsProps) {
  const menuItems = [
    {
      label: "Account",
      icon: <AccountSettingsIcon />,
      description: "Security notifications, account info",
      action: () => handleFeatureNotAvailable('Account Settings')
    },
    {
      label: "Privacy",
      icon: <PrivacySettingsIcon />,
      description: "Blocked contacts, disappearing messages",
      action: () => handleFeatureNotAvailable('Privacy Settings')
    },
    {
      label: "Chats",
      icon: <ChatsIcon />,
      description: "Theme, wallpaper, chat settings",
      action: () => handleFeatureNotAvailable('Chats Settings')
    },
    {
      label: "Notifications",
      icon: <NotificationsSettingsIcon />,
      description: "Message notifications",
      action: () => handleFeatureNotAvailable('Notifications Settings')
    },
    {
      label: "Keyboard shortcuts",
      icon: <KeyboardSettingsIcon />,
      description: "Quick actions",
      action: () => handleFeatureNotAvailable('Keyboard shortcuts Settings')
    },
    {
      label: "Help",
      icon: <HelpSettingsIcon />,
      description: "Help center, contact us, privacy policy",
      action: () => handleFeatureNotAvailable('Help')
    },
    {
      label: "Log out",
      icon: <LogoutIcon />,
      description: "",
      action: onLogout,
      isLogout: true
    }
  ];

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", bgcolor: "#ffffff" }}>
      {/* Header */}
      <Box sx={{
        bgcolor: "#ffffff",
        p: 2,
        pb: 2,
        borderBottom: "1px solid #e9edef"
      }}>
        <Typography variant="h5" sx={{ color: "#111b21", fontWeight: 700, mb: 2 }}>
          Settings
        </Typography>
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
              sx={{ flex: 1, fontSize: '0.875rem' }}
            />
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar sx={{ bgcolor: "#00a884", width: 48, height: 48, mr: 2 }}>
            {currentUser.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ color: "#111b21", fontWeight: 600 }}>
              {currentUser.name}
            </Typography>
            <Typography variant="body2" sx={{ color: "#667781" }}>
              Hey there! I am using WhatsApp.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Menu */}
      <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
        {menuItems.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              py: 2,
              borderBottom: index !== menuItems.length - 1 ? "1px solid #e9edef" : "none",
              cursor: "pointer",
              '&:hover': {
                bgcolor: item.isLogout ? "#fddede" : "#f5f5f5"
              }
            }}
            onClick={item.action}
          >
            <Box sx={{ color: item.isLogout ? "#f00" : "#54656f", minWidth: 36, display: "flex", justifyContent: "center" }}>
              {item.icon}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ color: item.isLogout ? "#f00" : "#111b21", fontWeight: item.isLogout ? 600 : 500 }}>
                {item.label}
              </Typography>
              {item.description && !item.isLogout && (
                <Typography variant="body2" sx={{ color: "#667781", mt: 0.5 }}>
                  {item.description}
                </Typography>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}