import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper,
  Typography,
  Stack,
  Card,
  CardContent,
  TextField,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import DashboardLayout from '../components/DashboardLayout';
import { Plus, Eye, Edit, Archive, Trash2, Briefcase, TrendingUp, Calendar, Users } from 'lucide-react';
import { useThemeColors } from '../../../utils/useThemeColors';

const ACCENT = "#61C5C3";
const PRIMARY = "#FF8C00";

const mockProjects = [
  {
    id: "PRJ-001",
    title: "East Africa Agricultural Initiative",
    description: "Large-scale agricultural development project focusing on sustainable farming practices",
    status: "active",
    budget: 1500000,
    currency: "USD",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    manager: "John Smith",
    team: 12,
    location: "Kenya",
    progress: 65,
    category: "Agriculture",
  },
  {
    id: "PRJ-002",
    title: "West Africa Technology Hub",
    description: "Technology infrastructure development for startup ecosystem",
    status: "planning",
    budget: 850000,
    currency: "USD",
    startDate: "2025-03-01",
    endDate: "2025-11-30",
    manager: "Sarah Johnson",
    team: 8,
    location: "Nigeria",
    progress: 15,
    category: "Technology",
  },
  {
    id: "PRJ-003",
    title: "Healthcare Access Program",
    description: "Improving healthcare access in rural communities",
    status: "completed",
    budget: 650000,
    currency: "USD",
    startDate: "2024-06-01",
    endDate: "2024-12-31",
    manager: "Dr. Michael Chen",
    team: 15,
    location: "Ghana",
    progress: 100,
    category: "Healthcare",
  },
];

function StatusChip({ status }) {
  const statusMap = {
    active: { bg: "#dcfce7", text: "#15803d", label: "Active" },
    planning: { bg: "#dbeafe", text: "#1d4ed8", label: "Planning" },
    completed: { bg: "#f3f4f6", text: "#374151", label: "Completed" },
    on_hold: { bg: "#fef9c3", text: "#854d0e", label: "On Hold" },
    cancelled: { bg: "#fee2e2", text: "#991b1b", label: "Cancelled" },
  };
  
  const config = statusMap[status] || {
    bg: "#f3f4f6",
    text: "#374151",
    label: status,
  };

  return (
    <Chip
      label={config.label}
      size="small"
      sx={{
        height: 24,
        borderRadius: "6px",
        fontSize: "0.75rem",
        fontWeight: 700,
        backgroundColor: config.bg,
        color: config.text,
      }}
    />
  );
}

function StatCard({ icon: Icon, label, value, colors }) {
  return (
    <Card
      sx={{
        backgroundColor: colors.bgPanel,
        border: `1px solid ${colors.border}`,
        boxShadow: 'none',
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '8px',
            backgroundColor: `${ACCENT}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: ACCENT,
          }}
        >
          <Icon size={24} />
        </Box>
        <Box>
          <Typography sx={{ fontSize: '24px', fontWeight: 700, color: colors.text }}>
            {value}
          </Typography>
          <Typography sx={{ fontSize: '12px', color: colors.textMuted }}>
            {label}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function AdminProjectsPage({ role = 'admin' }) {
  const colors = useThemeColors();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    setTimeout(() => {
      setProjects(mockProjects);
      setLoading(false);
    }, 800);
  }, []);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || project.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const avgProgress = projects.length > 0 
    ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
    : 0;

  if (loading) {
    return (
      <DashboardLayout role={role}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role={role}>
      <Box sx={{ maxWidth: 1200, mx: "auto", py: 4, px: 2 }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: colors.text, mb: 0.5 }}>
              Projects
            </Typography>
            <Typography sx={{ color: colors.textMuted, fontSize: "0.9rem" }}>
              Manage and monitor all project submissions
            </Typography>
          </Box>
          <Button
            startIcon={<Plus size={18} />}
            variant="contained"
            sx={{
              backgroundColor: ACCENT,
              color: "white",
              fontWeight: 700,
              textTransform: "none",
              fontSize: "0.9rem",
              "&:hover": { backgroundColor: `${ACCENT}dd` },
            }}
          >
            New Project
          </Button>
        </Box>

        {/* Filters */}
        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
          <TextField
            placeholder="Search projects, manager, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            size="small"
            InputProps={{
              sx: {
                fontSize: "0.9rem",
                backgroundColor: colors.bgPanel,
                color: colors.text,
                "& fieldset": { borderColor: colors.border },
              },
            }}
            sx={{ flex: 1, minWidth: "280px" }}
          />
          <TextField
            select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              minWidth: "160px",
              "& .MuiOutlinedInput-root": {
                backgroundColor: colors.bgPanel,
                color: colors.text,
                "& fieldset": { borderColor: colors.border },
              },
            }}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="planning">Planning</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="on_hold">On Hold</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </TextField>
        </Box>

        {/* Stats Cards */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "1fr 1fr 1fr 1fr" }, gap: 2, mb: 4 }}>
          <StatCard icon={Briefcase} label="Total Projects" value={projects.length} colors={colors} />
          <StatCard icon={TrendingUp} label="Total Budget" value={`$${(totalBudget / 1000000).toFixed(1)}M`} colors={colors} />
          <StatCard icon={Users} label="Active Projects" value={activeProjects} colors={colors} />
          <StatCard icon={Calendar} label="Avg. Progress" value={`${avgProgress}%`} colors={colors} />
        </Box>

        {/* Projects Table */}
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: colors.bgPanel,
            border: `1px solid ${colors.border}`,
            boxShadow: 'none',
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: `${colors.bgPanel}` }}>
                <TableCell sx={{ fontWeight: 700, color: colors.text, fontSize: "0.85rem" }}>
                  Project
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: colors.text, fontSize: "0.85rem" }}>
                  Manager
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: colors.text, fontSize: "0.85rem" }}>
                  Budget
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: colors.text, fontSize: "0.85rem" }}>
                  Progress
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: colors.text, fontSize: "0.85rem" }}>
                  Status
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: colors.text, fontSize: "0.85rem" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProjects.map((project, idx) => (
                <TableRow
                  key={project.id}
                  sx={{
                    "&:hover": { backgroundColor: `${colors.bgPanel}cc` },
                    borderBottom: `1px solid ${colors.border}`,
                  }}
                >
                  <TableCell sx={{ color: colors.text, py: 2 }}>
                    <Stack spacing={0.5}>
                      <Typography sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
                        {project.title}
                      </Typography>
                      <Typography sx={{ fontSize: "0.8rem", color: colors.textMuted }}>
                        {project.location} • {project.category}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ color: colors.text }}>
                    <Typography sx={{ fontSize: "0.9rem" }}>
                      {project.manager}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ color: colors.text, fontWeight: 600 }}>
                    ${project.budget.toLocaleString()}
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ fontSize: "0.85rem", color: colors.text, fontWeight: 600 }}>
                      {project.progress}%
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <StatusChip status={project.status} />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button
                        size="small"
                        startIcon={<Eye size={14} />}
                        variant="outlined"
                        onClick={() => navigate(`/dashboard/admin/projects/${project.id}`)}
                        sx={{
                          textTransform: 'none',
                          borderColor: colors.border,
                          color: colors.text,
                          fontSize: "0.8rem",
                          "&:hover": {
                            backgroundColor: `${ACCENT}15`,
                            borderColor: ACCENT,
                            color: ACCENT,
                          },
                        }}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        startIcon={<Edit size={14} />}
                        variant="outlined"
                        onClick={() => navigate(`/dashboard/admin/projects/${project.id}/edit`)}
                        sx={{
                          textTransform: 'none',
                          borderColor: colors.border,
                          color: colors.text,
                          fontSize: "0.8rem",
                          "&:hover": {
                            backgroundColor: `${PRIMARY}15`,
                            borderColor: PRIMARY,
                            color: PRIMARY,
                          },
                        }}
                      >
                        Edit
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </DashboardLayout>
  );
}
