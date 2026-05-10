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
  Users,
  MapPin,
  Edit,
  Save,
  TrendingUp,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useThemeColors } from "../../../utils/useThemeColors";

const ACCENT = "#61C5C3";
const PRIMARY = "#FF8C00";

const mockFundRequests = {
  "FR-001": {
    id: "FR-001",
    title: "Agricultural Development Fund",
    description: "Funding for small-scale agricultural projects in East Africa",
    amount: 250000,
    currency: "USD",
    status: "pending",
    applicant: "East Africa Farmers Cooperative",
    email: "contact@eafc.org",
    submittedDate: "2025-01-15",
    category: "Agriculture",
    region: "East Africa",
    fundType: "Development Grant",
    duration: "24 months",
    objectives: [
      "Support 500+ smallholder farmers",
      "Improve agricultural productivity",
      "Establish market linkages",
      "Provide technical training",
    ],
  },
  "FR-002": {
    id: "FR-002",
    title: "Technology Infrastructure Grant",
    description: "Infrastructure development for technology startups",
    amount: 500000,
    currency: "USD",
    status: "approved",
    applicant: "TechHub Africa",
    email: "funding@techchub.org",
    submittedDate: "2025-01-10",
    category: "Technology",
    region: "West Africa",
    fundType: "Infrastructure Grant",
    duration: "36 months",
    objectives: [
      "Build tech incubation center",
      "Provide mentorship programs",
      "Support startup development",
      "Create 100+ tech jobs",
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
    pending: { bg: "#fef9c3", text: "#854d0e", label: "Pending" },
    approved: { bg: "#dcfce7", text: "#15803d", label: "Approved" },
    rejected: { bg: "#fee2e2", text: "#991b1b", label: "Rejected" },
    under_review: { bg: "#dbeafe", text: "#1d4ed8", label: "Under Review" },
    funded: { bg: "#dcfce7", text: "#15803d", label: "Funded" },
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

export default function AdminFundDetailPage() {
  const { fundId } = useParams();
  const navigate = useNavigate();
  const colors = useThemeColors();

  const [tab, setTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });
  const [fund, setFund] = useState(mockFundRequests[fundId] || null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (fund) {
      setFormData({
        title: fund.title,
        description: fund.description,
        status: fund.status,
        amount: fund.amount,
        applicant: fund.applicant,
      });
    }
  }, [fund]);

  if (!fund) {
    return (
      <DashboardLayout role="admin">
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  const handleSave = () => {
    setSnack({ open: true, message: "Fund request updated successfully", severity: "success" });
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
              onClick={() => navigate("/dashboard/admin/funds")}
              sx={{
                color: colors.text,
                textTransform: "none",
                mb: 2,
                "&:hover": { backgroundColor: `${ACCENT}15` },
              }}
            >
              Back to Fund Requests
            </Button>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: colors.text, mb: 1 }}>
                  {fund.title}
                </Typography>
                <Typography sx={{ color: colors.textMuted, mb: 2, fontSize: "0.95rem" }}>
                  {fund.description}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <StatusChip status={fund.status} />
                  <Chip
                    label={fund.category}
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
            { icon: DollarSign, label: "Amount Requested", value: `$${fund.amount.toLocaleString()}` },
            { icon: MapPin, label: "Region", value: fund.region },
            { icon: Calendar, label: "Duration", value: fund.duration },
            { icon: Calendar, label: "Submitted", value: fund.submittedDate },
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
              <Tab label="Objectives" />
              <Tab label="Management" />
            </Tabs>
          </Box>

          {/* Tab: Overview */}
          {tab === 0 && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 8 }}>
                <Paper sx={{ backgroundColor: colors.bgPanel, border: `1px solid ${colors.border}`, p: 3 }}>
                  <SectionLabel>Fund Request Summary</SectionLabel>
                  <Typography sx={{ color: colors.text, lineHeight: 1.6, mb: 3 }}>
                    {fund.description}
                  </Typography>

                  <SectionLabel>Fund Type & Duration</SectionLabel>
                  <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
                    <Box sx={{ p: 2, border: `1px solid ${colors.border}`, borderRadius: "8px", flex: 1 }}>
                      <Typography sx={{ fontSize: "0.75rem", color: colors.textMuted, mb: 0.5 }}>
                        Fund Type
                      </Typography>
                      <Typography sx={{ fontSize: "0.95rem", fontWeight: 600, color: colors.text }}>
                        {fund.fundType}
                      </Typography>
                    </Box>
                    <Box sx={{ p: 2, border: `1px solid ${colors.border}`, borderRadius: "8px", flex: 1 }}>
                      <Typography sx={{ fontSize: "0.75rem", color: colors.textMuted, mb: 0.5 }}>
                        Project Duration
                      </Typography>
                      <Typography sx={{ fontSize: "0.95rem", fontWeight: 600, color: colors.text }}>
                        {fund.duration}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Paper sx={{ backgroundColor: colors.bgPanel, border: `1px solid ${colors.border}`, p: 3 }}>
                  <SectionLabel>Request Information</SectionLabel>
                  <Stack spacing={2}>
                    {[
                      { icon: DollarSign, label: "Amount Requested", value: `$${fund.amount.toLocaleString()}` },
                      { icon: MapPin, label: "Region", value: fund.region },
                      { icon: TrendingUp, label: "Category", value: fund.category },
                      { icon: Calendar, label: "Submitted", value: fund.submittedDate },
                      { icon: Users, label: "Applicant", value: fund.applicant },
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

          {/* Tab: Objectives */}
          {tab === 1 && (
            <Paper sx={{ backgroundColor: colors.bgPanel, border: `1px solid ${colors.border}`, p: 3 }}>
              <SectionLabel>Fund Objectives</SectionLabel>
              <Stack spacing={2}>
                {fund.objectives.map((objective, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      p: 2,
                      border: `1px solid ${colors.border}`,
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        backgroundColor: `${ACCENT}20`,
                        color: ACCENT,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        flexShrink: 0,
                      }}
                    >
                      {idx + 1}
                    </Box>
                    <Typography sx={{ color: colors.text, fontSize: "0.9rem" }}>
                      {objective}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>
          )}

          {/* Tab: Management */}
          {tab === 2 && (
            <Paper sx={{ backgroundColor: colors.bgPanel, border: `1px solid ${colors.border}`, p: 3 }}>
              <SectionLabel>Management & Applicant Info</SectionLabel>
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
                    label="Applicant Name"
                    value={fund.applicant}
                    disabled
                    size="small"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={fund.email}
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
