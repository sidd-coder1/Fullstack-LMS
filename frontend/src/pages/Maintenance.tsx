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
import { Add, Refresh, Edit, Delete, Search } from '@mui/icons-material';
// Using native date inputs to avoid extra dependencies
import { maintenanceAPI, labsAPI, getToken } from '../services/api';
import type { MaintenanceLog, Lab } from '../types';

const STATUS = ['pending', 'fixed'] as const;

// UI row shape (normalized)
type MaintRow = {
  id: number;
  lab: number | null; // best effort, null when unknown
  title: string;
  description?: string;
  status: 'pending' | 'fixed';
  reported_on: string;
  fixed_on?: string | null;
};

type MaintForm = {
  lab: number | null;
  title: string;
  description: string;
  status: (typeof STATUS)[number];
  reported_on: string; // ISO
  fixed_on?: string | null; // ISO
};

const Maintenance: React.FC = () => {
  const [items, setItems] = useState<MaintRow[]>([]);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // filters
  const [q, setQ] = useState('');
  const [fLab, setFLab] = useState<number | ''>('');
  const [fStatus, setFStatus] = useState<(typeof STATUS)[number] | ''>('');
  const [from, setFrom] = useState<string>(''); // YYYY-MM-DD
  const [to, setTo] = useState<string>('');

  // form
  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<MaintForm>({
    lab: null,
    title: '',
    description: '',
    status: 'pending',
    reported_on: new Date().toISOString(),
    fixed_on: null,
  });

  // delete
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const loadAll = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (token && token.startsWith('dev_')) {
        setLabs([
          { id: 1, name: 'Lab A', location: 'Block 1', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { id: 2, name: 'Lab B', location: 'Block 2', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        ] as unknown as Lab[]);
        setItems([
          { id: 1, lab: 1, title: 'PC not starting', description: 'Power issue on PC-04', status: 'pending', reported_on: new Date().toISOString(), fixed_on: null },
          { id: 2, lab: 2, title: 'Router rebooting', description: 'Router restarts randomly', status: 'fixed', reported_on: new Date(Date.now() - 5*24*60*60*1000).toISOString(), fixed_on: new Date(Date.now() - 1*24*60*60*1000).toISOString() },
        ]);
        return;
      }

      const [logs, labsData] = await Promise.all([
        maintenanceAPI.getAll(),
        labsAPI.getAll(),
      ]);
      // Map backend MaintenanceLog to UI MaintRow best-effort
      const mapped: MaintRow[] = logs.map((m: MaintenanceLog) => ({
        id: m.id,
        lab: null, // cannot infer from API without equipment->lab relation on client
        title: m.issue_description || `Equipment #${m.equipment}`,
        description: m.remarks,
        status: m.status,
        reported_on: m.reported_on,
        fixed_on: m.fixed_on ?? null,
      }));
      setItems(mapped);
      setLabs(labsData);
    } catch (e) {
      setError('Failed to load maintenance logs');
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
      const matchStatus = fStatus ? it.status === fStatus : true;
      const text = `${it.title} ${it.description ?? ''}`.toLowerCase();
      const matchQ = q ? text.includes(q.toLowerCase()) : true;
      const itDate = it.reported_on?.slice(0,10);
      const matchFrom = from ? itDate >= from : true;
      const matchTo = to ? itDate <= to : true;
      return matchLab && matchStatus && matchQ && matchFrom && matchTo;
    });
  }, [items, fLab, fStatus, q, from, to]);

  const openCreate = () => {
    setEditingId(null);
    setFormData({ lab: null, title: '', description: '', status: 'pending', reported_on: new Date().toISOString(), fixed_on: null });
    setOpenForm(true);
  };

  const openEdit = (row: MaintRow) => {
    setEditingId(row.id);
    setFormData({
      lab: row.lab ?? null,
      title: row.title,
      description: row.description || '',
      status: row.status as any,
      reported_on: row.reported_on,
      fixed_on: row.fixed_on || null,
    });
    setOpenForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.lab || !formData.title.trim()) {
      setError('Lab and title are required');
      return;
    }
    try {
      setSaving(true);
      const payload: any = {
        lab: formData.lab,
        title: formData.title.trim(),
        description: formData.description || undefined,
        status: formData.status,
        reported_on: formData.reported_on,
        fixed_on: formData.status === 'fixed' ? formData.fixed_on || new Date().toISOString() : null,
      };
      if (editingId) {
        const updated = await maintenanceAPI.update(editingId, payload);
        const mapped: MaintRow = {
          id: updated.id,
          lab: formData.lab,
          title: updated.issue_description || formData.title,
          description: updated.remarks ?? formData.description,
          status: updated.status,
          reported_on: updated.reported_on,
          fixed_on: updated.fixed_on ?? null,
        };
        setItems((prev) => prev.map((x) => (x.id === editingId ? mapped : x)));
        setSuccess('Maintenance updated');
      } else {
        const created = await maintenanceAPI.create(payload);
        const mapped: MaintRow = {
          id: created.id,
          lab: formData.lab,
          title: created.issue_description || formData.title,
          description: created.remarks ?? formData.description,
          status: created.status,
          reported_on: created.reported_on,
          fixed_on: created.fixed_on ?? null,
        };
        setItems((prev) => [mapped, ...prev]);
        setSuccess('Maintenance created');
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
      await maintenanceAPI.delete(deleteId);
      setItems((prev) => prev.filter((x) => x.id !== deleteId));
      setSuccess('Maintenance deleted');
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
        Maintenance Logs
      </Typography>

      {/* Filters */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
            <TextField
              label="Search"
              placeholder="Title or description..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              InputProps={{ endAdornment: <Search fontSize="small" /> }}
              sx={{ flex: 1 }}
            />
            <TextField select label="Lab" value={fLab} onChange={(e) => setFLab(e.target.value === '' ? '' : Number(e.target.value))} sx={{ minWidth: 180 }}>
              <MenuItem value="">All</MenuItem>
              {labs.map((l) => (
                <MenuItem key={l.id} value={l.id}>{l.name}</MenuItem>
              ))}
            </TextField>
            <TextField select label="Status" value={fStatus} onChange={(e) => setFStatus(e.target.value as any)} sx={{ minWidth: 160 }}>
              <MenuItem value="">All</MenuItem>
              {STATUS.map((s) => (
                <MenuItem key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</MenuItem>
              ))}
            </TextField>
            <TextField label="From" type="date" value={from} onChange={(e) => setFrom(e.target.value)} InputLabelProps={{ shrink: true }} />
            <TextField label="To" type="date" value={to} onChange={(e) => setTo(e.target.value)} InputLabelProps={{ shrink: true }} />
            <Tooltip title="Refresh">
              <span>
                <IconButton onClick={loadAll} disabled={loading}>
                  {loading ? <CircularProgress size={22} /> : <Refresh />}
                </IconButton>
              </span>
            </Tooltip>
            <Button variant="contained" startIcon={<Add />} onClick={openCreate}>Add Log</Button>
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
              <Typography>No maintenance logs found. Try changing filters or add a new log.</Typography>
            </Box>
          ) : (
            <Box component="table" sx={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
              <Box component="thead" sx={{ backgroundColor: 'grey.100' }}>
                <Box component="tr">
                  <Box component="th" sx={{ textAlign: 'left', p: 1.5 }}>Lab</Box>
                  <Box component="th" sx={{ textAlign: 'left', p: 1.5 }}>Title</Box>
                  <Box component="th" sx={{ textAlign: 'left', p: 1.5 }}>Status</Box>
                  <Box component="th" sx={{ textAlign: 'left', p: 1.5 }}>Reported</Box>
                  <Box component="th" sx={{ textAlign: 'left', p: 1.5 }}>Fixed</Box>
                  <Box component="th" sx={{ textAlign: 'right', p: 1.5 }}>Actions</Box>
                </Box>
              </Box>
              <Box component="tbody">
                {filtered.map((row) => (
                  <Box key={row.id} component="tr" sx={{ '&:nth-of-type(even)': { backgroundColor: 'grey.50' } }}>
                    <Box component="td" sx={{ p: 1.5 }}>{labs.find((l) => l.id === row.lab)?.name || row.lab}</Box>
                    <Box component="td" sx={{ p: 1.5 }}>{row.title}</Box>
                    <Box component="td" sx={{ p: 1.5, textTransform: 'capitalize' }}>{row.status}</Box>
                    <Box component="td" sx={{ p: 1.5 }}>{row.reported_on?.slice(0,10)}</Box>
                    <Box component="td" sx={{ p: 1.5 }}>{row.fixed_on ? row.fixed_on.slice(0,10) : '-'}</Box>
                    <Box component="td" sx={{ p: 1.5, textAlign: 'right' }}>
                      <Tooltip title="Edit">
                        <IconButton color="info" onClick={() => openEdit(row)}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => confirmDelete(row.id)}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="md">
        <DialogTitle>{editingId ? 'Edit Maintenance' : 'Add Maintenance'}</DialogTitle>
        <Box component="form" onSubmit={handleSave}>
          <DialogContent>
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField select label="Lab" value={formData.lab ?? ''} onChange={(e) => setFormData({ ...formData, lab: e.target.value === '' ? null : Number(e.target.value) })} required fullWidth>
                  {labs.map((l) => (
                    <MenuItem key={l.id} value={l.id}>{l.name}</MenuItem>
                  ))}
                </TextField>
                <TextField label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required fullWidth />
              </Stack>
              <TextField label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} multiline minRows={3} fullWidth />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField select label="Status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} fullWidth>
                  {STATUS.map((s) => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  ))}
                </TextField>
                <TextField label="Reported On" type="date" value={formData.reported_on.slice(0,10)} onChange={(e) => setFormData({ ...formData, reported_on: new Date(e.target.value).toISOString() })} InputLabelProps={{ shrink: true }} />
                <TextField label="Fixed On" type="date" value={formData.fixed_on ? formData.fixed_on.slice(0,10) : ''} onChange={(e) => setFormData({ ...formData, fixed_on: e.target.value ? new Date(e.target.value).toISOString() : null })} InputLabelProps={{ shrink: true }} disabled={formData.status !== 'fixed'} />
              </Stack>
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
        <DialogTitle>Delete Maintenance?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this log? This action cannot be undone.</Typography>
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

export default Maintenance;
