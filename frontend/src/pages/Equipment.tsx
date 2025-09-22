import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Add, Refresh, Edit, Delete, Search } from '@mui/icons-material';
import { equipmentAPI, labsAPI, getToken } from '../services/api';
import type { Equipment as EquipmentType, Lab } from '../types';

const EQUIPMENT_TYPES = [
  'PC', 'MONITOR', 'KEYBOARD', 'MOUSE', 'ROUTER', 'SWITCH', 'SERVER', 'FAN', 'LIGHT', 'OTHER',
] as const;
const STATUS = ['working', 'not_working', 'under_repair'] as const;

type EquipmentForm = {
  lab: number | '';
  equipment_type: (typeof EQUIPMENT_TYPES)[number] | '';
  brand: string;
  model_name: string;
  serial_number: string;
  location_in_lab: string;
  price: string;
  status: (typeof STATUS)[number] | '';
};

const emptyForm: EquipmentForm = {
  lab: '',
  equipment_type: '',
  brand: '',
  model_name: '',
  serial_number: '',
  location_in_lab: '',
  price: '',
  status: 'working',
};

const Equipment: React.FC = () => {
  const [items, setItems] = useState<EquipmentType[]>([]);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // filters
  const [q, setQ] = useState('');
  const [fLab, setFLab] = useState<number | ''>('');
  const [fType, setFType] = useState<(typeof EQUIPMENT_TYPES)[number] | ''>('');
  const [fStatus, setFStatus] = useState<(typeof STATUS)[number] | ''>('');

  // form
  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<EquipmentForm>(emptyForm);

  // delete
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const loadAll = async () => {
    try {
      setLoading(true);
      // Dev fallback: if using temporary dev token, show mock data
      const token = getToken();
      if (token && token.startsWith('dev_')) {
        setLabs([
          { id: 1, name: 'Lab A', location: 'Block 1', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { id: 2, name: 'Lab B', location: 'Block 2', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        ] as unknown as Lab[]);
        setItems([
          { id: 1, lab: 1, equipment_type: 'PC', brand: 'Dell', model_name: 'Optiplex', serial_number: 'PC-001', location_in_lab: 'Row 1', price: 45000 as any, status: 'working', added_on: new Date().toISOString(), updated_at: new Date().toISOString() },
          { id: 2, lab: 1, equipment_type: 'MONITOR', brand: 'LG', model_name: 'Ultra', serial_number: 'MN-002', location_in_lab: 'Row 1', price: 12000 as any, status: 'working', added_on: new Date().toISOString(), updated_at: new Date().toISOString() },
          { id: 3, lab: 2, equipment_type: 'ROUTER', brand: 'TP-Link', model_name: 'AX1800', serial_number: 'RT-003', location_in_lab: 'Rack', price: 8000 as any, status: 'under_repair', added_on: new Date().toISOString(), updated_at: new Date().toISOString() },
        ] as unknown as EquipmentType[]);
        return;
      }

      const [eqps, labsData] = await Promise.all([
        equipmentAPI.getAll(),
        labsAPI.getAll(),
      ]);
      setItems(eqps);
      setLabs(labsData);
    } catch (e) {
      setError('Failed to load equipment');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const filtered = useMemo(() => {
    return items.filter((it) => {
      const matchLab = fLab ? it.lab === fLab : true;
      const matchType = fType ? it.equipment_type === fType : true;
      const matchStatus = fStatus ? it.status === fStatus : true;
      const text = `${it.brand ?? ''} ${it.model_name ?? ''} ${it.serial_number ?? ''}`.toLowerCase();
      const matchQ = q ? text.includes(q.toLowerCase()) : true;
      return matchLab && matchType && matchStatus && matchQ;
    });
  }, [items, fLab, fType, fStatus, q]);

  const openCreate = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setOpenForm(true);
  };

  const openEdit = (row: EquipmentType) => {
    setEditingId(row.id);
    setFormData({
      lab: row.lab,
      equipment_type: row.equipment_type as any,
      brand: row.brand || '',
      model_name: row.model_name || '',
      serial_number: row.serial_number || '',
      location_in_lab: row.location_in_lab || '',
      price: row.price ? String(row.price) : '',
      status: row.status as any,
    });
    setOpenForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.lab || !formData.equipment_type) {
      setError('Lab and equipment type are required');
      return;
    }
    try {
      setSaving(true);
      const payload: any = {
        lab: formData.lab,
        equipment_type: formData.equipment_type,
        brand: formData.brand || undefined,
        model_name: formData.model_name || undefined,
        serial_number: formData.serial_number || undefined,
        location_in_lab: formData.location_in_lab || undefined,
        price: formData.price ? Number(formData.price) : undefined,
        status: formData.status || 'working',
      };
      if (editingId) {
        const updated = await equipmentAPI.update(editingId, payload);
        setItems((prev) => prev.map((x) => (x.id === editingId ? updated : x)));
        setSuccess('Equipment updated');
      } else {
        const created = await equipmentAPI.create(payload);
        setItems((prev) => [created, ...prev]);
        setSuccess('Equipment created');
      }
      setOpenForm(false);
    } catch (err: any) {
      const data = err?.response?.data;
      if (data) {
        const msgs: string[] = [];
        Object.entries(data).forEach(([k, v]) => {
          if (Array.isArray(v)) msgs.push(`${k}: ${v.join(' ')}`);
          else if (typeof v === 'string') msgs.push(`${k}: ${v}`);
        });
        setError(msgs.join('\n') || 'Save failed');
      } else setError('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (id: number) => {
    setDeleteId(id);
    setOpenDelete(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await equipmentAPI.delete(deleteId);
      setItems((prev) => prev.filter((x) => x.id !== deleteId));
      setSuccess('Equipment deleted');
    } catch (e) {
      setError('Delete failed');
    } finally {
      setOpenDelete(false);
      setDeleteId(null);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Equipment
      </Typography>

      {/* Filters */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
            <TextField
              label="Search"
              placeholder="Brand, model or serial..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              InputProps={{ endAdornment: <Search fontSize="small" /> }}
              sx={{ flex: 1 }}
            />
            <TextField
              select
              label="Lab"
              value={fLab}
              onChange={(e) => setFLab(e.target.value === '' ? '' : Number(e.target.value))}
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="">All</MenuItem>
              {labs.map((l) => (
                <MenuItem key={l.id} value={l.id}>{l.name}</MenuItem>
              ))}
            </TextField>
            <TextField select label="Type" value={fType} onChange={(e) => setFType(e.target.value as any)} sx={{ minWidth: 160 }}>
              <MenuItem value="">All</MenuItem>
              {EQUIPMENT_TYPES.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </TextField>
            <TextField select label="Status" value={fStatus} onChange={(e) => setFStatus(e.target.value as any)} sx={{ minWidth: 180 }}>
              <MenuItem value="">All</MenuItem>
              {STATUS.map((s) => (
                <MenuItem key={s} value={s} style={{ textTransform: 'capitalize' }}>{s.replace('_', ' ')}</MenuItem>
              ))}
            </TextField>
            <Tooltip title="Refresh">
              <span>
                <IconButton onClick={loadAll} disabled={loading}>
                  {loading ? <CircularProgress size={22} /> : <Refresh />}
                </IconButton>
              </span>
            </Tooltip>
            <Button variant="contained" startIcon={<Add />} onClick={openCreate}>Add Equipment</Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
              <CircularProgress />
            </Box>
          ) : filtered.length === 0 ? (
            <Box sx={{ textAlign: 'center', color: 'text.secondary', py: 6 }}>
              <Typography>No equipment found. Try changing filters or add new equipment.</Typography>
            </Box>
          ) : (
            <Box sx={{ width: '100%' }}>
              <DataGrid
                autoHeight
                rows={filtered}
                getRowId={(r) => r.id}
                columns={([
                  { field: 'lab', headerName: 'Lab', flex: 1, valueGetter: (p: any) => labs.find((l) => l.id === p.row.lab)?.name || p.row.lab },
                  { field: 'equipment_type', headerName: 'Type', flex: 1 },
                  { field: 'brand', headerName: 'Brand', flex: 1, valueGetter: (p: any) => p.row.brand || '-' },
                  { field: 'model_name', headerName: 'Model', flex: 1, valueGetter: (p: any) => p.row.model_name || '-' },
                  { field: 'serial_number', headerName: 'Serial', flex: 1, valueGetter: (p: any) => p.row.serial_number || '-' },
                  { field: 'status', headerName: 'Status', flex: 1, valueGetter: (p: any) => (p.row.status as string).replace('_', ' '),
                    renderCell: (params: any) => (
                      <Box sx={{ textTransform: 'capitalize' }}>{String(params.value)}</Box>
                    )
                  },
                  {
                    field: 'actions',
                    headerName: 'Actions',
                    sortable: false,
                    filterable: false,
                    align: 'right',
                    headerAlign: 'right',
                    width: 140,
                    renderCell: (params: any) => (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit">
                          <IconButton color="info" size="small" onClick={() => openEdit(params.row)}>
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton color="error" size="small" onClick={() => confirmDelete(params.row.id)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    ),
                  },
                ] as GridColDef[])}
                disableRowSelectionOnClick
                pageSizeOptions={[5, 10, 25]}
                initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="md">
        <DialogTitle>{editingId ? 'Edit Equipment' : 'Add Equipment'}</DialogTitle>
        <Box component="form" onSubmit={handleSave}>
          <DialogContent>
            <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
              <TextField select label="Lab" value={formData.lab} onChange={(e) => setFormData({ ...formData, lab: e.target.value === '' ? '' : Number(e.target.value) })} required fullWidth>
                {labs.map((l) => (
                  <MenuItem key={l.id} value={l.id}>{l.name}</MenuItem>
                ))}
              </TextField>
              <TextField select label="Type" value={formData.equipment_type} onChange={(e) => setFormData({ ...formData, equipment_type: e.target.value as any })} required fullWidth>
                {EQUIPMENT_TYPES.map((t) => (
                  <MenuItem key={t} value={t}>{t}</MenuItem>
                ))}
              </TextField>
            </Stack>
            <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ mt: 2 }}>
              <TextField label="Brand" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} fullWidth />
              <TextField label="Model" value={formData.model_name} onChange={(e) => setFormData({ ...formData, model_name: e.target.value })} fullWidth />
            </Stack>
            <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ mt: 2 }}>
              <TextField label="Serial" value={formData.serial_number} onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })} fullWidth />
              <TextField label="Location" value={formData.location_in_lab} onChange={(e) => setFormData({ ...formData, location_in_lab: e.target.value })} fullWidth />
            </Stack>
            <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ mt: 2 }}>
              <TextField label="Price" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} fullWidth />
              <TextField select label="Status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} fullWidth>
                {STATUS.map((s) => (
                  <MenuItem key={s} value={s} style={{ textTransform: 'capitalize' }}>{s.replace('_', ' ')}</MenuItem>
                ))}
              </TextField>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenForm(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Delete Equipment?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this item? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Alerts */}
      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError('')}>
        <Alert severity="error" onClose={() => setError('')} sx={{ whiteSpace: 'pre-line' }}>{error}</Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess('')}>
        <Alert severity="success" onClose={() => setSuccess('')}>{success}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Equipment;
