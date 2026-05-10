import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  Grid,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  ArrowLeft,
  DollarSign,
  Calendar,
  FileText,
  Users,
  Edit,
  Save,
  BarChart3,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useThemeColors } from "../../../utils/useThemeColors";

const ACCENT = "#61C5C3";
const PRIMARY = "#FF8C00";

const mockReports = {
  "RPT-001": {
    id: "RPT-001",
    title: "Q1 2025 Trade Analysis Report",
    description: "Comprehensive analysis of trade activities for Q1 2025",
    type: "Trade Analysis",
    requester: "Trade Department",
    email: "reports@trade.gov",
    submittedDate: "2025-04-01",
    status: "completed",
    category: "Quarterly",
    scope: "Global Trade",
    generatedBy: "System",
    format: "PDF",
    size: "2.4 MB",
    downloads: 45,
    sections: [
      "Executive Summary",
      "Trade Volume Analysis",
      "Market Trends",
      "Key Opportunities",
      "Recommendations",
    ],
    keyFindings: [
      "Trade volume increased 18% compared to Q4 2024",
      "Export-oriented growth in agricultural sector",
      "Emerging markets showing strong demand",
      "Regional integration expanding market access",
    ],
  },
  "RPT-002": {
    id: "RPT-002",
    title: "Monthly Fund Request Summary",
    description: "Summary of all fund requests for March 2025",
    type: "Financial Summary",
    requester: "Finance Department",
    email: "reports@finance.gov",
    submittedDate: "2025-04-02",
    status: "completed",
    category: "Monthly",
    scope: "Fund Management",
    generatedBy: "Sarah Johnson",
    format: "Excel",
    size: "1.2 MB",
    downloads: 23,
    sections: [
      "Fund Overview",
      "Request Summary",
      "Budget Allocation",
      "Performance Metrics",
      "Forecast",
    ],
    keyFindings: [
      "Total fund requests: $2.5M across 15 applications",
      "Approval rate: 73% for tier-1 projects",
      "Average processing time: 8.5 days",
      "Agriculture and Technology leading sectors",
    ],
  },
  "RPT-003": {
    id: "RPT-003",
    title: "Project Progress Dashboard",
    description: "Real-time project progress and performance metrics",
    type: "Performance Report",
    requester: "Project Management Office",
    email: "reports@pmo.gov",
    submittedDate: "2025-04-03",
    status: "processing",
    category: "Dashboard",
    scope: "Project Portfolio",
    generatedBy: "System",
    format: "Interactive",
    size: "N/A",
    downloads: 0,
    sections: [
      "Portfolio Overview",
      "Project Status",
      "Risk Assessment",
      "Resource Utilization",
      "Timeline Analysis",
    ],
    keyFindings: [
      "82% of projects on schedule",
      "Budget utilization at 71%",
      "Medium risk identified in 3 projects",
      "3 projects ahead of schedule",
    ],
  },
  "RPT-004": {
    id: "RPT-004",
    title: "Annual Compliance Report 2024",
    description: "Year-end compliance and regulatory requirements report",
    type: "Compliance",
    requester: "Legal Department",
    email: "reports@legal.gov",
    submittedDate: "2025-01-15",
    status: "completed",
    category: "Annual",
    scope: "Regulatory Compliance",
    generatedBy: "Legal Team",
    format: "PDF",
    size: "5.8 MB",
    downloads: 67,
    sections: [
      "Compliance Overview",
      "Regulatory Updates",
      "Audit Results",
      "Risk Assessment",
      "Recommendations",
    ],
    keyFindings: [
      "100% compliance with international standards",
      "All audits passed with zero critical findings",
      "Updated 12 policies to align with new regulations",
      "Staff training completion: 98%",
    ],
  },
};

function SectionLabel({ children }) {
  return (
    <Typography
      sx={{
        fontSize: "0.68rem",
        fontWeight: 800,
        color: ACCENT,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        mb: 1.5,
      }}
    >
      {children}
    </Typography>
  );
}

function StatusChip({ status }) {
  const statusMap = {
    completed: { bg: "#dcfce7", text: "#15803d", label: "Completed" },
    processing: { bg: "#fef9c3", text: "#854d0e", label: "Processing" },
    scheduled: { bg: "#dbeafe", text: "#1d4ed8", label: "Scheduled" },
    failed: { bg: "#fee2e2", text: "#991b1b", label: "Failed" },
    pending: { bg: "#fef9c3", text: "#854d0e", label: "Pending" },
  };

  const config = statusMap[status] || {
    bg: "#f3f4f6",
    text: "#374151",
    label: status,
  };

  return (
    <Chip
      label={config.label}
      sx={{
        height: 28,
        borderRadius: "6px",
        fontSize: "0.8rem",
        fontWeight: 700,
        backgroundColor: config.bg,
        color: config.text,
      }}
    />
  );
}

export default function AdminReportDetailPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const colors = useThemeColors();

  const [tab, setTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });
  const [report, setReport] = useState(mockReports[reportId] || null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (report) {
      setFormData({
        title: report.title,
        description: report.description,
        status: report.status,
        type: report.type,
        requester: report.requester,
      });
    }
  }, [report]);

  if (!report) {
    return (
      <DashboardLayout role="admin">
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  const handleSave = () => {
    setSnack({ open: true, message: "Report updated successfully", severity: "success" });
    setIsEditing(false);
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <DashboardLayout role="admin">
      <Box sx={{ minHeight: "100%", backgroundColor: colors.bg }}>
        {/* Hero Section */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${ACCENT}20 0%, ${PRIMARY}15 100%)`,
            borderBottom: `1px solid ${colors.border}`,
            p: 4,
          }}
        >
          <Box sx={{ maxWidth: 1200, mx: "auto" }}>
            <Button
              startIcon={<ArrowLeft size={18} />}
              onClick={() => navigate("/dashboard/admin/reports")}
              sx={{
                color: colors.text,
                textTransform: "none",
                mb: 2,
                "&:hover": { backgroundColor: `${ACCENT}15` },
              }}
            >
              Back to Reports
            </Button>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: colors.text, mb: 1 }}>
                  {report.title}
                </Typography>
                <Typography sx={{ color: colors.textMuted, mb: 2, fontSize: "0.95rem" }}>
                  {report.description}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <StatusChip status={report.status} />
                  <Chip
                    label={report.category}
                    size="small"
                    variant="outlined"
                    sx={{ borderColor: colors.border }}
                  />
                </Stack>
              </Box>

              <Stack direction="row" spacing={1}>
                <Button
                  startIcon={<Edit size={18} />}
                  variant={isEditing ? "contained" : "outlined"}
                  onClick={() => setIsEditing(!isEditing)}
                  sx={{
                    textTransform: "none",
                    borderColor: isEditing ? ACCENT : colors.border,
                    color: isEditing ? "white" : colors.text,
                    backgroundColor: isEditing ? ACCENT : "transparent",
                    "&:hover": {
                      backgroundColor: isEditing ? `${ACCENT}dd` : `${ACCENT}15`,
                    },
                  }}
                >
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
                {isEditing && (
                  <Button
                    startIcon={<Save size={18} />}
                    variant="contained"
                    onClick={handleSave}
                    sx={{
                      textTransform: "none",
                      backgroundColor: PRIMARY,
                      "&:hover": { backgroundColor: `${PRIMARY}dd` },
                    }}
                  >
                    Save
                  </Button>
                )}
              </Stack>
            </Box>
          </Box>
        </Box>

        {/* Stats Pills */}
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            mt: -2,
            px: 4,
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", md: "1fr 1fr 1fr 1fr" },
            gap: 2,
            position: "relative",
            zIndex: 10,
          }}
        >
          {[
            { icon: FileText, label: "Report Type", value: report.type },
            { icon: BarChart3, label: "Scope", value: report.scope },
            { icon: Calendar, label: "Submitted", value: report.submittedDate },
            { icon: Users, label: "Requester", value: report.requester },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Paper
                key={idx}
                sx={{
                  backgroundColor: colors.bgPanel,
                  border: `1px solid ${colors.border}`,
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "8px",
                    backgroundColor: `${ACCENT}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: ACCENT,
                  }}
                >
                  <Icon size={20} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: "0.75rem", color: colors.textMuted, mb: 0.2 }}>
                    {stat.label}
                  </Typography>
                  <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: colors.text }}>
                    {stat.value}
                  </Typography>
                </Box>
              </Paper>
            );
          })}
        </Box>

        {/* Content Tabs */}
        <Box sx={{ maxWidth: 1200, mx: "auto", px: 4, py: 4 }}>
          <Box sx={{ borderBottom: `1px solid ${colors.border}`, mb: 4 }}>
            <Tabs value={tab} onChange={(e, newTab) => setTab(newTab)} sx={{ mb: -1 }}>
              <Tab label="Overview" />
              <Tab label="Sections" />
              <Tab label="Management" />
            </Tabs>
          </Box>

          {/* Tab: Overview */}
          {tab === 0 && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 8 }}>
                <Paper sx={{ backgroundColor: colors.bgPanel, border: `1px solid ${colors.border}`, p: 3 }}>
                  <SectionLabel>Report Summary</SectionLabel>
                  <Typography sx={{ color: colors.text, lineHeight: 1.6, mb: 3 }}>
                    {report.description}
                  </Typography>

                  <SectionLabel>Key Findings</SectionLabel>
                  <Stack spacing={2}>
                    {report.keyFindings.map((finding, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          p: 2,
                          border: `1px solid ${colors.border}`,
                          borderLeft: `4px solid ${ACCENT}`,
                          borderRadius: "4px",
                          backgroundColor: `${ACCENT}08`,
                        }}
                      >
                        <Typography sx={{ color: colors.text, fontSize: "0.9rem" }}>
                          {finding}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Paper sx={{ backgroundColor: colors.bgPanel, border: `1px solid ${colors.border}`, p: 3 }}>
                  <SectionLabel>Report Information</SectionLabel>
                  <Stack spacing={2}>
                    {[
                      { icon: FileText, label: "Type", value: report.type },
                      { icon: BarChart3, label: "Scope", value: report.scope },
                      { icon: Calendar, label: "Submitted", value: report.submittedDate },
                      { icon: Users, label: "Requester", value: report.requester },
                    ].map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <Box key={idx} sx={{ pb: 1.5, borderBottom: `1px solid ${colors.border}` }}>
                          <Typography sx={{ fontSize: "0.75rem", color: colors.textMuted, mb: 0.5, display: "flex", alignItems: "center", gap: 1 }}>
                            <Icon size={14} /> {item.label}
                          </Typography>
                          <Typography sx={{ fontSize: "0.95rem", fontWeight: 600, color: colors.text }}>
                            {item.value}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* Tab: Sections */}
          {tab === 1 && (
            <Paper sx={{ backgroundColor: colors.bgPanel, border: `1px solid ${colors.border}`, p: 3 }}>
              <SectionLabel>Report Sections</SectionLabel>
              <Stack spacing={1.5}>
                {report.sections.map((section, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      p: 2,
                      border: `1px solid ${colors.border}`,
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      backgroundColor: idx === 0 ? `${ACCENT}10` : "transparent",
                    }}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "6px",
                        backgroundColor: ACCENT,
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "0.8rem",
                        flexShrink: 0,
                      }}
                    >
                      {idx + 1}
                    </Box>
                    <Typography sx={{ color: colors.text, fontSize: "0.9rem", fontWeight: 600 }}>
                      {section}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>
          )}

          {/* Tab: Management */}
          {tab === 2 && (
            <Paper sx={{ backgroundColor: colors.bgPanel, border: `1px solid ${colors.border}`, p: 3 }}>
              <SectionLabel>Management & Details</SectionLabel>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Title"
                    value={formData.title || ""}
                    onChange={(e) => handleFieldChange("title", e.target.value)}
                    disabled={!isEditing}
                    size="small"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Status"
                    value={formData.status || ""}
                    onChange={(e) => handleFieldChange("status", e.target.value)}
                    disabled={!isEditing}
                    size="small"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Report Type"
                    value={report.type}
                    disabled
                    size="small"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Requester Email"
                    value={report.email}
                    disabled
                    size="small"
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={4}
                    value={formData.description || ""}
                    onChange={(e) => handleFieldChange("description", e.target.value)}
                    disabled={!isEditing}
                  />
                </Grid>
              </Grid>
            </Paper>
          )}
        </Box>

        {/* Snackbar */}
        <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })}>
          <Alert severity={snack.severity}>{snack.message}</Alert>
        </Snackbar>
      </Box>
    </DashboardLayout>
  );
}
