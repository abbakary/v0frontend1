import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Button,
  Divider,
  Stack,
  Typography,
  Chip,
  CircularProgress,
  TextField,
  Snackbar,
  Alert,
  Card,
  CardContent,
} from "@mui/material";
import {
  ArrowLeft,
  Save,
  X,
  Briefcase,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Globe,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useThemeColors } from "../../../utils/useThemeColors";
import DashboardLayout from "../components/DashboardLayout";

const ACCENT = "#61C5C3";
const PRIMARY = "#FF8C00";
const WARNING = "#f59e0b";
const DANGER = "#dc2626";

const mockProjectRequests = [
  {
    id: "PR-001",
    title: "Water Infrastructure Development",
    description: "Building sustainable water supply systems in rural communities.",
    fullDescription: "Comprehensive water infrastructure project targeting rural electrification and sustainable resource management across multiple regions.",
    reviewNotes: "Awaiting environmental impact assessment.",
    type: "Infrastructure",
    status: "pending_review",
    priority: "High",
    progress: 35,
    country: "Uganda",
    region: "Central Region",
    createdAt: "2025-01-08",
  },
  {
    id: "PR-002",
    title: "Agricultural Modernization",
    description: "Implementing modern farming techniques and technology.",
    fullDescription: "Agricultural modernization initiative focusing on sustainable practices and technology adoption.",
    reviewNotes: "Under stakeholder consultation.",
    type: "Agriculture",
    status: "pending_review",
    priority: "Medium",
    progress: 20,
    country: "Kenya",
    region: "East Region",
    createdAt: "2025-01-14",
  },
];

function StatusBadge({ status }) {
  const statusMap = {
    pending_review: { bg: "#fef9c3", text: "#854d0e", label: "Pending Review" },
    under_review: { bg: "#dbeafe", text: "#1d4ed8", label: "Under Review" },
    approved: { bg: "#dcfce7", text: "#15803d", label: "Approved" },
    rejected: { bg: "#fee2e2", text: "#991b1b", label: "Rejected" },
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

export default function EditProjectRequestPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const colors = useThemeColors();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [form, setForm] = useState({
    title: "",
    fullDescription: "",
    reviewNotes: "",
    type: "",
    priority: "Medium",
    progress: "",
    country: "",
    region: "",
    status: "pending_review",
  });

  useEffect(() => {
    const data = mockProjectRequests.find((r) => r.id === id);
    if (data) {
      setRequest(data);
      setForm({
        title: data.title,
        fullDescription: data.fullDescription,
        reviewNotes: data.reviewNotes,
        type: data.type,
        priority: data.priority,
        progress: data.progress,
        country: data.country,
        region: data.region,
        status: data.status,
      });
    }
    setLoading(false);
  }, [id]);

  const showNotification = (message, severity = "success") => {
    setNotification({ open: true, message, severity });
  };

  const handleUpdate = async () => {
    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const updated = { ...request, ...form };
      setRequest(updated);
      showNotification("Project request updated successfully!");
      setTimeout(() => navigate("/dashboard/editor/projects"), 1500);
    } catch (err) {
      showNotification(err.message || "Failed to update", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <CircularProgress size={32} sx={{ color: ACCENT }} />
        <Typography sx={{ color: colors.textMuted, fontWeight: 600 }}>
          Loading request details...
        </Typography>
      </Box>
    );
  }

  if (!request) {
    return (
      <Box sx={{ py: 10, textAlign: "center" }}>
        <Typography
          variant="h5"
          sx={{ color: colors.text, fontWeight: 700, mb: 2 }}
        >
          Request Not Found
        </Typography>
        <Button
          startIcon={<ArrowLeft size={16} />}
          onClick={() => navigate("/dashboard/editor/projects")}
          sx={{ color: ACCENT, fontWeight: 700 }}
        >
          Back to Project Requests
        </Button>
      </Box>
    );
  }

  return (
    <DashboardLayout role="editor">
      <Box sx={{ maxWidth: 1200, mx: "auto", py: 4, px: 2 }}>
        <Helmet>
          <title>Edit Project Request - {request.title}</title>
        </Helmet>

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
          pb: 3,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <Button
          startIcon={<ArrowLeft size={18} />}
          onClick={() => navigate("/dashboard/editor/projects")}
          sx={{
            color: ACCENT,
            fontWeight: 700,
            textTransform: "none",
            px: 0,
            "&:hover": { backgroundColor: "transparent", opacity: 0.8 },
          }}
        >
          Back to Project Requests
        </Button>
        <StatusBadge status={request.status} />
      </Box>

      {/* View Details Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          sx={{
            fontSize: "0.8rem",
            fontWeight: 900,
            color: ACCENT,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            mb: 3,
          }}
        >
          Request Details
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 280px" },
            gap: 3,
            mb: 4,
          }}
        >
          {/* Main Details */}
          <Box>
            <Stack spacing={2}>
              {[
                { icon: Briefcase, label: "Project Type", value: request.type },
                { icon: TrendingUp, label: "Priority", value: request.priority },
                { icon: AlertCircle, label: "Progress", value: `${request.progress}%` },
                { icon: Globe, label: "Country", value: request.country },
              ].map((item, idx) => (
                <Card
                  key={idx}
                  sx={{
                    borderRadius: "12px",
                    border: `1px solid ${colors.border}`,
                    backgroundColor: colors.bgPanel,
                    boxShadow: "none",
                  }}
                >
                  <CardContent sx={{ p: 2, display: "flex", gap: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: "8px",
                        backgroundColor: `${ACCENT}15`,
                        color: ACCENT,
                        height: "fit-content",
                      }}
                    >
                      <item.icon size={18} />
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: colors.textMuted,
                          mb: 0.5,
                        }}
                      >
                        {item.label}
                      </Typography>
                      <Typography sx={{ fontWeight: 700, color: colors.text }}>
                        {item.value}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>

          {/* Sidebar */}
          <Card
            sx={{
              borderRadius: "16px",
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.bgPanel,
              boxShadow: "none",
              p: 3,
              height: "fit-content",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.8rem",
                fontWeight: 900,
                color: ACCENT,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                mb: 2,
              }}
            >
              Project Status
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    color: colors.textMuted,
                    mb: 0.5,
                  }}
                >
                  Region
                </Typography>
                <Typography sx={{ fontWeight: 700, color: colors.text }}>
                  {request.region}
                </Typography>
              </Box>
              <Divider />
              <Box>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    color: colors.textMuted,
                    mb: 0.5,
                  }}
                >
                  Progress
                </Typography>
                <Typography sx={{ fontWeight: 700, color: colors.text }}>
                  {request.progress}%
                </Typography>
              </Box>
              <Divider />
              <Box>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    color: colors.textMuted,
                    mb: 0.5,
                  }}
                >
                  Status
                </Typography>
                <StatusBadge status={request.status} />
              </Box>
            </Stack>
          </Card>
        </Box>
      </Box>

      {/* Edit Form */}
      <Box>
        <Typography
          sx={{
            fontSize: "0.8rem",
            fontWeight: 900,
            color: ACCENT,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            mb: 3,
          }}
        >
          Edit Project Request
        </Typography>

        <Stack spacing={3}>
          {/* Title - Full Width */}
          <TextField
            fullWidth
            label="Project Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: "12px" },
            }}
          />

          {/* Two Column Row */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              label="Project Type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
              }}
            />
            <TextField
              label="Priority"
              select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              SelectProps={{ native: true }}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
              }}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </TextField>
          </Box>

          {/* Two Column Row */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              label="Progress (%)"
              type="number"
              inputProps={{ min: 0, max: 100 }}
              value={form.progress}
              onChange={(e) =>
                setForm({ ...form, progress: parseInt(e.target.value) })
              }
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
              }}
            />
            <TextField
              label="Status"
              select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              SelectProps={{ native: true }}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
              }}
            >
              <option value="pending_review">Pending Review</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </TextField>
          </Box>

          {/* Two Column Row */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              label="Country"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
              }}
            />
            <TextField
              label="Region"
              value={form.region}
              onChange={(e) => setForm({ ...form, region: e.target.value })}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
              }}
            />
          </Box>

          {/* Full Description - Full Width */}
          <TextField
            fullWidth
            label="Full Description"
            multiline
            rows={4}
            value={form.fullDescription}
            onChange={(e) =>
              setForm({ ...form, fullDescription: e.target.value })
            }
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: "12px" },
            }}
          />

          {/* Review Notes - Full Width */}
          <TextField
            fullWidth
            label="Review Notes"
            multiline
            rows={4}
            value={form.reviewNotes}
            onChange={(e) =>
              setForm({ ...form, reviewNotes: e.target.value })
            }
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: "12px" },
            }}
          />

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 2, pt: 2 }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Save size={16} />}
              onClick={handleUpdate}
              disabled={submitting}
              sx={{
                backgroundColor: ACCENT,
                fontWeight: 700,
                textTransform: "none",
                borderRadius: "12px",
                py: 1.5,
                "&:hover": {
                  backgroundColor: ACCENT,
                  opacity: 0.9,
                },
              }}
            >
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<X size={16} />}
              onClick={() => navigate("/dashboard/editor/projects")}
              sx={{
                color: ACCENT,
                borderColor: ACCENT,
                fontWeight: 700,
                textTransform: "none",
                borderRadius: "12px",
                py: 1.5,
              }}
            >
              Cancel
            </Button>
          </Box>
        </Stack>
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          severity={notification.severity}
          variant="filled"
          sx={{ borderRadius: "12px" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
      </Box>
    </DashboardLayout>
  );
}
