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
  Chip,
  Box,
  Typography,
  CircularProgress,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Search, Plus, Edit, Trash2, Eye, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useThemeColors } from '../../../utils/useThemeColors';
import { datasetService, categoryService } from '../../../utils/apiService';

const SORT_OPTIONS = [
  { value: 'created_at', label: 'Newest' },
  { value: 'updated_at', label: 'Recently Updated' },
  { value: 'title', label: 'Title A-Z' },
  { value: 'total_views', label: 'Most Viewed' },
  { value: 'total_downloads', label: 'Most Downloaded' },
];

const STATUS_COLORS = {
  approved: { bg: 'rgba(16,185,129,0.15)', text: '#10B981', icon: CheckCircle },
  pending: { bg: 'rgba(245,158,11,0.15)', text: '#F59E0B', icon: Clock },
  rejected: { bg: 'rgba(239,68,68,0.15)', text: '#EF4444', icon: AlertCircle },
};

function StatusBadge({ status }) {
  const config = STATUS_COLORS[status?.toLowerCase()] || STATUS_COLORS.pending;
  const Icon = config.icon;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: 600,
        backgroundColor: config.bg,
        color: config.text,
        border: `1px solid ${config.text}33`,
      }}
    >
      <Icon size={14} />
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
    </span>
  );
}

export default function AdminDatasetsManagementPage() {
  const navigate = useNavigate();
  const themeColors = useThemeColors();

  const [datasets, setDatasets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  const [selectedDataset, setSelectedDataset] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fetch datasets
  useEffect(() => {
    fetchDatasets();
  }, [page, rowsPerPage, searchTerm, statusFilter, sortBy, sortOrder]);

  // Fetch categories
  useEffect(() => {
    categoryService
      .list()
      .then((res) => {
        const data = res?.data?.data || res?.data || [];
        setCategories(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error('Failed to load categories:', err));
  }, []);

  const fetchDatasets = async () => {
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

      const response = await datasetService.list(params);
      const data = response?.data;

      if (data?.items) {
        setDatasets(data.items);
        setTotalCount(data.total || data.items.length);
      } else if (Array.isArray(data)) {
        setDatasets(data);
        setTotalCount(data.length);
      } else {
        setDatasets([]);
        setTotalCount(0);
      }
    } catch (err) {
      setError('Failed to load datasets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPage(0);
  };

  const handleDelete = async () => {
    if (!selectedDataset) return;
    setDeleting(true);
    try {
      await datasetService.delete(selectedDataset.id);
      setDatasets(datasets.filter((d) => d.id !== selectedDataset.id));
      setDeleteDialogOpen(false);
      setSelectedDataset(null);
    } catch (err) {
      setError('Failed to delete dataset');
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const getCategoryName = (dataset) => {
    if (dataset?.category?.name) return dataset.category.name;
    if (typeof dataset?.category === 'string') return dataset.category;
    if (dataset?.category_name) return dataset.category_name;
    const cat = categories.find((c) => c.id === dataset?.category_id);
    return cat?.name || 'Uncategorized';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <DashboardLayout>
      <Box sx={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: themeColors.text }}>
            Datasets Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={() => navigate('/dashboard/admin/datasets/new')}
            sx={{
              background: '#61C5C3',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { background: '#4fb3b1' },
            }}
          >
            Create Dataset
          </Button>
        </Box>

        {/* Filters Card */}
        <Card sx={{ marginBottom: '24px', background: themeColors.card, border: `1px solid ${themeColors.border}` }}>
          <CardContent sx={{ padding: '20px' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr 1fr' }, gap: '16px' }}>
              <TextField
                placeholder="Search datasets..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: <Search size={18} style={{ marginRight: '8px', color: themeColors.textMuted }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: themeColors.text,
                    borderColor: themeColors.border,
                  },
                }}
              />

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(0);
                }}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: `1px solid ${themeColors.border}`,
                  backgroundColor: themeColors.card,
                  color: themeColors.text,
                  fontSize: '14px',
                }}
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(0);
                }}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: `1px solid ${themeColors.border}`,
                  backgroundColor: themeColors.card,
                  color: themeColors.text,
                  fontSize: '14px',
                }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value);
                  setPage(0);
                }}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: `1px solid ${themeColors.border}`,
                  backgroundColor: themeColors.card,
                  color: themeColors.text,
                  fontSize: '14px',
                }}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </Box>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Box sx={{ padding: '16px', background: 'rgba(239,68,68,0.15)', borderRadius: '8px', marginBottom: '24px', color: '#EF4444' }}>
            {error}
          </Box>
        )}

        {/* Table */}
        <TableContainer component={Paper} sx={{ background: themeColors.card, border: `1px solid ${themeColors.border}` }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
              <CircularProgress />
            </Box>
          ) : datasets.length === 0 ? (
            <Box sx={{ padding: '40px', textAlign: 'center', color: themeColors.textMuted }}>
              <Typography>No datasets found</Typography>
            </Box>
          ) : (
            <>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: `${themeColors.border}40` }}>
                    <TableCell sx={{ color: themeColors.text, fontWeight: 600 }}>Title</TableCell>
                    <TableCell sx={{ color: themeColors.text, fontWeight: 600 }}>Category</TableCell>
                    <TableCell sx={{ color: themeColors.text, fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ color: themeColors.text, fontWeight: 600 }}>Created</TableCell>
                    <TableCell sx={{ color: themeColors.text, fontWeight: 600 }}>Views</TableCell>
                    <TableCell sx={{ color: themeColors.text, fontWeight: 600 }}>Downloads</TableCell>
                    <TableCell sx={{ color: themeColors.text, fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {datasets.map((dataset) => (
                    <TableRow
                      key={dataset.id}
                      sx={{
                        borderBottom: `1px solid ${themeColors.border}`,
                        '&:hover': { background: `${themeColors.border}20` },
                      }}
                    >
                      <TableCell sx={{ color: themeColors.text, maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {dataset.title || dataset.name || '—'}
                      </TableCell>
                      <TableCell sx={{ color: themeColors.textMuted }}>
                        {getCategoryName(dataset)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={dataset.status || dataset.approval_status || 'pending'} />
                      </TableCell>
                      <TableCell sx={{ color: themeColors.textMuted }}>
                        {formatDate(dataset.created_at)}
                      </TableCell>
                      <TableCell sx={{ color: themeColors.textMuted }}>
                        {dataset.total_views || 0}
                      </TableCell>
                      <TableCell sx={{ color: themeColors.textMuted }}>
                        {dataset.total_downloads || 0}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: '8px' }}>
                          <Button
                            size="small"
                            startIcon={<Eye size={16} />}
                            onClick={() => navigate(`/dashboard/admin/datasets/${dataset.id}`)}
                            sx={{ textTransform: 'none', fontSize: '12px', color: '#61C5C3' }}
                          >
                            View
                          </Button>
                          <Button
                            size="small"
                            startIcon={<Edit size={16} />}
                            onClick={() => navigate(`/dashboard/admin/datasets/${dataset.id}?mode=edit`)}
                            sx={{ textTransform: 'none', fontSize: '12px', color: '#61C5C3' }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            startIcon={<Trash2 size={16} />}
                            onClick={() => {
                              setSelectedDataset(dataset);
                              setDeleteDialogOpen(true);
                            }}
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
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                sx={{ color: themeColors.text }}
              />
            </>
          )}
        </TableContainer>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => !deleting && setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ color: '#EF4444', fontWeight: 700 }}>Delete Dataset?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedDataset?.title || selectedDataset?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={deleting}
            sx={{ color: '#EF4444', fontWeight: 600 }}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}
