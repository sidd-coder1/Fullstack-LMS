import React from 'react';
import { Box, Card, CardContent, Typography, Divider, Stack, Switch, FormControlLabel } from '@mui/material';

const Settings: React.FC = () => {
  const [darkMode, setDarkMode] = React.useState(false);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Settings
      </Typography>

      <Stack spacing={2}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Appearance
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <FormControlLabel
              control={<Switch checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} />}
              label="Dark mode (placeholder)"
            />
            <Typography variant="body2" color="text.secondary">
              This is a placeholder. Hook this up to your theme provider to persist the preference.
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Account
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Manage your account details here.
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default Settings;
