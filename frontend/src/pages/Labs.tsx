import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Alert,
  Stack,
  TextField,
  Typography,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Add, Delete, Edit, Refresh } from '@mui/icons-material';
import { labsAPI, getToken } from '../services/api';
import type { Lab } from '../types';

const emptyForm = { name: '', location: '' };

type LabForm = typeof emptyForm;

const Labs: React.FC = () => {
  const navigate = useNavigate();
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const [openForm, setOpenForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<LabForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  const loadLabs = async () => {
    try {
      setLoading(true);
      // Dev fallback: if using temporary dev token, show mock data
      const token = getToken();
      if (token && token.startsWith('dev_')) {
        setLabs([
          { id: 1, name: 'Lab A', location: 'Block 1', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { id: 2, name: 'Lab B', location: 'Block 2', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { id: 3, name: 'Networking Lab', location: 'Block 3', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        ] as unknown as Lab[]);
      } else {
        const data = await labsAPI.getAll();
        setLabs(data);
      }
    } catch (e) {
      setError('Failed to load labs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLabs();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setOpenForm(true);
  };

  const handleOpenEdit = (lab: Lab) => {
    setEditingId(lab.id);
    setFormData({ name: lab.name, location: lab.location || '' });
    setOpenForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Lab name is required');
      return;
    }
    try {
      setSaving(true);
      if (editingId) {
        const updated = await labsAPI.update(editingId, {
          name: formData.name.trim(),
          location: formData.location?.trim() || undefined,
        });
        setLabs((prev) => prev.map((l) => (l.id === editingId ? updated : l)));
        setSuccess('Lab updated successfully');
      } else {
        const created = await labsAPI.create({
          name: formData.name.trim(),
          location: formData.location?.trim() || undefined,
          created_at: new Date().toISOString(), // will be ignored by backend, but keeping type happy
          updated_at: new Date().toISOString(),
          id: 0, // will be ignored
        } as any);
        setLabs((prev) => [created, ...prev]);
        setSuccess('Lab created successfully');
      }
      setOpenForm(false);
    } catch (e: any) {
      const detail = e?.response?.data || 'Save failed';
      setError(typeof detail === 'string' ? detail : 'Save failed');
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
      await labsAPI.delete(deleteId);
      setLabs((prev) => prev.filter((l) => l.id !== deleteId));
      setSuccess('Lab deleted successfully');
    } catch (e) {
      setError('Delete failed');
    } finally {
      setOpenDelete(false);
      setDeleteId(null);
    }
  };

  const rows = useMemo(() => labs, [labs]);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Labs</Typography>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Refresh">
            <span>
              <IconButton color="primary" onClick={loadLabs} disabled={loading}>
                {loading ? <CircularProgress size={22} /> : <Refresh />}
              </IconButton>
            </span>
          </Tooltip>
          <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreate}>Add Lab</Button>
        </Stack>
      </Box>

      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
              <CircularProgress />
            </Box>
          ) : rows.length === 0 ? (
            <Box sx={{ textAlign: 'center', color: 'text.secondary', py: 6 }}>
              <Typography variant="body1">No labs found. Click "Add Lab" to create one.</Typography>
            </Box>
          ) : (
            <Box sx={{ width: '100%' }}>
              <DataGrid
                autoHeight
                rows={rows}
                getRowId={(r) => r.id}
                columns={([
                  {
                    field: 'name',
                    headerName: 'Name',
                    flex: 1,
                    renderCell: (params: any) => (
                      <Box sx={{ cursor: 'pointer', color: 'primary.main', textDecoration: 'underline' }} onClick={() => navigate(`/labs/${params.row.id}`)}>
                        {params.value}
                      </Box>
                    ),
                  },
                  { field: 'location', headerName: 'Location', flex: 1, valueGetter: (p: any) => p.row.location || '-' },
                  { field: 'created_at', headerName: 'Created', flex: 1, valueGetter: (p: any) => new Date(p.row.created_at).toLocaleString() },
                  { field: 'updated_at', headerName: 'Updated', flex: 1, valueGetter: (p: any) => new Date(p.row.updated_at).toLocaleString() },
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
                          <IconButton color="info" size="small" onClick={() => handleOpenEdit(params.row)}>
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
      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? 'Edit Lab' : 'Add Lab'}</DialogTitle>
        <Box component="form" onSubmit={handleSave}>
          <DialogContent>
            <Stack spacing={2}>
              <TextField
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                autoFocus
              />
              <TextField
                label="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenForm(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Delete Lab?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this lab? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Alerts */}
      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError('')}>
        <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess('')}>
        <Alert severity="success" onClose={() => setSuccess('')}>{success}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Labs;
