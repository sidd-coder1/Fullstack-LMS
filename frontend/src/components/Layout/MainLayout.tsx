import React, { useState } from 'react';
import { Box, Toolbar, Drawer, useTheme, useMediaQuery, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Button, Collapse } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  Science as LabIcon,
  Computer as PCIcon,
  Hardware as EquipmentIcon,
  Apps as SoftwareIcon,
  Build as MaintenanceIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const drawerWidth = 280;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleMenu = () => setMenuOpen((v) => !v);

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Labs', icon: <LabIcon />, path: '/labs' },
    { text: 'PCs', icon: <PCIcon />, path: '/pcs' },
    { text: 'Equipment', icon: <EquipmentIcon />, path: '/equipment' },
    { text: 'Software', icon: <SoftwareIcon />, path: '/software' },
    { text: 'Maintenance', icon: <MaintenanceIcon />, path: '/maintenance' },
    { text: 'Inventory', icon: <InventoryIcon />, path: '/inventory' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Header onMenuClick={handleDrawerToggle} />

      {/* Sidebar (temporary) */}
      <Sidebar open={mobileOpen} onClose={handleDrawerToggle} />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 2, sm: 3 },
          width: '100%',
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
;

export default MainLayout;
