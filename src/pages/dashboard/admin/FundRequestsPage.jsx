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
import { Plus, Eye, Edit, DollarSign, TrendingUp } from 'lucide-react';
import { useThemeColors } from '../../../utils/useThemeColors';

const ACCENT = "#61C5C3";
const PRIMARY = "#FF8C00";

const mockFundRequests = [
  {
    id: "FR-001",
    title: "Agricultural Development Fund",
    description: "Funding for small-scale agricultural projects in East Africa",
    amount: 250000,
    currency: "USD",
    status: "pending",
    applicant: "East Africa Farmers Cooperative",
    submittedDate: "2025-01-15",
    category: "Agriculture",
    region: "East Africa",
  },
  {
    id: "FR-002", 
    title: "Technology Infrastructure Grant",
    description: "Infrastructure development for technology startups",
    amount: 500000,
    currency: "USD",
    status: "approved",
    applicant: "TechHub Africa",
    submittedDate: "2025-01-10",
    category: "Technology",
    region: "West Africa",
  },
];

function StatusChip({ status }) {
  const statusMap = {
    pending: { bg: "#fef9c3", text: "#854d0e", label: "Pending" },
    approved: { bg: "#dcfce7", text: "#15803d", label: "Approved" },
    rejected: { bg: "#fee2e2", text: "#991b1b", label: "Rejected" },
    under_review: { bg: "#dbeafe", text: "#1d4ed8", label: "Under Review" },
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

export default function AdminFundRequestsPage({ role = 'admin' }) {
  const colors = useThemeColors();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    setTimeout(() => {
      setRequests(mockFundRequests);
      setLoading(false);
    }, 800);
  }, []);

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.applicant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || request.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalRequested = requests.reduce((sum, r) => sum + r.amount, 0);
  const approvedCount = requests.filter(r => r.status === 'approved').length;

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
              Fund Requests
            </Typography>
            <Typography sx={{ color: colors.textMuted, fontSize: "0.9rem" }}>
              Manage and review funding applications
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
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "1fr 1fr" }, gap: 2, mb: 4 }}>
          <StatCard icon={DollarSign} label="Total Requested" value={`$${(totalRequested / 1000).toFixed(0)}K`} colors={colors} />
          <StatCard icon={TrendingUp} label="Total Requests" value={requests.length} colors={colors} />
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
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="under_review">Under Review</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </TextField>
        </Box>

        {/* Fund Requests Table */}
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
                  Applicant
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: colors.text, fontSize: "0.85rem" }}>
                  Amount
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
                        {request.applicant}
                      </Typography>
                      <Typography sx={{ fontSize: "0.8rem", color: colors.textMuted }}>
                        {request.region}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="right" sx={{ color: colors.text, fontWeight: 600 }}>
                    <Stack spacing={0.2}>
                      <Typography sx={{ fontSize: "0.95rem" }}>
                        ${request.amount.toLocaleString()}
                      </Typography>
                      <Typography sx={{ fontSize: "0.75rem", color: colors.textMuted }}>
                        {request.currency}
                      </Typography>
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
                        onClick={() => navigate(`/dashboard/admin/funds/${request.id}`)}
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
                        onClick={() => navigate(`/dashboard/admin/funds/${request.id}/edit`)}
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
