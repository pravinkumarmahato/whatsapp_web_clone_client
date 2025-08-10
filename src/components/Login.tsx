import { useState } from 'react';
import { 
  Box, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import { login } from '../services/api';
import type { LoginCredentials } from '../types';

interface LoginProps {
  onSwitchToRegister: () => void;
  onLoginSuccess: () => void;
}

export default function Login({ onSwitchToRegister, onLoginSuccess }: LoginProps) {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(credentials);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify({
        phone: response.phone,
        name: response.name,
      }));
      onLoginSuccess();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#00a884', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      p: 2
    }}>
      <Paper sx={{ 
        width: '100%', 
        maxWidth: 400, 
        borderRadius: 2,
        overflow: 'hidden'
      }}>
        {/* Header */}
        <Box sx={{ 
          bgcolor: '#00a884', 
          color: 'white', 
          p: 4, 
          textAlign: 'center' 
        }}>
          <Box sx={{ fontSize: '3rem', mb: 2 }}>
            <img 
              src="https://static.whatsapp.net/rsrc.php/v4/yP/r/rYZqPCBaG70.png" 
              alt="WhatsApp Icon" 
              style={{ width: '1em', height: '1em' }} 
            />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            WhatsApp Web
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Sign in to continue
          </Typography>
        </Box>

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Phone Number"
            type="tel"
            value={credentials.phone}
            onChange={(e) => setCredentials({ ...credentials, phone: e.target.value })}
            placeholder="Enter your phone number"
            required
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            placeholder="Enter your password"
            required
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ 
              mb: 2, 
              py: 1.5,
              bgcolor: '#00a884',
              '&:hover': {
                bgcolor: '#008f72'
              }
            }}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              'Sign In'
            )}
          </Button>

          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="text"
              onClick={onSwitchToRegister}
              sx={{ 
                color: '#00a884',
                '&:hover': {
                  color: '#008f72'
                }
              }}
            >
              Don't have an account? Sign up
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
