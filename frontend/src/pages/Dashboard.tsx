import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Science as LabIcon,
  Computer as PCIcon,
  Hardware as EquipmentIcon,
  Build as MaintenanceIcon,
} from '@mui/icons-material';
import { inventoryAPI, labsAPI, maintenanceAPI, getToken } from '../services/api';
import type { Inventory, Lab, MaintenanceLog } from '../types';

interface DashboardStats {
  totalLabs: number;
  totalEquipment: number;
  workingEquipment: number;
  pendingMaintenance: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalLabs: 0,
    totalEquipment: 0,
    workingEquipment: 0,
    pendingMaintenance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Dev fallback: if using temporary dev token, mock stats
        const token = getToken();
        if (token && token.startsWith('dev_')) {
          setStats({
            totalLabs: 3,
            totalEquipment: 42,
            workingEquipment: 36,
            pendingMaintenance: 2,
          });
          setError('');
          setLoading(false);
          return;
        }

        // Fetch all data in parallel
        const [labs, inventory, maintenance] = await Promise.all([
          labsAPI.getAll(),
          inventoryAPI.getAll(),
          maintenanceAPI.getAll(),
        ]);

        // Calculate stats
        const totalLabs = labs.length;
        const totalEquipment = inventory.reduce((sum, item) => sum + item.total_quantity, 0);
        const workingEquipment = inventory.reduce((sum, item) => sum + item.working_quantity, 0);
        const pendingMaintenance = maintenance.filter(log => log.status === 'pending').length;
        

        setStats({
          totalLabs,
          totalEquipment,
          workingEquipment,
          pendingMaintenance,
        });
        
      } catch (err: any) {
        setError('Failed to load dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string; // expects one of: 'primary' | 'info' | 'success' | 'warning'
  }> = ({ title, value, icon, color }) => {
    const gradients: Record<string, string> = {
      primary: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      info: 'linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)',
      success: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)',
      warning: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
    };
    const bg = gradients[color] || gradients.primary;

    return (
      <Card
        sx={{
          height: '100%',
          borderRadius: 3,
          overflow: 'hidden',
          backgroundImage: bg,
          color: 'common.white',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          position: 'relative',
          transition: 'transform 180ms ease, box-shadow 180ms ease',
          '&:hover': {
            transform: 'translateY(-3px) scale(1.01)',
            boxShadow: '0 16px 35px rgba(0,0,0,0.22)',
          },
        }}
      >
        <CardContent sx={{ position: 'relative' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <Box
              sx={{
                mr: 2,
                p: 1.25,
                borderRadius: 2,
                backgroundColor: 'rgba(255,255,255,0.18)',
                color: 'common.white',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                '& svg': { fontSize: 28 },
              }}
              aria-hidden
            >
              {icon}
            </Box>
            <Typography variant="subtitle1" component="div" sx={{ fontWeight: 600, opacity: 0.95 }}>
              {title}
            </Typography>
          </Box>
          <Typography
            variant="h3"
            component="div"
            sx={{ fontWeight: 800, letterSpacing: 0.5, textShadow: '0 2px 6px rgba(0,0,0,0.25)' }}
          >
            {value}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Dashboard
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
        }}
      >
        <Box>
          <StatCard
            title="Total Labs"
            value={stats.totalLabs}
            icon={<LabIcon />}
            color="primary"
          />
        </Box>
        <Box>
          <StatCard
            title="Total Equipment"
            value={stats.totalEquipment}
            icon={<EquipmentIcon />}
            color="info"
          />
        </Box>
        <Box>
          <StatCard
            title="Working Equipment"
            value={stats.workingEquipment}
            icon={<PCIcon />}
            color="success"
          />
        </Box>
        <Box>
          <StatCard
            title="Pending Maintenance"
            value={stats.pendingMaintenance}
            icon={<MaintenanceIcon />}
            color="warning"
          />
        </Box>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          Quick Overview
        </Typography>
        <Card>
          <CardContent>
            <Typography variant="body1" color="text.secondary">
              Welcome to the Yashwantrao Bhonsale Institute of Technology Lab Management System.
              Use the navigation menu to manage labs, equipment, software, and maintenance logs.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                • Equipment Status: {stats.workingEquipment} working out of {stats.totalEquipment} total
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Maintenance: {stats.pendingMaintenance} pending issues
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Labs: {stats.totalLabs} labs being managed
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      
    </Box>
  );
};

export default Dashboard;
