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
import { Plus, Eye, Edit, Globe, DollarSign, Truck, AlertCircle } from 'lucide-react';
import { useThemeColors } from '../../../utils/useThemeColors';

const ACCENT = "#61C5C3";
const PRIMARY = "#FF8C00";

const mockTradeRequests = [
  {
    id: "TR-001",
    title: "Coffee Export Initiative",
    description: "High-quality coffee beans from East Africa for European markets",
    type: "Export",
    requester: "Global Coffee Importers",
    email: "contact@globalcoffee.com",
    submittedDate: "2025-04-01",
    value: 150000,
    currency: "USD",
    volume: "500 metric tons",
    origin: "Kenya",
    destination: "Germany",
    status: "pending_review",
    priority: "high",
    category: "Agriculture",
  },
  {
    id: "TR-002",
    title: "Industrial Equipment Import",
    description: "Manufacturing machinery from Germany to West Africa",
    type: "Import",
    requester: "West Africa Manufacturing Corp",
    email: "procurement@wamc.com",
    submittedDate: "2025-04-02",
    value: 320000,
    currency: "USD",
    volume: "200 units",
    origin: "Germany",
    destination: "Nigeria",
    status: "under_review",
    priority: "medium",
    category: "Manufacturing",
  },
  {
    id: "TR-003",
    title: "Textile Export to Asia",
    description: "Cotton textiles for Asian markets",
    type: "Export",
    requester: "African Textile Co",
    email: "exports@africantextile.com",
    submittedDate: "2025-04-03",
    value: 85000,
    currency: "USD",
    volume: "10,000 units",
    origin: "Ethiopia",
    destination: "China",
    status: "approved",
    priority: "low",
    category: "Textiles",
  },
  {
    id: "TR-004",
    title: "Medical Equipment Import",
    description: "Healthcare equipment for regional hospitals",
    type: "Import",
    requester: "Healthcare Alliance",
    email: "procurement@healthalliance.org",
    submittedDate: "2025-04-04",
    value: 450000,
    currency: "USD",
    volume: "50 containers",
    origin: "USA",
    destination: "Ghana",
    status: "rejected",
    priority: "high",
    category: "Healthcare",
  },
];

function StatusChip({ status }) {
  const statusMap = {
    pending_review: { bg: "#fef9c3", text: "#854d0e", label: "Pending Review" },
    under_review: { bg: "#dbeafe", text: "#1d4ed8", label: "Under Review" },
    approved: { bg: "#dcfce7", text: "#15803d", label: "Approved" },
    rejected: { bg: "#fee2e2", text: "#991b1b", label: "Rejected" },
    completed: { bg: "#f3f4f6", text: "#374151", label: "Completed" },
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

function PriorityChip({ priority }) {
  const priorityMap = {
    high: { bg: "#fee2e2", text: "#991b1b", label: "High" },
    medium: { bg: "#fef9c3", text: "#854d0e", label: "Medium" },
    low: { bg: "#dcfce7", text: "#15803d", label: "Low" },
  };
  
  const config = priorityMap[priority] || {
    bg: "#f3f4f6",
    text: "#374151",
    label: priority,
  };

  return (
    <Chip
      label={config.label}
      size="small"
      sx={{
        height: 20,
        borderRadius: "4px",
        fontSize: "0.7rem",
        fontWeight: 600,
        backgroundColor: config.bg,
        color: config.text,
      }}
    />
  );
}

function TypeChip({ type }) {
  const typeMap = {
    export: { bg: "#dcfce7", text: "#15803d", label: "Export" },
    import: { bg: "#dbeafe", text: "#1d4ed8", label: "Import" },
  };
  
  const config = typeMap[type.toLowerCase()] || {
    bg: "#f3f4f6",
    text: "#374151",
    label: type,
  };

  return (
    <Chip
      label={config.label}
      size="small"
      sx={{
        height: 20,
        borderRadius: "4px",
        fontSize: "0.7rem",
        fontWeight: 600,
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

export default function AdminTradeRequestsPage({ role = 'admin' }) {
  const colors = useThemeColors();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    setTimeout(() => {
      setRequests(mockTradeRequests);
      setLoading(false);
    }, 800);
  }, []);

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requester.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || request.status === selectedStatus;
    const matchesType = selectedType === "all" || request.type === selectedType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalRequests = requests.length;
  const pendingRequests = requests.filter(r => r.status === 'pending_review').length;
  const totalValue = requests.reduce((sum, r) => sum + r.value, 0);
  const exportCount = requests.filter(r => r.type === 'Export').length;
  const importCount = requests.filter(r => r.type === 'Import').length;

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
      <Box sx={{ maxWidth: 1400, mx: "auto", py: 4, px: 2 }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: colors.text, mb: 0.5 }}>
              Trade Requests
            </Typography>
            <Typography sx={{ color: colors.textMuted, fontSize: "0.9rem" }}>
              Manage and review international trade submissions
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
            New Request
          </Button>
        </Box>

        {/* Stats Cards */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "1fr 1fr 1fr 1fr" }, gap: 2, mb: 4 }}>
          <StatCard icon={Globe} label="Total Requests" value={totalRequests} colors={colors} />
          <StatCard icon={DollarSign} label="Total Value" value={`$${(totalValue / 1000).toFixed(0)}K`} colors={colors} />
          <StatCard icon={AlertCircle} label="Pending Review" value={pendingRequests} colors={colors} />
          <StatCard icon={Truck} label="Export/Import" value={`${exportCount}/${importCount}`} colors={colors} />
        </Box>

        {/* Filters */}
        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
          <TextField
            placeholder="Search requests..."
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
            <MenuItem value="pending_review">Pending Review</MenuItem>
            <MenuItem value="under_review">Under Review</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </TextField>
          <TextField
            select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              minWidth: "140px",
              "& .MuiOutlinedInput-root": {
                backgroundColor: colors.bgPanel,
                color: colors.text,
                "& fieldset": { borderColor: colors.border },
              },
            }}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="Export">Export</MenuItem>
            <MenuItem value="Import">Import</MenuItem>
          </TextField>
        </Box>

        {/* Trade Requests Table */}
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
                  Request Details
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: colors.text, fontSize: "0.85rem" }}>
                  Requester
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: colors.text, fontSize: "0.85rem" }}>
                  Route
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: colors.text, fontSize: "0.85rem" }}>
                  Volume & Value
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: colors.text, fontSize: "0.85rem" }}>
                  Type
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
              {filteredRequests.map((request) => (
                <TableRow
                  key={request.id}
                  sx={{
                    "&:hover": { backgroundColor: `${colors.bgPanel}cc` },
                    borderBottom: `1px solid ${colors.border}`,
                  }}
                >
                  <TableCell sx={{ color: colors.text, py: 2 }}>
                    <Stack spacing={0.5}>
                      <Typography sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
                        {request.title}
                      </Typography>
                      <Typography sx={{ fontSize: "0.8rem", color: colors.textMuted }}>
                        {request.description}
                      </Typography>
                      <Typography sx={{ fontSize: "0.75rem", color: colors.textMuted }}>
                        {request.submittedDate} • {request.category}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ color: colors.text }}>
                    <Stack spacing={0.2}>
                      <Typography sx={{ fontSize: "0.9rem", fontWeight: 600 }}>
                        {request.requester}
                      </Typography>
                      <Typography sx={{ fontSize: "0.8rem", color: colors.textMuted }}>
                        {request.email}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ color: colors.text }}>
                    <Stack spacing={0.3}>
                      <Typography sx={{ fontSize: "0.85rem" }}>
                        <strong>From:</strong> {request.origin}
                      </Typography>
                      <Typography sx={{ fontSize: "0.85rem" }}>
                        <strong>To:</strong> {request.destination}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="right" sx={{ color: colors.text }}>
                    <Stack spacing={0.3}>
                      <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                        {request.volume}
                      </Typography>
                      <Typography sx={{ fontSize: "0.85rem", color: colors.textMuted }}>
                        ${request.value.toLocaleString()}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    <Stack spacing={0.5}>
                      <TypeChip type={request.type} />
                      <PriorityChip priority={request.priority} />
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    <StatusChip status={request.status} />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button
                        size="small"
                        startIcon={<Eye size={14} />}
                        variant="outlined"
                        onClick={() => navigate(`/dashboard/admin/trades/${request.id}`)}
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
                        onClick={() => navigate(`/dashboard/admin/trades/${request.id}/edit`)}
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
