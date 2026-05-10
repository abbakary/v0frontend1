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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Save,
  X,
  Calendar,
  Globe,
  FileText,
  Download,
  Eye,
  AlertCircle,
  CheckCircle2,
  User,
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
  draft: { bg: "#f3f4f6", text: "#374151", label: "Draft" },
  submitted: { bg: "#fef9c3", text: "#854d0e", label: "Submitted" },
  approved: { bg: "#dcfce7", text: "#15803d", label: "Approved" },
  published: { bg: "#dbeafe", text: "#1d4ed8", label: "Published" },
  rejected: { bg: "#fee2e2", text: "#991b1b", label: "Rejected" },
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

export default function ReportInfo() {
  const navigate = useNavigate();
  const { id } = useParams();
  const colors = useThemeColors();

  const [report, setReport] = useState(null);
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
    summary: "",
    description: "",
    report_type: "research",
    author: "",
    publisher: "",
    published_year: new Date().getFullYear(),
    language: "English",
    page_count: 0,
    file_format: "PDF",
    visibility: "public",
    is_downloadable: true,
    approval_status: "draft",
    country: "",
    region: "",
    tags: "",
  });

  useEffect(() => {
    loadReport();
  }, [id]);

  const applyReportToForm = (data) => {
    setReport(data);
    const tagsJoined = Array.isArray(data.tags)
      ? data.tags.join(", ")
      : typeof data.tags === "string"
        ? data.tags
        : "";
    setForm({
      title: data.title || "",
      summary: data.summary || "",
      description: data.description || "",
      report_type: data.report_type || "research",
      author: data.author || data.owner_user_name || "",
      publisher: data.publisher || "",
      published_year: data.published_year || new Date().getFullYear(),
      language: data.language || "English",
      page_count: data.page_count || 0,
      file_format: data.file_format || "PDF",
      visibility: data.visibility || "public",
      is_downloadable: data.is_downloadable !== false,
      approval_status: data.approval_status || "draft",
      country: data.country || "",
      region: data.region || "",
      tags: tagsJoined,
    });
  };

  const loadReport = async () => {
    setLoading(true);
    try {
      const data = await api.get(`/reports/${id}`);
      applyReportToForm(data);
    } catch (err) {
      console.error(err);
      const local = publicMarketplaceStore.getReportById(id);
      if (local) {
        applyReportToForm(local);
      } else {
        showNotification("Failed to load report", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, severity = "success") => {
    setNotification({ open: true, message, severity });
  };

  const handleUpdate = async () => {
    if (!report) return;
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      };
      const catalog = publicMarketplaceStore.getReportById(report.id);
      if (catalog) {
        const tagsArr = payload.tags;
        const updated = publicMarketplaceStore.upsertReport({
          ...catalog,
          title: payload.title,
          summary: payload.summary,
          description: payload.description,
          report_type: payload.report_type,
          owner_user_name: payload.author || catalog.owner_user_name,
          country: payload.country,
          region: payload.region,
          file_format: payload.file_format,
          tags: tagsArr,
        });
        applyReportToForm(updated);
        setEditing(false);
        showNotification("Report listing saved (local catalog).");
        return;
      }
      const updated = await api.put(`/reports/${report.id}`, payload);
      setReport(updated);
      setEditing(false);
      showNotification("Report updated successfully!");
    } catch (err) {
      showNotification(err.message || "Failed to update report", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!report) return;
    if (
      !confirm(
        `Delete report "${report.title}"? This action cannot be undone.`,
      )
    )
      return;

    setSubmitting(true);
    try {
      if (publicMarketplaceStore.getReportById(report.id)) {
        publicMarketplaceStore.deleteReport(report.id);
        showNotification("Report listing removed from catalog.");
        setTimeout(() => navigate("/public/reports"), 1200);
        return;
      }
      await api.delete(`/reports/${report.id}`);
      showNotification("Report deleted successfully!");
      setTimeout(() => navigate("/public/reports"), 2000);
    } catch (err) {
      showNotification(err.message || "Failed to delete report", "error");
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
            Loading report details...
          </Typography>
        </Box>
      </PageLayout>
    );
  }

  if (!report) {
    return (
      <PageLayout>
        <Box sx={{ py: 10, textAlign: "center" }}>
          <Typography
            variant="h5"
            sx={{ color: colors.text, fontWeight: 700, mb: 2 }}
          >
            Report Not Found
          </Typography>
          <Button
            startIcon={<ArrowLeft size={16} />}
            onClick={() => navigate("/public/reports")}
            sx={{ color: ACCENT, fontWeight: 700 }}
          >
            Back to Reports
          </Button>
        </Box>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Helmet>
        <title>{report.title || "Report"} - Dali Portal</title>
        <meta
          name="description"
          content={report.summary || report.description || "Report details"}
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
            onClick={() => navigate("/public/reports")}
            sx={{
              color: ACCENT,
              fontWeight: 700,
              textTransform: "none",
              px: 0,
              "&:hover": { backgroundColor: "transparent", opacity: 0.8 },
            }}
          >
            Back to Reports
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
                      label={report.report_type || "Report"}
                      size="small"
                      sx={{
                        backgroundColor: `${ACCENT}20`,
                        color: ACCENT,
                        fontWeight: 700,
                        fontSize: "0.75rem",
                      }}
                    />
                    <StatusBadge status={report.approval_status} />
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
                    {report.title}
                  </Typography>
                  {report.summary && (
                    <Typography
                      sx={{
                        color: colors.textMuted,
                        fontSize: "1rem",
                        lineHeight: 1.6,
                        fontStyle: "italic",
                        mb: 2,
                      }}
                    >
                      {report.summary}
                    </Typography>
                  )}
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
                    <Tab label="Metadata" />
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
                      Report Description
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
                        {report.description ||
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
                      Report Information
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: 2,
                      }}
                    >
                      {[
                        {
                          icon: FileText,
                          label: "Type",
                          value: report.report_type || "—",
                        },
                        {
                          icon: User,
                          label: "Author",
                          value: report.author || "—",
                        },
                        {
                          icon: User,
                          label: "Publisher",
                          value: report.publisher || "—",
                        },
                        {
                          icon: Calendar,
                          label: "Published Year",
                          value: report.published_year || "—",
                        },
                        {
                          icon: FileText,
                          label: "Language",
                          value: report.language || "—",
                        },
                        {
                          icon: AlertCircle,
                          label: "Pages",
                          value: fmtNum(report.page_count),
                        },
                        {
                          icon: FileText,
                          label: "Format",
                          value: report.file_format || "—",
                        },
                        {
                          icon: Eye,
                          label: "Visibility",
                          value: report.visibility || "—",
                        },
                        {
                          icon: Globe,
                          label: "Country",
                          value: report.country || "—",
                        },
                        {
                          icon: Globe,
                          label: "Region",
                          value: report.region || "—",
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
                      Report Statistics
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: 2,
                      }}
                    >
                      {[
                        {
                          label: "Total Views",
                          value: fmtNum(report.total_views),
                        },
                        {
                          label: "Total Downloads",
                          value: fmtNum(report.total_downloads),
                        },
                        {
                          label: "Total Sales",
                          value: fmtNum(report.total_sales),
                        },
                        {
                          label: "Is Downloadable",
                          value: report.is_downloadable ? "Yes" : "No",
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
                          <CardContent sx={{ p: 2 }}>
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
                                color: ACCENT,
                                fontSize: "1.4rem",
                              }}
                            >
                              {item.value}
                            </Typography>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>

                    {/* Tags */}
                    {report.tags && report.tags.length > 0 && (
                      <Box sx={{ mt: 3 }}>
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
                          Tags
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                          {(Array.isArray(report.tags)
                            ? report.tags
                            : report.tags.split(",")
                          ).map((tag, idx) => (
                            <Chip
                              key={idx}
                              label={tag.trim()}
                              sx={{
                                backgroundColor: `${ACCENT}20`,
                                color: ACCENT,
                                fontWeight: 600,
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
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
                  Edit Report
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
                    label="Summary"
                    multiline
                    rows={2}
                    value={form.summary}
                    onChange={(e) =>
                      setForm({ ...form, summary: e.target.value })
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
                      label="Report Type"
                      select
                      value={form.report_type}
                      onChange={(e) =>
                        setForm({ ...form, report_type: e.target.value })
                      }
                      SelectProps={{
                        native: true,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                      }}
                    >
                      <option value="research">Research</option>
                      <option value="analysis">Analysis</option>
                      <option value="whitepaper">Whitepaper</option>
                      <option value="case_study">Case Study</option>
                    </TextField>
                    <TextField
                      label="Status"
                      select
                      value={form.approval_status}
                      onChange={(e) =>
                        setForm({ ...form, approval_status: e.target.value })
                      }
                      SelectProps={{
                        native: true,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                      }}
                    >
                      <option value="draft">Draft</option>
                      <option value="submitted">Submitted</option>
                      <option value="approved">Approved</option>
                      <option value="published">Published</option>
                    </TextField>
                  </Box>
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                    <TextField
                      label="Author"
                      value={form.author}
                      onChange={(e) =>
                        setForm({ ...form, author: e.target.value })
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                      }}
                    />
                    <TextField
                      label="Publisher"
                      value={form.publisher}
                      onChange={(e) =>
                        setForm({ ...form, publisher: e.target.value })
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                      }}
                    />
                  </Box>
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                    <TextField
                      label="Published Year"
                      type="number"
                      inputProps={{ min: 1900, max: 2099 }}
                      value={form.published_year}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          published_year: parseInt(e.target.value),
                        })
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                      }}
                    />
                    <TextField
                      label="Language"
                      value={form.language}
                      onChange={(e) =>
                        setForm({ ...form, language: e.target.value })
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                      }}
                    />
                  </Box>
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                    <TextField
                      label="Page Count"
                      type="number"
                      inputProps={{ min: 0 }}
                      value={form.page_count}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          page_count: parseInt(e.target.value),
                        })
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                      }}
                    />
                    <TextField
                      label="File Format"
                      value={form.file_format}
                      onChange={(e) =>
                        setForm({ ...form, file_format: e.target.value })
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
                Report Summary
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
                    Type
                  </Typography>
                  <Typography
                    sx={{ fontWeight: 700, color: colors.text }}
                  >
                    {report.report_type || "—"}
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
                  <StatusBadge status={report.approval_status} />
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
                    Views
                  </Typography>
                  <Typography
                    sx={{ fontWeight: 700, color: colors.text }}
                  >
                    {fmtNum(report.total_views)}
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
                    Downloads
                  </Typography>
                  <Typography
                    sx={{ fontWeight: 700, color: colors.text }}
                  >
                    {fmtNum(report.total_downloads)}
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
