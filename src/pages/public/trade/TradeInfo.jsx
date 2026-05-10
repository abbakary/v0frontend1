import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Button,
  Divider,
  Stack,
  Tab,
  Tabs,
  Typography,
  Chip,
  CircularProgress,
  TextField,
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
  Truck,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useState, useEffect } from "react";
import PageLayout from "../components/PageLayout";
import { useThemeColors } from "../../../utils/useThemeColors";
import publicMarketplaceStore from "../../../utils/publicMarketplaceStore";

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
  active: { bg: "#dcfce7", text: "#15803d", label: "Active" },
  pending: { bg: "#fef9c3", text: "#854d0e", label: "Pending" },
  inactive: { bg: "#f3f4f6", text: "#374151", label: "Inactive" },
  completed: { bg: "#dbeafe", text: "#1d4ed8", label: "Completed" },
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

function fmtCurrency(amount, currency = "USD") {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export default function TradeInfo() {
  const navigate = useNavigate();
  const { id } = useParams();
  const colors = useThemeColors();

  const [trade, setTrade] = useState(null);
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
    type: "Export",
    status: "Active",
    sector: "",
    partner: "",
    transport: "",
    currency: "USD",
    value: 0,
    volume: "",
    growth: 0,
    country: "",
    region: "",
    tags: "",
  });

  useEffect(() => {
    loadTrade();
  }, [id]);

  const applyTradeToForm = (data) => {
    setTrade(data);
    const tagStr = Array.isArray(data.tags)
      ? data.tags.join(", ")
      : (data.tags || "").toString();
    setForm({
      title: data.title || "",
      description: data.description || "",
      type: data.type || "Export",
      status: data.status || "Active",
      sector: data.sector || data.category_name || "",
      partner: data.partner || "",
      transport: data.transport || "",
      currency: data.currency || "USD",
      value: data.value || 0,
      volume: data.volume || "",
      growth: data.growth ?? 0,
      country: data.country || "",
      region: data.region || "",
      tags: tagStr,
    });
  };

  const loadTrade = async () => {
    setLoading(true);
    try {
      const data = await api.get(`/trades/${id}`);
      applyTradeToForm(data);
    } catch (err) {
      console.error(err);
      const local = publicMarketplaceStore.getTradeById(id);
      if (local) {
        applyTradeToForm(local);
      } else {
        showNotification("Failed to load trade details", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, severity = "success") => {
    setNotification({ open: true, message, severity });
  };

  const handleUpdate = async () => {
    if (!trade) return;
    setSubmitting(true);
    try {
      const catalog = publicMarketplaceStore.getTradeById(trade.id);
      if (catalog) {
        const tagsArr = String(form.tags || "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
        const updated = publicMarketplaceStore.upsertTrade({
          ...catalog,
          title: form.title,
          description: form.description,
          type: form.type,
          status: form.status,
          sector: form.sector,
          category_name: form.sector || catalog.category_name,
          partner: form.partner,
          transport: form.transport,
          currency: form.currency,
          value: Number(form.value) || 0,
          volume: form.volume,
          growth: Number(form.growth) || 0,
          country: form.country,
          region: form.region,
          tags: tagsArr,
        });
        applyTradeToForm(updated);
        setEditing(false);
        showNotification("Trade listing saved (local catalog).");
        return;
      }
      const updated = await api.put(`/trades/${trade.id}`, form);
      setTrade(updated);
      setEditing(false);
      showNotification("Trade updated successfully!");
    } catch (err) {
      showNotification(err.message || "Failed to update trade", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!trade) return;
    if (
      !confirm(
        `Delete trade "${trade.title}"? This action cannot be undone.`,
      )
    )
      return;

    setSubmitting(true);
    try {
      if (publicMarketplaceStore.getTradeById(trade.id)) {
        publicMarketplaceStore.deleteTrade(trade.id);
        showNotification("Trade listing removed from catalog.");
        setTimeout(() => navigate("/public/trade"), 1200);
        return;
      }
      await api.delete(`/trades/${trade.id}`);
      showNotification("Trade deleted successfully!");
      setTimeout(() => navigate("/public/trade"), 2000);
    } catch (err) {
      showNotification(err.message || "Failed to delete trade", "error");
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
            Loading trade details...
          </Typography>
        </Box>
      </PageLayout>
    );
  }

  if (!trade) {
    return (
      <PageLayout>
        <Box sx={{ py: 10, textAlign: "center" }}>
          <Typography
            variant="h5"
            sx={{ color: colors.text, fontWeight: 700, mb: 2 }}
          >
            Trade Not Found
          </Typography>
          <Button
            startIcon={<ArrowLeft size={16} />}
            onClick={() => navigate("/public/trade")}
            sx={{ color: ACCENT, fontWeight: 700 }}
          >
            Back to Trades
          </Button>
        </Box>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Helmet>
        <title>{trade.title || "Trade"} - Dali Portal</title>
        <meta
          name="description"
          content={trade.description || "Trade details"}
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
            onClick={() => navigate("/public/trade")}
            sx={{
              color: ACCENT,
              fontWeight: 700,
              textTransform: "none",
              px: 0,
              "&:hover": { backgroundColor: "transparent", opacity: 0.8 },
            }}
          >
            Back to Trades
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
                      label={trade.type || "Trade"}
                      size="small"
                      sx={{
                        backgroundColor: `${ACCENT}20`,
                        color: ACCENT,
                        fontWeight: 700,
                        fontSize: "0.75rem",
                      }}
                    />
                    <StatusBadge status={trade.status} />
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
                    {trade.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: colors.textMuted,
                      fontSize: "1rem",
                      lineHeight: 1.6,
                    }}
                  >
                    {trade.description}
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
                    <Tab label="Trade Details" />
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
                      Trade Summary
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
                        {trade.description ||
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
                      Trade Information
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
                          icon: Truck,
                          label: "Type",
                          value: trade.type || "—",
                        },
                        {
                          icon: CheckCircle2,
                          label: "Status",
                          value: trade.status || "—",
                        },
                        {
                          icon: AlertCircle,
                          label: "Sector",
                          value: trade.sector || "—",
                        },
                        {
                          icon: AlertCircle,
                          label: "Partner",
                          value: trade.partner || "—",
                        },
                        {
                          icon: Truck,
                          label: "Transport",
                          value: trade.transport || "—",
                        },
                        {
                          icon: Globe,
                          label: "Country",
                          value: trade.country || "—",
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

                    {/* Trade Value */}
                    <Box
                      sx={{
                        p: 3,
                        backgroundColor: colors.bgPanel,
                        borderRadius: "16px",
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          sx={{
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            color: colors.text,
                            mb: 0.5,
                          }}
                        >
                          Trade Value
                        </Typography>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: ACCENT,
                            fontSize: "1.8rem",
                          }}
                        >
                          {fmtCurrency(trade.value, trade.currency)}
                        </Typography>
                      </Box>
                      <Divider sx={{ my: 2 }} />
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          sx={{
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            color: colors.text,
                            mb: 0.5,
                          }}
                        >
                          Volume: {trade.volume || "—"}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            color: colors.text,
                            mb: 0.5,
                          }}
                        >
                          Growth: {trade.growth}%
                        </Typography>
                      </Box>
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
                            Start Date
                          </Typography>
                          <Typography sx={{ fontWeight: 700, color: colors.text }}>
                            {fmtDate(trade.start_date) || "No date"}
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
                            {fmtDate(trade.end_date) || "No date"}
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
                  Edit Trade
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
                      select
                      value={form.type}
                      onChange={(e) =>
                        setForm({ ...form, type: e.target.value })
                      }
                      SelectProps={{
                        native: true,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                      }}
                    >
                      <option value="Export">Export</option>
                      <option value="Import">Import</option>
                    </TextField>
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
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Inactive">Inactive</option>
                    </TextField>
                  </Box>
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                    <TextField
                      label="Sector"
                      value={form.sector}
                      onChange={(e) =>
                        setForm({ ...form, sector: e.target.value })
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                      }}
                    />
                    <TextField
                      label="Partner"
                      value={form.partner}
                      onChange={(e) =>
                        setForm({ ...form, partner: e.target.value })
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                      }}
                    />
                  </Box>
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                    <TextField
                      label="Transport"
                      value={form.transport}
                      onChange={(e) =>
                        setForm({ ...form, transport: e.target.value })
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                      }}
                    />
                    <TextField
                      label="Currency"
                      value={form.currency}
                      onChange={(e) =>
                        setForm({ ...form, currency: e.target.value })
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                      }}
                    />
                  </Box>
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                    <TextField
                      label="Trade Value"
                      type="number"
                      inputProps={{ step: "0.01", min: 0 }}
                      value={form.value}
                      onChange={(e) =>
                        setForm({ ...form, value: parseFloat(e.target.value) })
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                      }}
                    />
                    <TextField
                      label="Growth (%)"
                      type="number"
                      inputProps={{ step: "0.1", min: 0 }}
                      value={form.growth}
                      onChange={(e) =>
                        setForm({ ...form, growth: parseFloat(e.target.value) })
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
                Trade Summary
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
                    Trade Value
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: ACCENT,
                      fontSize: "1.4rem",
                    }}
                  >
                    {fmtCurrency(trade.value, trade.currency)}
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
                    Type
                  </Typography>
                  <Typography
                    sx={{ fontWeight: 700, color: colors.text }}
                  >
                    {trade.type || "—"}
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
                  <StatusBadge status={trade.status} />
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
                    Growth Rate
                  </Typography>
                  <Typography
                    sx={{ fontWeight: 700, color: colors.text }}
                  >
                    {trade.growth}%
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
