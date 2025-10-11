import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
} from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import { keyframes } from '@mui/system';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, devSignIn } = useAuth();
  const navigate = useNavigate();

  // Ensure fields are empty on initial mount to avoid any prefilled values
  useEffect(() => {
    setUsername('');
    setPassword('');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ username, password });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const gradientShift = keyframes`
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  `;

  return (
    <Box sx={{ minHeight: '100svh', background: 'linear-gradient(135deg, #eef2f3 0%, #d9e4f5 100%)' }}>
      <Box sx={{
        minHeight: '100svh',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' },
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
          <Container maxWidth="xs">
            <Paper
              elevation={10}
              sx={{
                p: 2.5,
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 10px 24px rgba(0,0,0,0.08)',
                width: '100%',
                maxWidth: 340,
                mx: 'auto',
              }}
            >
          <Box sx={{ textAlign: 'center', mb: 2.5 }}>
            <Box
              component="img"
              src="/logo.png"
              alt="Institute Logo"
              onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
              sx={{ height: 48, mb: 1, objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}
            />
            <Typography
              variant="h6"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 800,
                color: '#0d47a1',
                letterSpacing: 0.2,
              }}
            >
              Yashwantrao Bhonsale Institute of Technology
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Lab Management System
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to your account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} autoComplete="off">
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              margin="dense"
              size="small"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="new-username"
              autoFocus
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(0,0,0,0.15)' },
                  '&:hover fieldset': { borderColor: 'primary.main' },
                  '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                  '&.Mui-focused': {
                    boxShadow: (theme) => `0 0 0 3px ${theme.palette.primary.main}22`,
                  },
                },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="dense"
              size="small"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(0,0,0,0.15)' },
                  '&:hover fieldset': { borderColor: 'primary.main' },
                  '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                  '&.Mui-focused': {
                    boxShadow: (theme) => `0 0 0 3px ${theme.palette.primary.main}22`,
                  },
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 2.5,
                mb: 1.5,
                py: 1.2,
                backgroundColor: 'primary.main',
                '&:hover': { backgroundColor: 'primary.dark' },
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
            <Box sx={{ textAlign: 'center', mt: 0.5 }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/register')}
                sx={{ textDecoration: 'none', color: 'primary.main', opacity: 0.9, '&:hover': { textDecoration: 'underline', opacity: 1 } }}
              >
                Don't have an account? Sign Up
              </Link>
            </Box>
            <Box sx={{ textAlign: 'center', mt: 0.5 }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => { devSignIn(); navigate('/'); }}
                sx={{ color: 'text.secondary' }}
              >
                Dev Sign-in
              </Link>
            </Box>
          </Box>
            </Paper>
          </Container>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'relative', overflow: 'hidden' }}>
          {/* Animated gradient backdrop with reduced opacity */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              // Soft Gray animated gradient
              background: (theme) => theme.palette.mode === 'light'
                ? 'linear-gradient(120deg, #f1f5f9, #e5e7eb, #f3f4f6)'
                : 'linear-gradient(120deg, #0f172a, #111827, #1f2937)',
              opacity: 0.6,
              backgroundSize: '200% 200%',
              animation: `${gradientShift} 14s ease infinite`,
            }}
          />
          {/* Optional watermark logo */}
          <Box
            component="img"
            src="/logo.png"
            alt="Institute Watermark"
            onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
            sx={{ position: 'absolute', right: 24, top: 24, height: 44, opacity: 0.85 }}
          />
          {/* Decorative blurred circles */}
          <Box sx={{ position: 'absolute', width: 260, height: 260, borderRadius: '50%', background: '#42a5f533', filter: 'blur(40px)', top: 80, left: 80 }} />
          <Box sx={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', background: '#1976d229', filter: 'blur(50px)', bottom: 120, right: 120 }} />
          <Box sx={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', background: '#00bcd433', filter: 'blur(40px)', bottom: 40, left: 200 }} />
          {/* Headline and bullets */}
          <Box sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 6 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0d47a1', mb: 1 }}>Welcome to YBIT Labs</Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 3 }}>Efficiently manage labs, assets, and maintenance</Typography>
            <Box sx={{ display: 'grid', gap: 1.2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleOutline color="primary" fontSize="small" />
                <Typography color="text.secondary">Track equipment across labs</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleOutline color="primary" fontSize="small" />
                <Typography color="text.secondary">Log and resolve maintenance quickly</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleOutline color="primary" fontSize="small" />
                <Typography color="text.secondary">Gain insights with a clean dashboard</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
