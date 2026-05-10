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
  LinearProgress,
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
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
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
  pledged: { bg: "#fef9c3", text: "#854d0e", label: "Pledged" },
  active: { bg: "#dcfce7", text: "#15803d", label: "Active" },
  disbursed: { bg: "#dbeafe", text: "#1d4ed8", label: "Disbursed" },
  completed: { bg: "#f0fdf4", text: "#166534", label: "Completed" },
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

function fmtCurrency(amount, currency = "USD") {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export default function FundInfo() {
  const navigate = useNavigate();
  const { id } = useParams();
  const colors = useThemeColors();

  const [fund, setFund] = useState(null);
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
    status: "Pledged",
    donor: "",
    manager: "",
    total_amount: 0,
    disbursed: 0,
    country: "",
    region: "",
    tags: "",
  });

  useEffect(() => {
    loadFund();
  }, [id]);

  const loadFund = async () => {
    setLoading(true);
    try {
      const data = await api.get(`/funds/${id}`);
      setFund(data);
      setForm({
        title: data.title || "",
        description: data.description || "",
        type: data.type || "",
        status: data.status || "Pledged",
        donor: data.donor || "",
        manager: data.manager || "",
        total_amount: data.total_amount || 0,
        disbursed: data.disbursed || 0,
        country: data.country || "",
        region: data.region || "",
        tags: (data.tags || "").toString(),
      });
    } catch (err) {
      showNotification("Failed to load fund", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, severity = "success") => {
    setNotification({ open: true, message, severity });
  };

  const handleUpdate = async () => {
    if (!fund) return;
    setSubmitting(true);
    try {
      const updated = await api.put(`/funds/${fund.id}`, form);
      setFund(updated);
      setEditing(false);
      showNotification("Fund updated successfully!");
    } catch (err) {
      showNotification(err.message || "Failed to update fund", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!fund) return;
    if (
      !confirm(
        `Delete fund "${fund.title}"? This action cannot be undone.`,
      )
    )
      return;

    setSubmitting(true);
    try {
      await api.delete(`/funds/${fund.id}`);
      showNotification("Fund deleted successfully!");
      setTimeout(() => navigate("/public/funds"), 2000);
    } catch (err) {
      showNotification(err.message || "Failed to delete fund", "error");
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
            Loading fund details...
          </Typography>
        </Box>
      </PageLayout>
    );
  }

  if (!fund) {
    return (
      <PageLayout>
        <Box sx={{ py: 10, textAlign: "center" }}>
          <Typography
            variant="h5"
            sx={{ color: colors.text, fontWeight: 700, mb: 2 }}
          >
            Fund Not Found
          </Typography>
          <Button
            startIcon={<ArrowLeft size={16} />}
            onClick={() => navigate("/public/funds")}
            sx={{ color: ACCENT, fontWeight: 700 }}
          >
            Back to Funds
          </Button>
        </Box>
      </PageLayout>
    );
  }

  const disbursementPercent = fund.total_amount
    ? Math.round((fund.disbursed / fund.total_amount) * 100)
    : 0;
  const remaining = (fund.total_amount || 0) - (fund.disbursed || 0);

  return (
    <PageLayout>
      <Helmet>
        <title>{fund.title || "Fund"} - Dali Portal</title>
        <meta
          name="description"
          content={fund.description || "Fund details"}
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
            onClick={() => navigate("/public/funds")}
            sx={{
              color: ACCENT,
              fontWeight: 700,
              textTransform: "none",
              px: 0,
              "&:hover": { backgroundColor: "transparent", opacity: 0.8 },
            }}
          >
            Back to Funds
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
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 350px" },
            gap: 4,
          }}
        >
          <Box>
            {!editing ? (
              <>
                <Box sx={{ mb: 3 }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip
                      label={fund.type || "Fund"}
                      size="small"
                      sx={{
                        backgroundColor: `${ACCENT}20`,
                        color: ACCENT,
                        fontWeight: 700,
                        fontSize: "0.75rem",
                      }}
                    />
                    <StatusBadge status={fund.status} />
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
                    {fund.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: colors.textMuted,
                      fontSize: "1rem",
                      lineHeight: 1.6,
                    }}
                  >
                    {fund.description}
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
                    <Tab label="Financial Details" />
                    <Tab label="Timeline" />
                  </Tabs>
                </Box>

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
                      Fund Summary
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
                        {fund.description ||
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
                      Financial Information
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: 2,
                        mb: 4,
                      }}
                    >
                      {[
                        {
                          icon: DollarSign,
                          label: "Total Amount",
                          value: fmtCurrency(fund.total_amount),
                        },
                        {
                          icon: TrendingUp,
                          label: "Disbursed",
                          value: fmtCurrency(fund.disbursed),
                        },
                        {
                          icon: AlertCircle,
                          label: "Remaining",
                          value: fmtCurrency(remaining),
                        },
                        {
                          icon: CheckCircle2,
                          label: "Status",
                          value: fund.status || "—",
                        },
                        {
                          icon: User,
                          label: "Donor",
                          value: fund.donor || "—",
                        },
                        {
                          icon: User,
                          label: "Manager",
                          value: fund.manager || "—",
                        },
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
                                {item.value}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>

                    {/* Disbursement Progress */}
                    <Box
                      sx={{
                        p: 3,
                        backgroundColor: colors.bgPanel,
                        borderRadius: "16px",
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1.5,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            color: colors.text,
                          }}
                        >
                          Disbursement Progress
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            color: ACCENT,
                          }}
                        >
                          {disbursementPercent}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={disbursementPercent}
                        sx={{
                          height: 8,
                          borderRadius: "4px",
                          backgroundColor: `${ACCENT}20`,
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: ACCENT,
                          },
                        }}
                      />
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
                            {fmtDate(fund.created_at)}
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
                            End Date
                          </Typography>
                          <Typography sx={{ fontWeight: 700, color: colors.text }}>
                            {fmtDate(fund.end_date) || "No end date"}
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
                  Edit Fund
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
                      <option value="Pledged">Pledged</option>
                      <option value="Active">Active</option>
                      <option value="Disbursed">Disbursed</option>
                      <option value="Completed">Completed</option>
                    </TextField>
                  </Box>
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                    <TextField
                      label="Donor"
                      value={form.donor}
                      onChange={(e) =>
                        setForm({ ...form, donor: e.target.value })
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                      }}
                    />
                    <TextField
                      label="Manager"
                      value={form.manager}
                      onChange={(e) =>
                        setForm({ ...form, manager: e.target.value })
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                      }}
                    />
                  </Box>
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                    <TextField
                      label="Total Amount"
                      type="number"
                      inputProps={{ step: "0.01", min: 0 }}
                      value={form.total_amount}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          total_amount: parseFloat(e.target.value),
                        })
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                      }}
                    />
                    <TextField
                      label="Disbursed Amount"
                      type="number"
                      inputProps={{ step: "0.01", min: 0 }}
                      value={form.disbursed}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          disbursed: parseFloat(e.target.value),
                        })
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
                Fund Summary
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
                    Total Amount
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: ACCENT,
                      fontSize: "1.4rem",
                    }}
                  >
                    {fmtCurrency(fund.total_amount)}
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
                    Disbursement
                  </Typography>
                  <Typography
                    sx={{ fontWeight: 700, color: colors.text, fontSize: "1.2rem" }}
                  >
                    {fmtCurrency(fund.disbursed)} ({disbursementPercent}%)
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
                    Remaining
                  </Typography>
                  <Typography
                    sx={{ fontWeight: 700, color: colors.text }}
                  >
                    {fmtCurrency(remaining)}
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
                    Status
                  </Typography>
                  <StatusBadge status={fund.status} />
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
