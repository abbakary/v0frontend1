import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Box,
  Typography,
  CircularProgress,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Search, Plus, Edit, Trash2, Eye, Wallet } from 'lucide-react';
import { useThemeColors } from '../../../utils/useThemeColors';

// Import the service if available, otherwise create basic fetch
const fundService = {
  list: (params) => fetch(`https://daliportal-api.daligeotech.com/funds/?${new URLSearchParams(params)}`).then(r => r.json()),
  get: (id) => fetch(`https://daliportal-api.daligeotech.com/funds/${id}`).then(r => r.json()),
  update: (id, data) => fetch(`https://daliportal-api.daligeotech.com/funds/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  delete: (id) => fetch(`https://daliportal-api.daligeotech.com/funds/${id}`, { method: 'DELETE' }).then(r => r.json()),
  create: (data) => fetch(`https://daliportal-api.daligeotech.com/funds/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
};

const SORT_OPTIONS = [
  { value: 'created_at', label: 'Newest' },
  { value: 'updated_at', label: 'Recently Updated' },
  { value: 'title', label: 'Title A-Z' },
];

const STATUS_COLORS = {
  pending: { bg: 'rgba(245,158,11,0.15)', text: '#F59E0B' },
  active: { bg: 'rgba(16,185,129,0.15)', text: '#10B981' },
  closed: { bg: 'rgba(59,130,246,0.15)', text: '#3B82F6' },
  cancelled: { bg: 'rgba(239,68,68,0.15)', text: '#EF4444' },
};

function StatusBadge({ status }) {
  const config = STATUS_COLORS[status?.toLowerCase()] || STATUS_COLORS.pending;
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '6px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: 600,
        backgroundColor: config.bg,
        color: config.text,
        border: `1px solid ${config.text}33`,
      }}
    >
      {status ? status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ') : 'Unknown'}
    </span>
  );
}

export default function AdminFundsManagementPage() {
  const navigate = useNavigate();
  const themeColors = useThemeColors();

  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedFund, setSelectedFund] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchFunds();
  }, [page, rowsPerPage, searchTerm, statusFilter, sortBy, sortOrder]);

  const fetchFunds = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: page + 1,
        page_size: rowsPerPage,
        sort_by: sortBy,
        sort_order: sortOrder,
      };
      if (searchTerm) params.search = searchTerm;
      if (statusFilter && statusFilter !== 'all') params.status = statusFilter;

      const response = await fundService.list(params);
      const data = response?.data;

      if (data?.items) {
        setFunds(data.items);
        setTotalCount(data.total || data.items.length);
      } else if (Array.isArray(data)) {
        setFunds(data);
        setTotalCount(data.length);
      } else {
        setFunds([]);
        setTotalCount(0);
      }
    } catch (err) {
      setError('Failed to load funds');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedFund) return;
    setDeleting(true);
    try {
      await fundService.delete(selectedFund.id);
      setFunds(funds.filter((f) => f.id !== selectedFund.id));
      setDeleteDialogOpen(false);
      setSelectedFund(null);
    } catch (err) {
      setError('Failed to delete fund');
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatCurrency = (value) => {
    if (!value) return '—';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <DashboardLayout>
      <Box sx={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: themeColors.text }}>
            Funds Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={() => navigate('/dashboard/admin/funds/new')}
            sx={{ background: '#61C5C3', color: '#fff', textTransform: 'none', fontWeight: 600, '&:hover': { background: '#4fb3b1' } }}
          >
            Create Fund
          </Button>
        </Box>

        <Card sx={{ marginBottom: '24px', background: themeColors.card, border: `1px solid ${themeColors.border}` }}>
          <CardContent sx={{ padding: '20px' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr 1fr' }, gap: '16px' }}>
              <TextField
                placeholder="Search funds..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
                size="small"
                InputProps={{ startAdornment: <Search size={18} style={{ marginRight: '8px', color: themeColors.textMuted }} /> }}
                sx={{ '& .MuiOutlinedInput-root': { color: themeColors.text, borderColor: themeColors.border } }}
              />
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
                style={{ padding: '8px 12px', borderRadius: '6px', border: `1px solid ${themeColors.border}`, backgroundColor: themeColors.card, color: themeColors.text, fontSize: '14px' }}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(0); }}
                style={{ padding: '8px 12px', borderRadius: '6px', border: `1px solid ${themeColors.border}`, backgroundColor: themeColors.card, color: themeColors.text, fontSize: '14px' }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <select
                value={sortOrder}
                onChange={(e) => { setSortOrder(e.target.value); setPage(0); }}
                style={{ padding: '8px 12px', borderRadius: '6px', border: `1px solid ${themeColors.border}`, backgroundColor: themeColors.card, color: themeColors.text, fontSize: '14px' }}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </Box>
          </CardContent>
        </Card>

        {error && (
          <Box sx={{ padding: '16px', background: 'rgba(239,68,68,0.15)', borderRadius: '8px', marginBottom: '24px', color: '#EF4444' }}>
            {error}
          </Box>
        )}

        <TableContainer component={Paper} sx={{ background: themeColors.card, border: `1px solid ${themeColors.border}` }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
              <CircularProgress />
            </Box>
          ) : funds.length === 0 ? (
            <Box sx={{ padding: '40px', textAlign: 'center', color: themeColors.textMuted }}>
              <Typography>No funds found</Typography>
            </Box>
          ) : (
            <>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: `${themeColors.border}40` }}>
                    <TableCell sx={{ color: themeColors.text, fontWeight: 600 }}>Title</TableCell>
                    <TableCell sx={{ color: themeColors.text, fontWeight: 600 }}>Category</TableCell>
                    <TableCell sx={{ color: themeColors.text, fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ color: themeColors.text, fontWeight: 600, textAlign: 'right' }}>Amount</TableCell>
                    <TableCell sx={{ color: themeColors.text, fontWeight: 600 }}>Created</TableCell>
                    <TableCell sx={{ color: themeColors.text, fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {funds.map((fund) => (
                    <TableRow key={fund.id} sx={{ borderBottom: `1px solid ${themeColors.border}`, '&:hover': { background: `${themeColors.border}20` } }}>
                      <TableCell sx={{ color: themeColors.text, maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {fund.title || fund.name || '—'}
                      </TableCell>
                      <TableCell sx={{ color: themeColors.textMuted }}>
                        {fund.category || fund.category_name || '—'}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={fund.status} />
                      </TableCell>
                      <TableCell sx={{ color: themeColors.textMuted, textAlign: 'right' }}>
                        {formatCurrency(fund.amount || fund.total_amount)}
                      </TableCell>
                      <TableCell sx={{ color: themeColors.textMuted }}>
                        {formatDate(fund.created_at)}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: '8px' }}>
                          <Button
                            size="small"
                            startIcon={<Eye size={16} />}
                            onClick={() => navigate(`/dashboard/admin/funds/${fund.id}`)}
                            sx={{ textTransform: 'none', fontSize: '12px', color: '#61C5C3' }}
                          >
                            View
                          </Button>
                          <Button
                            size="small"
                            startIcon={<Edit size={16} />}
                            onClick={() => navigate(`/dashboard/admin/funds/${fund.id}?mode=edit`)}
                            sx={{ textTransform: 'none', fontSize: '12px', color: '#61C5C3' }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            startIcon={<Trash2 size={16} />}
                            onClick={() => { setSelectedFund(fund); setDeleteDialogOpen(true); }}
                            sx={{ textTransform: 'none', fontSize: '12px', color: '#EF4444' }}
                          >
                            Delete
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 20, 50]}
                component="div"
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                sx={{ color: themeColors.text }}
              />
            </>
          )}
        </TableContainer>

        <Dialog open={deleteDialogOpen} onClose={() => !deleting && setDeleteDialogOpen(false)}>
          <DialogTitle sx={{ color: '#EF4444', fontWeight: 700 }}>Delete Fund?</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{selectedFund?.title || selectedFund?.name}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button onClick={handleDelete} disabled={deleting} sx={{ color: '#EF4444', fontWeight: 600 }}>
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
}
