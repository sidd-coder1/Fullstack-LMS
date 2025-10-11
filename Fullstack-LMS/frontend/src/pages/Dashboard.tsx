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
import { equipmentAPI, labsAPI, maintenanceAPI } from '../services/api';
import type { Equipment, Lab, MaintenanceLog } from '../types';

interface DashboardStats {
  totalLabs: number;
  totalEquipment: number;
  workingEquipment: number;
  notWorkingEquipment: number;
  underRepairEquipment: number;
  pendingMaintenance: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalLabs: 0,
    totalEquipment: 0,
    workingEquipment: 0,
    notWorkingEquipment: 0,
    underRepairEquipment: 0,
    pendingMaintenance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch all data in parallel
        const [labs, equipment, maintenance] = await Promise.all<[
          any,
          any,
          any
        ]>([
          labsAPI.getAll(),
          equipmentAPI.getAll(),
          maintenanceAPI.getAll(),
        ]);

        // Extract results from paginated responses
        const labsArray = (Array.isArray(labs) ? labs : (labs?.results ?? [])) as Lab[];
        const equipmentArray = (Array.isArray(equipment) ? equipment : (equipment?.results ?? [])) as Equipment[];
        const maintenanceArray = (Array.isArray(maintenance) ? maintenance : (maintenance?.results ?? [])) as MaintenanceLog[];

        // Calculate stats from actual equipment data
        const totalLabs = labsArray.length;
        const totalEquipment = equipmentArray.length;
        const workingEquipment = equipmentArray.filter((item: Equipment) => item.status === 'working').length;
        const notWorkingEquipment = equipmentArray.filter((item: Equipment) => item.status === 'not_working').length;
        const underRepairEquipment = equipmentArray.filter((item: Equipment) => item.status === 'under_repair').length;
        const pendingMaintenance = maintenanceArray.filter((log: MaintenanceLog) => log.status === 'pending').length;

        setStats({
          totalLabs,
          totalEquipment,
          workingEquipment,
          notWorkingEquipment,
          underRepairEquipment,
          pendingMaintenance,
        });

      } catch (err: any) {
        console.error('Dashboard error:', err);
        setError(err?.response?.data?.detail || 'Failed to load dashboard data. Please check your connection and try again.');
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
            md: 'repeat(3, 1fr)',
            lg: 'repeat(6, 1fr)',
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
            title="Not Working Equipment"
            value={stats.notWorkingEquipment}
            icon={<PCIcon />}
            color="warning"
          />
        </Box>
        <Box>
          <StatCard
            title="Under Repair Equipment"
            value={stats.underRepairEquipment}
            icon={<MaintenanceIcon />}
            color="info"
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
                • Equipment Status: {stats.workingEquipment} working, {stats.notWorkingEquipment} not working, {stats.underRepairEquipment} under repair (out of {stats.totalEquipment} total)
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
