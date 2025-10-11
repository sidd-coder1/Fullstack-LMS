import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Card, CardContent, Stack, TextField, MenuItem, Chip, CircularProgress } from '@mui/material';
import { Search, Refresh } from '@mui/icons-material';
import { labsAPI, pcsAPI } from '../services/api';
import type { Lab, PC } from '../types';

type Agg = { total: number; working: number; not_working: number; under_repair: number; other: number };

const getStatusChip = (status: string) => {
  const normalizedStatus = status?.toLowerCase() || '';

  if (normalizedStatus === 'working') {
    return <Chip label="Working" color="success" size="small" />;
  } else if (normalizedStatus === 'not_working') {
    return <Chip label="Not Working" color="error" size="small" />;
  } else if (normalizedStatus === 'under_repair') {
    return <Chip label="Under Repair" color="warning" size="small" />;
  } else {
    return <Chip label={status || 'Unknown'} color="default" size="small" />;
  }
};

const PCs: React.FC = () => {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [pcs, setPcs] = useState<PC[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [q, setQ] = useState('');
  const [fLab, setFLab] = useState<number | ''>('');
  const [fStatus, setFStatus] = useState<string | ''>('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');

      const labsData = await labsAPI.getAll();
      // Extract results from paginated response
      const labsArray = Array.isArray(labsData?.results) ? labsData.results : Array.isArray(labsData) ? labsData : [];
      setLabs(labsArray);

      const all: PC[] = [];
      for (const lab of labsArray) {
        try {
          const labPcs = await pcsAPI.getByLab(lab.id);
          // Extract results from paginated response if needed
          const pcsArray = Array.isArray(labPcs?.results) ? labPcs.results : Array.isArray(labPcs) ? labPcs : [];
          all.push(...pcsArray);
        } catch (err) {
          console.warn(`Failed to load PCs for lab ${lab.id}:`, err);
        }
      }
      setPcs(all);
    } catch (e: any) {
      console.error('Failed to load PCs:', e);
      setError(e?.response?.data?.detail || 'Failed to load PCs. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return pcs.filter((p) => {
      const matchLab = fLab ? p.lab === fLab : true;
      const text = `${p.name ?? ''} ${p.brand ?? ''} ${p.serial_number ?? ''}`.toLowerCase();
      const matchQ = q ? text.includes(q.toLowerCase()) : true;
      const matchStatus = fStatus ? (p.status || '').toLowerCase() === fStatus : true;
      return matchLab && matchQ && matchStatus;
    });
  }, [pcs, fLab, q, fStatus]);

  const totals: Agg = useMemo(() => {
    return filtered.reduce((acc, p) => {
      acc.total += 1;
      const s = (p.status || '').toLowerCase();
      if (s === 'working') acc.working += 1;
      else if (s === 'not_working') acc.not_working += 1;
      else if (s === 'under_repair') acc.under_repair += 1;
      else acc.other += 1; // unknown status
      return acc;
    }, { total: 0, working: 0, not_working: 0, under_repair: 0, other: 0 });
  }, [filtered]);

  const byLab: Record<number, Agg> = useMemo(() => {
    const map: Record<number, Agg> = {} as any;
    filtered.forEach((p) => {
      const entry = (map[p.lab] ??= { total: 0, working: 0, not_working: 0, under_repair: 0, other: 0 });
      entry.total += 1;
      const s = (p.status || '').toLowerCase();
      if (s === 'working') entry.working += 1;
      else if (s === 'not_working') entry.not_working += 1;
      else if (s === 'under_repair') entry.under_repair += 1;
      else entry.other += 1;
    });
    return map;
  }, [filtered]);

  const labIds = Object.keys(byLab).map(Number);
  const maxLabTotal = Math.max(1, ...labIds.map((id) => byLab[id]?.total || 0));

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        PCs Dashboard
      </Typography>

      {/* Filters */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
            <TextField
              label="Search"
              placeholder="Name, brand or serial..."
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
            <TextField select label="Status" value={fStatus} onChange={(e) => setFStatus(e.target.value)} sx={{ minWidth: 180 }}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="working">Working</MenuItem>
              <MenuItem value="not_working">Not Working</MenuItem>
              <MenuItem value="under_repair">Under Repair</MenuItem>
            </TextField>
            <Box>
              <Chip label={`Total: ${totals.total}`} sx={{ mr: 1 }} />
              <Chip color="success" label={`Working: ${totals.working}`} sx={{ mr: 1 }} />
              <Chip color="error" label={`Not Working: ${totals.not_working}`} sx={{ mr: 1 }} />
              <Chip color="warning" label={`Under Repair: ${totals.under_repair}`} sx={{ mr: 1 }} />
              {totals.other > 0 && <Chip color="default" label={`Other: ${totals.other}`} />}
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Bar Chart by Lab */}
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>PCs by Lab</Typography>
              {labIds.length === 0 ? (
                <Typography color="text.secondary">No data</Typography>
              ) : (
                <Box sx={{ overflowX: 'auto' }}>
                  <Box component="svg" width={Math.max(600, labIds.length * 160)} height={280} sx={{ '& text': { fill: 'currentColor' } }}>
                    {labIds.map((id, idx) => {
                      const agg = byLab[id]!;
                      const x = 70 + idx * 140;
                      const scale = (v: number) => (v / maxLabTotal) * 160;
                      return (
                        <g key={id}>
                          <rect x={x} y={60 + (160 - scale(agg.working))} width={28} height={scale(agg.working)} fill="#16a34a" rx={4} />
                          <rect x={x + 34} y={60 + (160 - scale(agg.not_working))} width={28} height={scale(agg.not_working)} fill="#dc2626" rx={4} />
                          <rect x={x + 68} y={60 + (160 - scale(agg.under_repair))} width={28} height={scale(agg.under_repair)} fill="#f59e0b" rx={4} />
                          <text x={x + 48} y={240} textAnchor="middle" fontSize="12">Lab {id}</text>
                        </g>
                      );
                    })}
                    <g>
                      <rect x={10} y={10} width={12} height={12} fill="#16a34a" />
                      <text x={28} y={20} fontSize="12">Working</text>
                      <rect x={110} y={10} width={12} height={12} fill="#dc2626" />
                      <text x={128} y={20} fontSize="12">Not Working</text>
                      <rect x={230} y={10} width={12} height={12} fill="#f59e0b" />
                      <text x={248} y={20} fontSize="12">Under Repair</text>
                    </g>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Table */}
          <Card>
            <CardContent>
              <Box component="table" sx={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                <Box component="thead" sx={{ backgroundColor: (theme) => theme.palette.mode === 'light' ? 'grey.100' : 'grey.200' }}>
                  <Box component="tr">
                    <Box component="th" sx={{ textAlign: 'left', p: 1.5, color: 'text.primary', fontWeight: 600 }}>Lab</Box>
                    <Box component="th" sx={{ textAlign: 'left', p: 1.5, color: 'text.primary', fontWeight: 600 }}>Name</Box>
                    <Box component="th" sx={{ textAlign: 'left', p: 1.5, color: 'text.primary', fontWeight: 600 }}>Brand</Box>
                    <Box component="th" sx={{ textAlign: 'left', p: 1.5, color: 'text.primary', fontWeight: 600 }}>Serial</Box>
                    <Box component="th" sx={{ textAlign: 'left', p: 1.5, color: 'text.primary', fontWeight: 600 }}>Status</Box>
                  </Box>
                </Box>
                <Box component="tbody">
                  {filtered.map((p) => (
                    <Box key={p.id} component="tr" sx={{ '&:nth-of-type(even)': { backgroundColor: (theme) => theme.palette.mode === 'light' ? 'grey.50' : 'grey.100' } }}>
                      <Box component="td" sx={{ p: 1.5, color: 'text.secondary' }}>Lab {p.lab}</Box>
                      <Box component="td" sx={{ p: 1.5, color: 'text.primary' }}>{p.name}</Box>
                      <Box component="td" sx={{ p: 1.5, color: 'text.secondary' }}>{p.brand || '-'}</Box>
                      <Box component="td" sx={{ p: 1.5, color: 'text.secondary' }}>{p.serial_number || '-'}</Box>
                      <Box component="td" sx={{ p: 1.5 }}>{getStatusChip(p.status)}</Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};

export default PCs;
