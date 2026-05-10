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
  Truck,
  MapPin,
  Edit,
  Save,
  AlertCircle,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useThemeColors } from "../../../utils/useThemeColors";

const ACCENT = "#61C5C3";
const PRIMARY = "#FF8C00";

const mockTradeRequests = {
  "TR-001": {
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
    details: "Premium Arabica coffee beans sourced from high-altitude farms in Kenya. Target delivery within 60 days.",
  },
  "TR-002": {
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
    details: "CNC machinery for textile production. Includes training and 2-year warranty.",
  },
  "TR-003": {
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
    details: "High-quality woven cotton fabrics. Eco-friendly production process.",
  },
  "TR-004": {
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
    details: "Advanced diagnostic and surgical equipment for hospital network.",
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
        height: 24,
        borderRadius: "4px",
        fontSize: "0.7rem",
        fontWeight: 600,
        backgroundColor: config.bg,
        color: config.text,
      }}
    />
  );
}

export default function AdminTradeDetailPage() {
  const { tradeId } = useParams();
  const navigate = useNavigate();
  const colors = useThemeColors();

  const [tab, setTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });
  const [trade, setTrade] = useState(mockTradeRequests[tradeId] || null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (trade) {
      setFormData({
        title: trade.title,
        description: trade.description,
        status: trade.status,
        value: trade.value,
        requester: trade.requester,
        details: trade.details,
      });
    }
  }, [trade]);

  if (!trade) {
    return (
      <DashboardLayout role="admin">
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  const handleSave = () => {
    setSnack({ open: true, message: "Trade request updated successfully", severity: "success" });
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
              onClick={() => navigate("/dashboard/admin/trades")}
              sx={{
                color: colors.text,
                textTransform: "none",
                mb: 2,
                "&:hover": { backgroundColor: `${ACCENT}15` },
              }}
            >
              Back to Trades
            </Button>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: colors.text, mb: 1 }}>
                  {trade.title}
                </Typography>
                <Typography sx={{ color: colors.textMuted, mb: 2, fontSize: "0.95rem" }}>
                  {trade.description}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <StatusChip status={trade.status} />
                  <PriorityChip priority={trade.priority} />
                  <Chip
                    label={trade.category}
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
            { icon: DollarSign, label: "Value", value: `$${trade.value.toLocaleString()}` },
            { icon: Truck, label: "Volume", value: trade.volume },
            { icon: MapPin, label: "Route", value: `${trade.origin} → ${trade.destination}` },
            { icon: Calendar, label: "Submitted", value: trade.submittedDate },
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
              <Tab label="Details" />
              <Tab label="Management" />
            </Tabs>
          </Box>

          {/* Tab: Overview */}
          {tab === 0 && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 8 }}>
                <Paper sx={{ backgroundColor: colors.bgPanel, border: `1px solid ${colors.border}`, p: 3 }}>
                  <SectionLabel>Trade Request Details</SectionLabel>
                  <Typography sx={{ color: colors.text, lineHeight: 1.6, mb: 3 }}>
                    {trade.description}
                  </Typography>

                  <Box sx={{ p: 2, backgroundColor: `${ACCENT}10`, borderRadius: "8px", mb: 3 }}>
                    <Typography sx={{ fontSize: "0.9rem", color: colors.text, lineHeight: 1.6 }}>
                      {trade.details}
                    </Typography>
                  </Box>

                  <SectionLabel>Route Information</SectionLabel>
                  <Stack spacing={2}>
                    <Box sx={{ p: 2, border: `1px solid ${colors.border}`, borderRadius: "8px" }}>
                      <Typography sx={{ fontSize: "0.75rem", color: colors.textMuted, mb: 0.5 }}>
                        Origin Country
                      </Typography>
                      <Typography sx={{ fontSize: "0.95rem", fontWeight: 600, color: colors.text }}>
                        {trade.origin}
                      </Typography>
                    </Box>
                    <Box sx={{ p: 2, border: `1px solid ${colors.border}`, borderRadius: "8px" }}>
                      <Typography sx={{ fontSize: "0.75rem", color: colors.textMuted, mb: 0.5 }}>
                        Destination Country
                      </Typography>
                      <Typography sx={{ fontSize: "0.95rem", fontWeight: 600, color: colors.text }}>
                        {trade.destination}
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
                      { icon: AlertCircle, label: "Type", value: trade.type },
                      { icon: Truck, label: "Volume", value: trade.volume },
                      { icon: DollarSign, label: "Value", value: `$${trade.value.toLocaleString()}` },
                      { icon: Calendar, label: "Submitted", value: trade.submittedDate },
                      { icon: MapPin, label: "Category", value: trade.category },
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

          {/* Tab: Details */}
          {tab === 1 && (
            <Paper sx={{ backgroundColor: colors.bgPanel, border: `1px solid ${colors.border}`, p: 3 }}>
              <SectionLabel>Requester Information</SectionLabel>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Requester Name"
                    value={trade.requester}
                    disabled
                    size="small"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={trade.email}
                    disabled
                    size="small"
                  />
                </Grid>
              </Grid>
            </Paper>
          )}

          {/* Tab: Management */}
          {tab === 2 && (
            <Paper sx={{ backgroundColor: colors.bgPanel, border: `1px solid ${colors.border}`, p: 3 }}>
              <SectionLabel>Management</SectionLabel>
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
