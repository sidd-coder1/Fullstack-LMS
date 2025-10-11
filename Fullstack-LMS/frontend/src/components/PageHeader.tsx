import React from 'react';
import { Box, Typography } from '@mui/material';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, right }) => {
  return (
    <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 2 }}>
      <Box>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {right && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{right}</Box>
      )}
    </Box>
  );
};

export default PageHeader;
