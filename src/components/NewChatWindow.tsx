import { useState } from "react";
import { Box, Avatar, Typography, InputBase, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import SearchIcon from '../assets/SearchIcon.svg?react';
import { searchUserByPhone } from '../services/api';
import type { Contact } from '../types';

interface NewChatWindowProps {
  onStartChat: (contact: Contact) => void;
}

export default function NewChatWindow({ onStartChat }: NewChatWindowProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<Contact | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setSearching(true);
    setError("");
    setResult(null);
    try {
      const res = await searchUserByPhone(searchTerm.trim());
      if (res) {
        setResult(res);
      } else {
        setError("No user found");
      }
    } catch (err) {
      setError("No user found: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSearching(false);
    }
  };

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", bgcolor: "#ffffff" }}>
      {/* Header */}
      <Box sx={{ bgcolor: "#ffffff", p: 2, pb: 2, borderBottom: "1px solid #e9edef" }}>
        <Typography variant="h5" sx={{ color: "#111b21", fontWeight: 700, mb: 2 }}>
          Start New Chat
        </Typography>
        <Box sx={{ bgcolor: '#ffffff', p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f0f2f5', borderRadius: 2, px: 2, py: 1, flex: 1 }}>
            <SearchIcon style={{ color: '#667781', marginRight: '8px' }} />
            <InputBase
              placeholder="Enter mobile number"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
              sx={{ flex: 1, fontSize: '0.875rem' }}
              disabled={searching}
            />
          </Box>
        </Box>
      </Box>

      {/* Search Result */}
      <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
        {searching && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
            Searching...
          </Typography>
        )}
        {error && !searching && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
            {error}
          </Typography>
        )}
        {result && !searching && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
            {result.name || result.phone}
          </Typography>
        )}
        {result && !searching && (
          <List>
            <ListItem
              key={result.phone}
              sx={{
                cursor: "pointer",
                borderBottom: "1px solid #e9edef",
                '&:hover': { bgcolor: "#f5f5f5" }
              }}
              onClick={() => onStartChat(result)}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: "#00a884", width: 48, height: 48 }}>
                  {(result.name && result.name.length > 0)
                    ? result.name.charAt(0).toUpperCase()
                    : (result.phone && result.phone.length > 0
                        ? result.phone.charAt(0)
                        : '?')}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" sx={{ color: "#111b21", fontWeight: 600 }}>
                    {result.name}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" sx={{ color: "#667781" }}>
                    {result.phone}
                  </Typography>
                }
              />
            </ListItem>
          </List>
        )}
      </Box>
    </Box>
  );
}
