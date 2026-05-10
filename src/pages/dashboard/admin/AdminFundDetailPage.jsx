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
  Trash2,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useThemeColors } from "../../../utils/useThemeColors";
import { fundService } from "../../../utils/apiService";

const ACCENT = "#61C5C3";
const PRIMARY = "#FF8C00";

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

  const isNew = !fundId;
  const [tab, setTab] = useState(0);
  const [isEditing, setIsEditing] = useState(isNew);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [fund, setFund] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    amount: "",
    currency: "USD",
    applicant: "",
    email: "",
    category: "",
    region: "",
  });

  useEffect(() => {
    if (!isNew) {
      fetchFund();
    } else {
      setLoading(false);
    }
  }, [fundId, isNew]);

  const fetchFund = async () => {
    try {
      const response = await fundService.get(fundId);
      const data = response?.data?.data || response?.data;
      if (data) {
        setFund(data);
        setFormData({
          title: data.title || "",
          description: data.description || "",
          status: data.status || "pending",
          amount: data.amount || "",
          currency: data.currency || "USD",
          applicant: data.applicant || data.created_by || "",
          email: data.email || "",
          category: data.category || "",
          region: data.region || "",
        });
      }
    } catch (err) {
      setSnack({ open: true, message: "Failed to load fund", severity: "error" });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        amount: parseFloat(formData.amount) || 0,
        currency: formData.currency,
        applicant: formData.applicant,
        email: formData.email,
        category: formData.category,
        region: formData.region,
      };

      if (isNew) {
        await fundService.create(payload);
      } else {
        await fundService.update(fundId, payload);
      }

      setSnack({ open: true, message: "Fund updated successfully", severity: "success" });
      setIsEditing(false);
      if (isNew) {
        setTimeout(() => navigate("/dashboard/admin/funds"), 1500);
      }
    } catch (err) {
      setSnack({ open: true, message: "Failed to save fund", severity: "error" });
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this fund?")) return;
    setSaving(true);
    try {
      await fundService.delete(fundId);
      setSnack({ open: true, message: "Fund deleted successfully", severity: "success" });
      setTimeout(() => navigate("/dashboard/admin/funds"), 1500);
    } catch (err) {
      setSnack({ open: true, message: "Failed to delete fund", severity: "error" });
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

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
                  {formData.title || "New Fund"}
                </Typography>
                <Typography sx={{ color: colors.textMuted, mb: 2, fontSize: "0.95rem" }}>
                  {formData.description || (isNew ? "Enter a description" : "No description")}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <StatusChip status={formData.status} />
                  {formData.category && (
                    <Chip
                      label={formData.category}
                      size="small"
                      variant="outlined"
                      sx={{ borderColor: colors.border }}
                    />
                  )}
                </Stack>
              </Box>

              <Stack direction="row" spacing={1}>
                <Button
                  startIcon={<Edit size={18} />}
                  variant={isEditing ? "contained" : "outlined"}
                  onClick={() => setIsEditing(!isEditing)}
                  disabled={saving}
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
                    disabled={saving}
                    sx={{
                      textTransform: "none",
                      backgroundColor: PRIMARY,
                      "&:hover": { backgroundColor: `${PRIMARY}dd` },
                    }}
                  >
                    {saving ? "Saving..." : "Save"}
                  </Button>
                )}
                {!isNew && !isEditing && (
                  <Button
                    startIcon={<Trash2 size={18} />}
                    variant="outlined"
                    color="error"
                    onClick={handleDelete}
                    disabled={saving}
                    sx={{ textTransform: "none" }}
                  >
                    Delete
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
            { icon: DollarSign, label: "Amount Requested", value: `$${(parseFloat(formData.amount) || 0).toLocaleString()}` },
            { icon: MapPin, label: "Region", value: formData.region || "-" },
            { icon: Chip, label: "Currency", value: formData.currency || "USD" },
            { icon: Calendar, label: "Status", value: formData.status || "-" },
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
                        Currency
                      </Typography>
                      <Typography sx={{ fontSize: "0.95rem", fontWeight: 600, color: colors.text }}>
                        {formData.currency}
                      </Typography>
                    </Box>
                    <Box sx={{ p: 2, border: `1px solid ${colors.border}`, borderRadius: "8px", flex: 1 }}>
                      <Typography sx={{ fontSize: "0.75rem", color: colors.textMuted, mb: 0.5 }}>
                        Status
                      </Typography>
                      <Typography sx={{ fontSize: "0.95rem", fontWeight: 600, color: colors.text }}>
                        {formData.status}
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
                      { icon: DollarSign, label: "Amount", value: `$${(parseFloat(formData.amount) || 0).toLocaleString()}` },
                      { icon: MapPin, label: "Region", value: formData.region || "-" },
                      { icon: TrendingUp, label: "Category", value: formData.category || "-" },
                      { icon: Users, label: "Applicant", value: formData.applicant || "-" },
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
