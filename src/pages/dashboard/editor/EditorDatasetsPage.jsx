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
  Tabs,
  Tab,
  Stack,
} from '@mui/material';
import { Search, Plus, Edit, Trash2, Eye, CheckCircle, Clock, AlertCircle, ArrowLeft } from 'lucide-react';
import { useThemeColors } from '../../../utils/useThemeColors';
import { editorDatasetService, datasetService } from '../../../utils/apiService';

const SORT_OPTIONS = [
  { value: 'created_at', label: 'Newest' },
  { value: 'updated_at', label: 'Recently Updated' },
  { value: 'title', label: 'Title A-Z' },
];

const STATUS_COLORS = {
  pending: { bg: 'rgba(245,158,11,0.15)', text: '#F59E0B', icon: Clock, label: 'Pending' },
  approved: { bg: 'rgba(16,185,129,0.15)', text: '#10B981', icon: CheckCircle, label: 'Approved' },
  rejected: { bg: 'rgba(239,68,68,0.15)', text: '#EF4444', icon: AlertCircle, label: 'Rejected' },
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
      {config.label}
    </span>
  );
}

export default function EditorDatasetsPage() {
  const navigate = useNavigate();
  const themeColors = useThemeColors();

  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewType, setViewType] = useState('queue'); // 'queue' or 'assigned'

  const [selectedDataset, setSelectedDataset] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchDatasets();
  }, [page, rowsPerPage, searchTerm, sortBy, sortOrder, viewType]);

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

      let response;
      if (viewType === 'queue') {
        response = await editorDatasetService.queue(params);
      } else {
        response = await editorDatasetService.assigned(params);
      }

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

  const handleViewDetail = (datasetId) => {
    navigate(`/dashboard/editor/datasets/${datasetId}`);
  };

  const handleDelete = async () => {
    if (!selectedDataset) return;
    setDeleting(true);
    try {
      await datasetService.delete(selectedDataset.id);
      setDeleteDialogOpen(false);
      fetchDatasets();
    } catch (err) {
      setError('Failed to delete dataset');
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <DashboardLayout role="editor">
      <Box sx={{ maxWidth: 1200, mx: 'auto', py: 3, px: 2 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: themeColors.text }}>
              Datasets for Review
            </Typography>
          </Box>

          {/* Tabs for Queue/Assigned */}
          <Tabs
            value={viewType}
            onChange={(e, val) => {
              setViewType(val);
              setPage(0);
            }}
            sx={{ borderBottom: `1px solid ${themeColors.border}`, mb: 3 }}
          >
            <Tab label="Review Queue" value="queue" />
            <Tab label="Assigned to Me" value="assigned" />
          </Tabs>

          {/* Search & Sort */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <TextField
              placeholder="Search datasets..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              size="small"
              sx={{ flex: 1, '& .MuiOutlinedInput-root': { height: 40 } }}
              InputProps={{
                startAdornment: <Search size={18} style={{ marginRight: 8 }} />,
              }}
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '8px 12px',
                border: `1px solid ${themeColors.border}`,
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: themeColors.background,
                color: themeColors.text,
              }}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Stack>
        </Box>

        {/* Error Message */}
        {error && (
          <Paper sx={{ p: 2, mb: 3, backgroundColor: 'rgba(239,68,68,0.1)', borderLeft: '4px solid #EF4444' }}>
            <Typography sx={{ color: '#991b1b', fontSize: '14px' }}>{error}</Typography>
          </Paper>
        )}

        {/* Table */}
        <Card sx={{ boxShadow: 'none', border: `1px solid ${themeColors.border}` }}>
          <CardContent sx={{ p: 0 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : datasets.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography sx={{ color: themeColors.textSecondary }}>
                  No datasets {viewType === 'queue' ? 'in queue' : 'assigned to you'}
                </Typography>
              </Box>
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: themeColors.surface }}>
                        <TableCell sx={{ fontWeight: 700, fontSize: '12px' }}>Title</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '12px' }}>Category</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '12px' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '12px' }}>Created</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '12px', textAlign: 'right' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {datasets.map((dataset) => (
                        <TableRow key={dataset.id} hover>
                          <TableCell sx={{ fontSize: '14px', fontWeight: 500 }}>{dataset.title}</TableCell>
                          <TableCell sx={{ fontSize: '13px', color: themeColors.textSecondary }}>
                            {dataset.category_name || dataset.category?.name || '-'}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={dataset.status || dataset.approval_status} />
                          </TableCell>
                          <TableCell sx={{ fontSize: '13px', color: themeColors.textSecondary }}>
                            {dataset.created_at ? new Date(dataset.created_at).toLocaleDateString() : '-'}
                          </TableCell>
                          <TableCell sx={{ textAlign: 'right' }}>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleViewDetail(dataset.id)}
                              sx={{ mr: 1, textTransform: 'none' }}
                            >
                              <Eye size={16} style={{ marginRight: 4 }} />
                              Review
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[10, 20, 50]}
                  component="div"
                  count={totalCount}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                />
              </>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Dataset</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this dataset? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}
