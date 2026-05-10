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
import { Plus, Eye, Download, FileText, TrendingUp, Activity, BarChart3 } from 'lucide-react';
import { useThemeColors } from '../../../utils/useThemeColors';

const ACCENT = "#61C5C3";
const PRIMARY = "#FF8C00";

const mockReports = [
  {
    id: "RPT-001",
    title: "Q1 2025 Trade Analysis Report",
    description: "Comprehensive analysis of trade activities for Q1 2025",
    type: "Trade Analysis",
    generatedDate: "2025-04-01",
    generatedBy: "System",
    status: "completed",
    format: "PDF",
    size: "2.4 MB",
    downloads: 45,
    category: "Quarterly",
  },
  {
    id: "RPT-002",
    title: "Monthly Fund Request Summary",
    description: "Summary of all fund requests for March 2025",
    type: "Financial Summary",
    generatedDate: "2025-04-02",
    generatedBy: "Sarah Johnson",
    status: "completed",
    format: "Excel",
    size: "1.2 MB",
    downloads: 23,
    category: "Monthly",
  },
  {
    id: "RPT-003",
    title: "Project Progress Dashboard",
    description: "Real-time project progress and performance metrics",
    type: "Performance Report",
    generatedDate: "2025-04-03",
    generatedBy: "System",
    status: "processing",
    format: "Interactive",
    size: "N/A",
    downloads: 0,
    category: "Dashboard",
  },
  {
    id: "RPT-004",
    title: "Annual Compliance Report 2024",
    description: "Year-end compliance and regulatory requirements report",
    type: "Compliance",
    generatedDate: "2025-01-15",
    generatedBy: "Legal Team",
    status: "completed",
    format: "PDF",
    size: "5.8 MB",
    downloads: 67,
    category: "Annual",
  },
];

function StatusChip({ status }) {
  const statusMap = {
    completed: { bg: "#dcfce7", text: "#15803d", label: "Completed" },
    processing: { bg: "#fef9c3", text: "#854d0e", label: "Processing" },
    scheduled: { bg: "#dbeafe", text: "#1d4ed8", label: "Scheduled" },
    failed: { bg: "#fee2e2", text: "#991b1b", label: "Failed" },
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

function FormatChip({ format }) {
  const formatMap = {
    "PDF": { bg: "#fee2e2", text: "#991b1b" },
    "Excel": { bg: "#dcfce7", text: "#15803d" },
    "Interactive": { bg: "#dbeafe", text: "#1d4ed8" },
    "CSV": { bg: "#f3f4f6", text: "#374151" },
  };
  
  const config = formatMap[format] || {
    bg: "#f3f4f6",
    text: "#374151",
  };

  return (
    <Chip
      label={format}
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

export default function AdminReportsPage({ role = 'admin' }) {
  const colors = useThemeColors();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    setTimeout(() => {
      setReports(mockReports);
      setLoading(false);
    }, 800);
  }, []);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.generatedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || report.type === selectedType;
    const matchesCategory = selectedCategory === "all" || report.category === selectedCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  const totalReports = reports.length;
  const completedReports = reports.filter(r => r.status === 'completed').length;
  const totalDownloads = reports.reduce((sum, r) => sum + r.downloads, 0);
  const processingReports = reports.filter(r => r.status === 'processing').length;

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
              Reports
            </Typography>
            <Typography sx={{ color: colors.textMuted, fontSize: "0.9rem" }}>
              Generate and manage business reports
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              sx={{
                textTransform: 'none',
                borderColor: ACCENT,
                color: ACCENT,
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: `${ACCENT}15`,
                  borderColor: ACCENT,
                },
              }}
            >
              Schedule
            </Button>
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
              Generate
            </Button>
          </Stack>
        </Box>

        {/* Stats Cards */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "1fr 1fr 1fr 1fr" }, gap: 2, mb: 4 }}>
          <StatCard icon={FileText} label="Total Reports" value={totalReports} colors={colors} />
          <StatCard icon={TrendingUp} label="Total Downloads" value={totalDownloads} colors={colors} />
          <StatCard icon={Activity} label="Processing" value={processingReports} colors={colors} />
          <StatCard icon={BarChart3} label="Completed" value={completedReports} colors={colors} />
        </Box>

        {/* Filters */}
        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
          <TextField
            placeholder="Search reports..."
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
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              minWidth: "180px",
              "& .MuiOutlinedInput-root": {
                backgroundColor: colors.bgPanel,
                color: colors.text,
                "& fieldset": { borderColor: colors.border },
              },
            }}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="Trade Analysis">Trade Analysis</MenuItem>
            <MenuItem value="Financial Summary">Financial Summary</MenuItem>
            <MenuItem value="Performance Report">Performance Report</MenuItem>
            <MenuItem value="Compliance">Compliance</MenuItem>
          </TextField>
          <TextField
            select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
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
            <MenuItem value="all">All Categories</MenuItem>
            <MenuItem value="Monthly">Monthly</MenuItem>
            <MenuItem value="Quarterly">Quarterly</MenuItem>
            <MenuItem value="Annual">Annual</MenuItem>
            <MenuItem value="Dashboard">Dashboard</MenuItem>
          </TextField>
        </Box>

        {/* Reports Table */}
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
                  Report Details
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: colors.text, fontSize: "0.85rem" }}>
                  Type
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: colors.text, fontSize: "0.85rem" }}>
                  Generated
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: colors.text, fontSize: "0.85rem" }}>
                  Format
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
              {filteredReports.map((report) => (
                <TableRow
                  key={report.id}
                  sx={{
                    "&:hover": { backgroundColor: `${colors.bgPanel}cc` },
                    borderBottom: `1px solid ${colors.border}`,
                  }}
                >
                  <TableCell sx={{ color: colors.text, py: 2 }}>
                    <Stack spacing={0.5}>
                      <Typography sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
                        {report.title}
                      </Typography>
                      <Typography sx={{ fontSize: "0.8rem", color: colors.textMuted }}>
                        {report.description}
                      </Typography>
                      <Typography sx={{ fontSize: "0.75rem", color: colors.textMuted }}>
                        By: {report.generatedBy} • Size: {report.size} • Downloads: {report.downloads}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ color: colors.text }}>
                    <Stack spacing={0.2}>
                      <Typography sx={{ fontSize: "0.9rem", fontWeight: 600 }}>
                        {report.type}
                      </Typography>
                      <Typography sx={{ fontSize: "0.8rem", color: colors.textMuted }}>
                        {report.category}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ color: colors.text, fontSize: "0.9rem" }}>
                    {report.generatedDate}
                  </TableCell>
                  <TableCell align="center">
                    <FormatChip format={report.format} />
                  </TableCell>
                  <TableCell align="center">
                    <StatusChip status={report.status} />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button
                        size="small"
                        startIcon={<Eye size={14} />}
                        variant="outlined"
                        onClick={() => navigate(`/dashboard/admin/reports/${report.id}`)}
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
                        startIcon={<Download size={14} />}
                        variant="outlined"
                        disabled={report.status !== 'completed'}
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
                        Download
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
