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
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useThemeColors } from '../../../utils/useThemeColors';
import { projectService } from '../../../utils/apiService';

const SORT_OPTIONS = [
  { value: 'created_at', label: 'Newest' },
  { value: 'updated_at', label: 'Recently Updated' },
  { value: 'title', label: 'Title A-Z' },
];

const STATUS_COLORS = {
  planning: { bg: 'rgba(245,158,11,0.15)', text: '#F59E0B' },
  in_progress: { bg: 'rgba(59,130,246,0.15)', text: '#3B82F6' },
  completed: { bg: 'rgba(16,185,129,0.15)', text: '#10B981' },
  on_hold: { bg: 'rgba(107,114,128,0.15)', text: '#6B7280' },
  cancelled: { bg: 'rgba(239,68,68,0.15)', text: '#EF4444' },
  pending: { bg: 'rgba(245,158,11,0.15)', text: '#F59E0B' },
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
      {status ? status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ') : 'Unknown'}
    </span>
  );
}

export default function AdminProjectsManagementPage() {
  const navigate = useNavigate();
  const themeColors = useThemeColors();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [page, rowsPerPage, searchTerm, statusFilter, sortBy, sortOrder]);

  const fetchProjects = async () => {
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

      const response = await projectService.list(params);
      const data = response?.data;

      if (data?.items) {
        setProjects(data.items);
        setTotalCount(data.total || data.items.length);
      } else if (Array.isArray(data)) {
        setProjects(data);
        setTotalCount(data.length);
      } else {
        setProjects([]);
        setTotalCount(0);
      }
    } catch (err) {
      setError('Failed to load projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProject) return;
    setDeleting(true);
    try {
      await projectService.delete(selectedProject.id);
      setProjects(projects.filter((p) => p.id !== selectedProject.id));
      setDeleteDialogOpen(false);
      setSelectedProject(null);
    } catch (err) {
      setError('Failed to delete project');
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <DashboardLayout>
      <Box sx={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: themeColors.text }}>
            Projects Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={() => navigate('/dashboard/admin/projects/new')}
            sx={{ background: '#61C5C3', color: '#fff', textTransform: 'none', fontWeight: 600, '&:hover': { background: '#4fb3b1' } }}
          >
            Create Project
          </Button>
        </Box>

        <Card sx={{ marginBottom: '24px', background: themeColors.card, border: `1px solid ${themeColors.border}` }}>
          <CardContent sx={{ padding: '20px' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr 1fr' }, gap: '16px' }}>
              <TextField
                placeholder="Search projects..."
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
                <option value="planning">Planning</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
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
          ) : projects.length === 0 ? (
            <Box sx={{ padding: '40px', textAlign: 'center', color: themeColors.textMuted }}>
              <Typography>No projects found</Typography>
            </Box>
          ) : (
            <>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: `${themeColors.border}40` }}>
                    <TableCell sx={{ color: themeColors.text, fontWeight: 600 }}>Title</TableCell>
                    <TableCell sx={{ color: themeColors.text, fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ color: themeColors.text, fontWeight: 600 }}>Category</TableCell>
                    <TableCell sx={{ color: themeColors.text, fontWeight: 600 }}>Priority</TableCell>
                    <TableCell sx={{ color: themeColors.text, fontWeight: 600 }}>Created</TableCell>
                    <TableCell sx={{ color: themeColors.text, fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id} sx={{ borderBottom: `1px solid ${themeColors.border}`, '&:hover': { background: `${themeColors.border}20` } }}>
                      <TableCell sx={{ color: themeColors.text, maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {project.title || project.name || '—'}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={project.status} />
                      </TableCell>
                      <TableCell sx={{ color: themeColors.textMuted }}>
                        {project.category || project.category_name || '—'}
                      </TableCell>
                      <TableCell sx={{ color: themeColors.textMuted }}>
                        {project.priority ? project.priority.charAt(0).toUpperCase() + project.priority.slice(1) : '—'}
                      </TableCell>
                      <TableCell sx={{ color: themeColors.textMuted }}>
                        {formatDate(project.created_at)}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: '8px' }}>
                          <Button
                            size="small"
                            startIcon={<Eye size={16} />}
                            onClick={() => navigate(`/dashboard/admin/projects/${project.id}`)}
                            sx={{ textTransform: 'none', fontSize: '12px', color: '#61C5C3' }}
                          >
                            View
                          </Button>
                          <Button
                            size="small"
                            startIcon={<Edit size={16} />}
                            onClick={() => navigate(`/dashboard/admin/projects/${project.id}?mode=edit`)}
                            sx={{ textTransform: 'none', fontSize: '12px', color: '#61C5C3' }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            startIcon={<Trash2 size={16} />}
                            onClick={() => { setSelectedProject(project); setDeleteDialogOpen(true); }}
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
          <DialogTitle sx={{ color: '#EF4444', fontWeight: 700 }}>Delete Project?</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{selectedProject?.title || selectedProject?.name}"? This action cannot be undone.
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
