import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' as 'admin' | 'student',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field: string) => (e: any) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      navigate('/');
    } catch (err: any) {
      // Extract helpful error messages from DRF
      const data = err?.response?.data;
      if (data) {
        if (typeof data === 'string') {
          setError(data);
        } else if (data.detail) {
          setError(data.detail);
        } else {
          const messages: string[] = [];
          Object.entries(data).forEach(([field, value]) => {
            if (Array.isArray(value)) {
              messages.push(`${field}: ${value.join(' ')}`);
            } else if (typeof value === 'string') {
              messages.push(`${field}: ${value}`);
            }
          });
          setError(messages.join('\n') || 'Registration failed. Please try again.');
        }
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Yashwantrao Bhonsale Institute of Technology
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Lab Management System
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create your account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              margin="normal"
              required
              value={formData.username}
              onChange={handleChange('username')}
              autoComplete="username"
              autoFocus
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
              margin="normal"
              required
              value={formData.email}
              onChange={handleChange('email')}
              autoComplete="email"
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                label="Role"
                onChange={handleChange('role')}
              >
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="admin">Admin/Professor</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              required
              value={formData.password}
              onChange={handleChange('password')}
              autoComplete="new-password"
            />
            <Typography variant="caption" color="text.secondary">
              Use a strong password (8+ characters, not common or all numbers).
            </Typography>
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              variant="outlined"
              margin="normal"
              required
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              autoComplete="new-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                },
              }}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/login')}
                sx={{ textDecoration: 'none' }}
              >
                Already have an account? Sign In
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
