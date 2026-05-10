import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Button,
  Container,
  Divider,
  Stack,
  Tab,
  Tabs,
  Typography,
  Chip,
  CircularProgress,
  Avatar,
  TextField,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Card,
  CardContent,
} from "@mui/material";
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Save,
  X,
  Calendar,
  Globe,
  User,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Briefcase,
  DollarSign,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import PageLayout from "../components/PageLayout";
import { useThemeColors } from "../../../utils/useThemeColors";

const ACCENT = "#61C5C3";
const PRIMARY = "#FF8C00";
const SUCCESS = "#16a34a";
const WARNING = "#f59e0b";
const DANGER = "#dc2626";

const BASE_URL = "https://daliportal-api.daligeotech.com";
const TOKEN_KEY = "dali-token";

const getToken = () =>
  localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

const api = {
  get: (path) =>
    fetch(`${BASE_URL}${path}`, { headers: authHeaders() }).then((r) => {
      if (!r.ok) throw new Error(r.statusText);
      return r.json();
    }),
  put: (path, body) =>
    fetch(`${BASE_URL}${path}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then((r) => {
      if (!r.ok) throw new Error(r.statusText);
      return r.json();
    }),
  delete: (path) =>
    fetch(`${BASE_URL}${path}`, {
      method: "DELETE",
      headers: authHeaders(),
    }).then((r) => {
      if (!r.ok) throw new Error(r.statusText);
      return r.json();
    }),
};

const STATUS_MAP = {
  submitted: { bg: "#fef9c3", text: "#854d0e", label: "Submitted" },
  pending: { bg: "#fef9c3", text: "#854d0e", label: "Pending" },
  approved: { bg: "#dcfce7", text: "#15803d", label: "Approved" },
  active: { bg: "#dcfce7", text: "#15803d", label: "Active" },
  in_progress: { bg: "#dbeafe", text: "#1d4ed8", label: "In Progress" },
  completed: { bg: "#f0fdf4", text: "#166534", label: "Completed" },
  rejected: { bg: "#fee2e2", text: "#991b1b", label: "Rejected" },
  cancelled: { bg: "#f3f4f6", text: "#374151", label: "Cancelled" },
};

function StatusBadge({ status, isDark }) {
  if (!status) return null;
  const key = status.toLowerCase().replace(" ", "_");
  const p = STATUS_MAP[key] || {
    bg: isDark ? "#2a2a2a" : "#f3f4f6",
    text: isDark ? "#aaa" : "#374151",
  };
  return (
    <Chip
      label={p.label || status}
      size="small"
      sx={{
        height: 24,
        borderRadius: "6px",
        fontSize: "0.75rem",
        fontWeight: 700,
        backgroundColor: isDark ? `${p.text}22` : p.bg,
        color: p.text,
      }}
    />
  );
}

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function fmtNum(n) {
  if (n == null) return "—";
  return Number(n).toLocaleString();
}

export default function ProjectInfo() {
  const navigate = useNavigate();
  const { id } = useParams();
  const colors = useThemeColors();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tab, setTab] = useState(0);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "",
    status: "",
    priority: "Medium",
    progress: 0,
    country: "",
    region: "",
    tags: "",
  });

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    setLoading(true);
    try {
      const data = await api.get(`/projects/${id}`);
      setProject(data);
      setForm({
        title: data.title || "",
        description: data.description || "",
        type: data.type || "",
        status: data.status || "",
        priority: data.priority || "Medium",
        progress: data.progress || 0,
        country: data.country || "",
        region: data.region || "",
        tags: (data.tags || "").toString(),
      });
    } catch (err) {
      showNotification("Failed to load project", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, severity = "success") => {
    setNotification({ open: true, message, severity });
  };

  const handleUpdate = async () => {
    if (!project) return;
    setSubmitting(true);
    try {
      const updated = await api.put(`/projects/${project.id}`, form);
      setProject(updated);
      setEditing(false);
      showNotification("Project updated successfully!");
    } catch (err) {
      showNotification(err.message || "Failed to update project", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!project) return;
    if (
      !confirm(
        `Delete project "${project.title}"? This action cannot be undone.`,
      )
    )
      return;

    setSubmitting(true);
    try {
      await api.delete(`/projects/${project.id}`);
      showNotification("Project deleted successfully!");
      setTimeout(() => navigate("/public/project"), 2000);
    } catch (err) {
      showNotification(err.message || "Failed to delete project", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
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
            Loading project details...
          </Typography>
        </Box>
      </PageLayout>
    );
  }

  if (!project) {
    return (
      <PageLayout>
        <Box sx={{ py: 10, textAlign: "center" }}>
          <Typography
            variant="h5"
            sx={{ color: colors.text, fontWeight: 700, mb: 2 }}
          >
            Project Not Found
          </Typography>
          <Button
            startIcon={<ArrowLeft size={16} />}
            onClick={() => navigate("/public/project")}
            sx={{ color: ACCENT, fontWeight: 700 }}
          >
            Back to Projects
          </Button>
        </Box>
      </PageLayout>
    );
  }

  const statusInfo = STATUS_MAP[project.status?.toLowerCase()] || {
    bg: "#f3f4f6",
    text: "#374151",
    label: project.status || "Unknown",
  };

  return (
    <PageLayout>
      <Helmet>
        <title>{project.title || "Project"} - Dali Portal</title>
        <meta
          name="description"
          content={project.description || "Project details"}
        />
      </Helmet>

      <Box sx={{ maxWidth: 1400, mx: "auto", py: 4, px: 2 }}>
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
            onClick={() => navigate("/public/project")}
            sx={{
              color: ACCENT,
              fontWeight: 700,
              textTransform: "none",
              px: 0,
              "&:hover": { backgroundColor: "transparent", opacity: 0.8 },
            }}
          >
            Back to Projects
          </Button>
          {!editing && (
            <Stack direction="row" spacing={1}>
              <Button
                startIcon={<Edit3 size={16} />}
                onClick={() => setEditing(true)}
                variant="outlined"
                sx={{
                  borderColor: ACCENT,
                  color: ACCENT,
                  fontWeight: 700,
                  textTransform: "none",
                  borderRadius: "8px",
                }}
              >
                Edit
              </Button>
              <Button
                startIcon={<Trash2 size={16} />}
                onClick={handleDelete}
                disabled={submitting}
                variant="outlined"
                sx={{
                  borderColor: DANGER,
                  color: DANGER,
                  fontWeight: 700,
                  textTransform: "none",
                  borderRadius: "8px",
                }}
              >
                Delete
              </Button>
            </Stack>
          )}
        </Box>

        {/* Main Content */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 350px" }, gap: 4 }}>
          <Box>
            {/* Title and Status */}
            {!editing ? (
              <>
                <Box sx={{ mb: 3 }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip
                      label={project.type || "Project"}
                      size="small"
                      sx={{
                        backgroundColor: `${ACCENT}20`,
                        color: ACCENT,
                        fontWeight: 700,
                        fontSize: "0.75rem",
                      }}
                    />
                    <StatusBadge status={project.status} />
                  </Stack>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 900,
                      color: colors.text,
                      mb: 1,
                      fontSize: { xs: "1.8rem", sm: "2.2rem" },
                    }}
                  >
                    {project.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: colors.textMuted,
                      fontSize: "1rem",
                      lineHeight: 1.6,
                    }}
                  >
                    {project.description}
                  </Typography>
                </Box>

                {/* Tabs */}
                <Box sx={{ borderBottom: `1px solid ${colors.border}`, mb: 3 }}>
                  <Tabs
                    value={tab}
                    onChange={(e, v) => setTab(v)}
                    sx={{
                      "& .MuiTab-root": {
                        fontWeight: 700,
                        textTransform: "none",
                        color: colors.textMuted,
                        "&.Mui-selected": { color: ACCENT },
                      },
                      "& .MuiTabs-indicator": { backgroundColor: ACCENT },
                    }}
                  >
                    <Tab label="Overview" />
                    <Tab label="Details" />
                    <Tab label="Timeline" />
                  </Tabs>
                </Box>

                {/* Tab Content */}
                {tab === 0 && (
                  <Box>
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
                      Project Summary
                    </Typography>
                    <Box
                      sx={{
                        p: 3,
                        backgroundColor: colors.bgPanel,
                        borderRadius: "16px",
                        border: `1px solid ${colors.border}`,
                        mb: 4,
                      }}
                    >
                      <Typography sx={{ lineHeight: 1.8, color: colors.text }}>
                        {project.description ||
                          "No detailed description available."}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {tab === 1 && (
                  <Box>
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
                      Project Information
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: 2,
                      }}
                    >
                      {[
                        { icon: Briefcase, label: "Type", value: project.type },
                        {
                          icon: CheckCircle2,
                          label: "Status",
                          value: project.status,
                        },
                        {
                          icon: TrendingUp,
                          label: "Priority",
                          value: project.priority,
                        },
                        {
                          icon: AlertCircle,
                          label: "Progress",
                          value: `${project.progress || 0}%`,
                        },
                        { icon: Globe, label: "Country", value: project.country },
                        { icon: Globe, label: "Region", value: project.region },
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
                              <Typography
                                sx={{
                                  fontWeight: 700,
                                  color: colors.text,
                                }}
                              >
                                {item.value || "—"}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  </Box>
                )}

                {tab === 2 && (
                  <Box>
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
                      Timeline
                    </Typography>
                    <Stack
                      spacing={2}
                      sx={{
                        p: 3,
                        backgroundColor: colors.bgPanel,
                        borderRadius: "16px",
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: "8px",
                            backgroundColor: `${ACCENT}15`,
                            color: ACCENT,
                            height: "fit-content",
                          }}
                        >
                          <Calendar size={16} />
                        </Box>
                        <Box>
                          <Typography
                            sx={{
                              fontSize: "0.8rem",
                              color: colors.textMuted,
                            }}
                          >
                            Created
                          </Typography>
                          <Typography sx={{ fontWeight: 700, color: colors.text }}>
                            {fmtDate(project.created_at)}
                          </Typography>
                        </Box>
                      </Box>
                      <Divider />
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: "8px",
                            backgroundColor: `${WARNING}15`,
                            color: WARNING,
                            height: "fit-content",
                          }}
                        >
                          <Calendar size={16} />
                        </Box>
                        <Box>
                          <Typography
                            sx={{
                              fontSize: "0.8rem",
                              color: colors.textMuted,
                            }}
                          >
                            Due Date
                          </Typography>
                          <Typography sx={{ fontWeight: 700, color: colors.text }}>
                            {fmtDate(project.due) || "No due date"}
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </Box>
                )}
              </>
            ) : (
              // Edit Mode
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
                  Edit Project
                </Typography>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Title"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={4}
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                    }}
                  />
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                    <TextField
                      label="Type"
                      value={form.type}
                      onChange={(e) =>
                        setForm({ ...form, type: e.target.value })
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                      }}
                    />
                    <TextField
                      label="Status"
                      select
                      value={form.status}
                      onChange={(e) =>
                        setForm({ ...form, status: e.target.value })
                      }
                      SelectProps={{
                        native: true,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                      }}
                    >
                      <option value="">Select Status</option>
                      <option value="Submitted">Submitted</option>
                      <option value="Active">Active</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </TextField>
                  </Box>
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                    <TextField
                      label="Priority"
                      select
                      value={form.priority}
                      onChange={(e) =>
                        setForm({ ...form, priority: e.target.value })
                      }
                      SelectProps={{
                        native: true,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                      }}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </TextField>
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
                  </Box>
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                    <TextField
                      label="Country"
                      value={form.country}
                      onChange={(e) =>
                        setForm({ ...form, country: e.target.value })
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                      }}
                    />
                    <TextField
                      label="Region"
                      value={form.region}
                      onChange={(e) =>
                        setForm({ ...form, region: e.target.value })
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                      }}
                    />
                  </Box>
                  <TextField
                    fullWidth
                    label="Tags (comma-separated)"
                    value={form.tags}
                    onChange={(e) =>
                      setForm({ ...form, tags: e.target.value })
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                    }}
                  />
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
                      onClick={() => setEditing(false)}
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
            )}
          </Box>

          {/* Sidebar */}
          <Box>
            <Card
              sx={{
                borderRadius: "16px",
                border: `1px solid ${colors.border}`,
                backgroundColor: colors.bgPanel,
                boxShadow: "none",
                p: 3,
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
                      fontSize: "0.8rem",
                      color: colors.textMuted,
                      mb: 0.5,
                    }}
                  >
                    Current Status
                  </Typography>
                  <StatusBadge status={project.status} />
                </Box>
                <Divider />
                <Box>
                  <Typography
                    sx={{
                      fontSize: "0.8rem",
                      color: colors.textMuted,
                      mb: 0.5,
                    }}
                  >
                    Progress
                  </Typography>
                  <Typography
                    sx={{ fontWeight: 700, color: colors.text, fontSize: "1.3rem" }}
                  >
                    {project.progress || 0}%
                  </Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography
                    sx={{
                      fontSize: "0.8rem",
                      color: colors.textMuted,
                      mb: 0.5,
                    }}
                  >
                    Requested By
                  </Typography>
                  <Typography
                    sx={{ fontWeight: 700, color: colors.text }}
                  >
                    {project.requested_by || "Unknown"}
                  </Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography
                    sx={{
                      fontSize: "0.8rem",
                      color: colors.textMuted,
                      mb: 0.5,
                    }}
                  >
                    Assigned To
                  </Typography>
                  <Typography
                    sx={{ fontWeight: 700, color: colors.text }}
                  >
                    {project.assigned_to || "Unassigned"}
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() =>
          setNotification({ ...notification, open: false })
        }
      >
        <Alert
          severity={notification.severity}
          variant="filled"
          sx={{ borderRadius: "12px" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </PageLayout>
  );
}
