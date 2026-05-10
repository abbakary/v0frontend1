import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../components/DashboardLayout";
import {
  Search,
  Check,
  X,
  Clock,
  RefreshCw,
  TrendingUp,
  Calendar,
  FileIcon,
  HardDrive,
  Download,
  MapPin,
  BadgeCheck,
  CornerDownLeft,
  AlertTriangle,
  Loader,
  Edit3,
  UserPlus,
  History as HistoryIcon,
  Eye,
  Database,
  ArrowLeft,
  Package,
  Shield,
  MessageCircle,
  Hash,
  BarChart2,
  Info,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { useThemeColors } from "../../../utils/useThemeColors";
import { useNavigate } from "react-router-dom";
import { 
  Typography, 
  Card, 
  CardContent, 
  Box, 
  Chip, 
  Stack, 
  Container, 
  Button, 
  Tabs, 
  Tab, 
  Divider,
  Avatar,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";

/* ─── API config ─── */
const BASE_URL = "https://daliportal-api.daligeotech.com";
const TOKEN_KEY = "dali-token";
const getToken = () =>
  localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

const api = {
  get: async (path) => {
    const res = await fetch(`${BASE_URL}${path}`, { headers: authHeaders() });
    if (!res.ok)
      throw Object.assign(new Error(res.statusText), { status: res.status });
    return res.json();
  },
  post: async (path, body) => {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok)
      throw Object.assign(new Error(res.statusText), { status: res.status });
    return res.json();
  },
  put: async (path, body) => {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok)
      throw Object.assign(new Error(res.statusText), { status: res.status });
    return res.json();
  },
};

/* ─── Constants ─── */
const PRIMARY_COLOR = "#61C5C3";
const ACCENT = "#61C5C3";

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

function SideRow({ icon: Icon, label, value, colors }) {
  if (!value) return null;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 1.5,
        py: 1.3,
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <Icon size={13} color={ACCENT} style={{ marginTop: 3, flexShrink: 0 }} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <Typography sx={{ fontSize: "0.78rem", color: colors.textMuted }}>
          {label}
        </Typography>
        <Typography
          sx={{
            fontSize: "0.8rem",
            color: colors.text,
            fontWeight: 600,
            textAlign: "right",
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

const REVIEW_ACTIONS = [
  {
    key: "approved",
    label: "Approve",
    icon: <Check size={16} />,
    style: {
      background: "#FF8C00",
      border: "none",
      color: "#fff",
      boxShadow: "0 4px 10px rgba(255,140,0,0.3)",
    },
    newApprovalStatus: "approved",
    newMarketplaceStatus: "listed",
  },
  {
    key: "rejected",
    label: "Reject",
    icon: <X size={16} />,
    style: {
      background: "#fff",
      border: "1px solid #fed7d7",
      color: "#e53e3e",
    },
    newApprovalStatus: "rejected",
    newMarketplaceStatus: "unlisted",
  },
  {
    key: "returned_for_revision",
    label: "Return for Revision",
    icon: <CornerDownLeft size={16} />,
    style: {
      background: "#fff",
      border: "1px solid #e2e8f0",
      color: "#4a5568",
    },
    newApprovalStatus: "draft",
    newMarketplaceStatus: null,
  },
];

const STATUS_COLORS = {
  approved: { bg: "#dcfce7", text: "#15803d" },
  rejected: { bg: "#fee2e2", text: "#991b1b" },
  pending_review: { bg: "#fef9c3", text: "#854d0e" },
  draft: { bg: "#f3f4f6", text: "#374151" },
  listed: { bg: "#dbeafe", text: "#1d4ed8" },
};

const getStatus = (d) => d.approval_status || d.status || "pending_review";

function timeAgo(dateStr) {
  if (!dateStr) return "—";
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 7 * 86400) return `${Math.floor(diff / 86400)}d ago`;
  if (diff < 30 * 86400) return `${Math.floor(diff / (7 * 86400))}w ago`;
  if (diff < 365 * 86400) return `${Math.floor(diff / (30 * 86400))}mo ago`;
  return `${Math.floor(diff / (365 * 86400))}y ago`;
}

function formatPrice(price, currency, pricingType, discountPrice) {
  if (price == null) return null;
  const curr = currency || "TZS";
  if (pricingType === "free" || price === 0)
    return { label: "Free", color: "#22c55e", original: null };
  const fmt = (v) =>
    `${curr} ${Number(v).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  if (discountPrice != null && discountPrice < price)
    return {
      label: fmt(discountPrice),
      original: fmt(price),
      color: PRIMARY_COLOR,
    };
  return { label: fmt(price), original: null, color: PRIMARY_COLOR };
}

/* ─── Input / Select (simplified) ─── */
const Input = ({ style, ...p }) => (
  <input
    style={{
      background: "#fff",
      border: "1px solid #e2e8f0",
      borderRadius: 10,
      padding: "10px 14px",
      color: "#1a202c",
      fontSize: 14,
      outline: "none",
      transition: "border-color 0.2s",
      ...style,
    }}
    {...p}
  />
);

/* ═══════════════════════════════════════════════════
   DatasetCard (identical to the one in ReviewsPage)
═══════════════════════════════════════════════════ */
function DatasetCard({
  dataset,
  viewType = "grid",
  showStatus = false,
  actionLabel,
  actionStyle,
  onCardClick,
}) {
  const navigate = useNavigate();
  const themeColors = useThemeColors();

  const imageUrl =
    dataset.thumbnail ||
    dataset.image ||
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80";
  const author =
    dataset.owner_user_name || `User #${dataset.owner_user_id}` || "Unknown";
  const licenseType = dataset.license_type || "Public";
  const fileLabel = dataset.file_format || dataset.format || "File";
  const sizeLabel = dataset.file_size_human || dataset.size || "—";
  const downloadsLabel = dataset.total_downloads?.toLocaleString() ?? "0";
  const timeAgoLabel = timeAgo(dataset.updated_at || dataset.created_at);
  const country = dataset.country || dataset.country_code || "—";
  const approvalStatus = getStatus(dataset);
  const cardTags = [
    dataset.subcategory_name,
    dataset.category_name,
    dataset.country,
  ]
    .filter(Boolean)
    .map((t) => t.trim().split(/\s+/)[0])
    .slice(0, 3);
  const licenseColor =
    licenseType?.toLowerCase() === "private"
      ? themeColors.isDarkMode
        ? "#fca5a5"
        : "#b91c1c"
      : licenseType?.toLowerCase() === "restricted"
        ? themeColors.isDarkMode
          ? "#fcd34d"
          : "#b45309"
        : PRIMARY_COLOR;
  const priceInfo = formatPrice(
    dataset.price,
    dataset.currency,
    dataset.pricing_type,
    dataset.discount_price,
  );
  const PriceDisplay = priceInfo ? (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
      {priceInfo.original && (
        <Typography
          sx={{
            fontSize: "0.72rem",
            fontWeight: 500,
            color: themeColors.textMuted,
            textDecoration: "line-through",
          }}
        >
          {priceInfo.original}
        </Typography>
      )}
      <Typography
        sx={{ fontSize: "0.8rem", fontWeight: 700, color: priceInfo.color }}
      >
        {priceInfo.label}
      </Typography>
    </Box>
  ) : null;
  const s = STATUS_COLORS[approvalStatus?.toLowerCase()] || {
    bg: "#f3f4f6",
    text: "#374151",
  };
  const StatusBadgeEl =
    showStatus && approvalStatus ? (
      <Box
        sx={{
          px: 1,
          py: 0.2,
          borderRadius: "5px",
          fontSize: "0.68rem",
          fontWeight: 800,
          backgroundColor: themeColors.isDarkMode ? `${s.text}22` : s.bg,
          color: s.text,
          textTransform: "capitalize",
          letterSpacing: "0.02em",
          border: `1px solid ${themeColors.isDarkMode ? `${s.text}33` : "transparent"}`,
        }}
      >
        {approvalStatus === "pending_review"
          ? "Pending Review"
          : approvalStatus}
      </Box>
    ) : null;
  const DownloadRatePill =
    typeof dataset.total_downloads === "number" &&
    typeof dataset.total_views === "number" &&
    dataset.total_views > 0 ? (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.4,
          backgroundColor: "rgba(22,22,22,0.75)",
          backdropFilter: "blur(4px)",
          px: 1,
          py: 0.5,
          borderRadius: "20px",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <TrendingUp size={12} color="#4ade80" />
        <Typography
          sx={{ fontSize: "0.72rem", fontWeight: 700, color: "#fbbf24" }}
        >
          {Math.round((dataset.total_downloads / dataset.total_views) * 100)}%
        </Typography>
      </Box>
    ) : null;
  const handleOpen = () => {
    if (onCardClick) return onCardClick(dataset);
    navigate(
      dataset.slug
        ? `/dataset-info/${dataset.slug}`
        : `/dataset-info/${dataset.id}`,
      { state: { dataset } },
    );
  };
  const ActionButton = actionLabel ? (
    <Box
      onClick={handleOpen}
      sx={{
        px: 2,
        py: 0.6,
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "0.78rem",
        fontWeight: 700,
        transition: "all .2s",
        "&:hover": { opacity: 0.85 },
        ...actionStyle,
      }}
    >
      {actionLabel}
    </Box>
  ) : null;

  if (viewType === "list") {
    return (
      <Box
        sx={{
          display: "flex",
          gap: 2,
          padding: 2.5,
          backgroundColor: themeColors.card,
          border: `1px solid ${themeColors.border}`,
          borderRadius: "12px",
          transition: "all .3s ease",
          alignItems: "stretch",
          "&:hover": {
            boxShadow: themeColors.isDarkMode
              ? "0 10px 24px rgba(97,197,195,0.2)"
              : "0 10px 24px rgba(97,197,195,0.12)",
            borderColor: PRIMARY_COLOR,
          },
        }}
      >
        <Box sx={{ position: "relative", flexShrink: 0 }}>
          <Box
            onClick={handleOpen}
            sx={{
              width: 100,
              height: 100,
              borderRadius: "8px",
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              cursor: "pointer",
            }}
          />
          {DownloadRatePill && (
            <Box sx={{ position: "absolute", bottom: 6, left: 6 }}>
              {DownloadRatePill}
            </Box>
          )}
        </Box>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minWidth: 0,
          }}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1,
                mb: 0.6,
              }}
            >
              <Typography
                onClick={handleOpen}
                sx={{
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: themeColors.text,
                  cursor: "pointer",
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  "&:hover": { color: PRIMARY_COLOR },
                }}
              >
                {dataset.title}
              </Typography>
              {StatusBadgeEl}
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 0.8,
                color: themeColors.textMuted,
              }}
            >
              <Typography sx={{ fontSize: "0.85rem" }}>{author}</Typography>
              <Box
                sx={{
                  width: 3,
                  height: 3,
                  borderRadius: "50%",
                  backgroundColor: themeColors.border,
                }}
              />
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
                <Calendar size={13} />
                <Typography sx={{ fontSize: "0.8rem" }}>
                  {timeAgoLabel}
                </Typography>
              </Box>
            </Box>
            <Typography sx={{ fontSize: "0.8rem", color: themeColors.text }}>
              Country <b>{country}</b> · {fileLabel} · {sizeLabel} ·{" "}
              {downloadsLabel} downloads
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                fontSize: "0.8rem",
                color: themeColors.textMuted,
              }}
            >
              <BadgeCheck size={14} color={licenseColor} />
              <span>{licenseType}</span>
            </Box>
            {ActionButton || PriceDisplay}
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Card
      sx={{
        borderRadius: "12px",
        overflow: "hidden",
        backgroundColor: themeColors.card,
        border: `1px solid ${themeColors.border}`,
        boxShadow: "none",
        transition: "all .3s ease",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: themeColors.isDarkMode
            ? "0 10px 24px rgba(97,197,195,0.2)"
            : "0 10px 24px rgba(97,197,195,0.12)",
          borderColor: PRIMARY_COLOR,
        },
      }}
    >
      <Box
        sx={{
          height: 130,
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        {DownloadRatePill && (
          <Box sx={{ position: "absolute", top: 10, left: 10 }}>
            {DownloadRatePill}
          </Box>
        )}
        {StatusBadgeEl && (
          <Box sx={{ position: "absolute", top: 10, right: 10 }}>
            {StatusBadgeEl}
          </Box>
        )}
      </Box>
      <CardContent
        sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column" }}
      >
        <Typography
          onClick={handleOpen}
          sx={{
            fontSize: "0.96rem",
            fontWeight: 700,
            lineHeight: 1.4,
            color: themeColors.text,
            cursor: "pointer",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            transition: "color .2s ease",
            mb: 1.5,
            "&:hover": { color: PRIMARY_COLOR },
          }}
        >
          {dataset.title}
        </Typography>
        <Typography
          sx={{
            fontSize: "0.85rem",
            color: themeColors.text,
            fontWeight: 500,
            mb: 1.2,
          }}
        >
          {author}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.8,
            mb: 1.5,
            fontSize: "0.8rem",
            color: themeColors.textMuted,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
            <MapPin size={14} />
            <Typography sx={{ fontSize: "inherit" }}>{country}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
            <Calendar size={14} />
            <Typography sx={{ fontSize: "inherit" }}>{timeAgoLabel}</Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.2,
            mb: 1.5,
            pb: 1.5,
            borderBottom: `1px solid ${themeColors.border}`,
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {[
            { Icon: FileIcon, val: fileLabel },
            { Icon: HardDrive, val: sizeLabel },
            { Icon: Download, val: downloadsLabel },
          ].map(({ Icon, val }, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.6,
                minWidth: 0,
              }}
            >
              {i > 0 && (
                <Box
                  sx={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    backgroundColor: themeColors.border,
                    flexShrink: 0,
                  }}
                />
              )}
              <Icon size={14} color={PRIMARY_COLOR} />
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: themeColors.textMuted,
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {val}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 0.7,
            flexWrap: "nowrap",
            overflow: "hidden",
            mb: 0.6,
          }}
        >
          {cardTags.map((tag, i) => (
            <Chip
              key={`${tag}-${i}`}
              label={tag}
              size="small"
              sx={{
                height: 24,
                borderRadius: "6px",
                fontSize: "0.72rem",
                fontWeight: 600,
                color: themeColors.textMuted,
                backgroundColor: themeColors.isDarkMode
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(15,23,42,0.04)",
                border: "none",
                maxWidth: "33%",
                flexShrink: 1,
                "& .MuiChip-label": {
                  px: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                },
              }}
            />
          ))}
        </Box>
      </CardContent>
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          borderTop: `1px solid ${themeColors.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: themeColors.bgSecondary,
          transition: "all .3s ease",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.6,
            color: themeColors.textMuted,
          }}
        >
          <BadgeCheck size={14} color={licenseColor} />
          <Typography
            sx={{ fontSize: "0.8rem", fontWeight: 600, color: "inherit" }}
          >
            {licenseType}
          </Typography>
        </Box>
        {ActionButton || PriceDisplay}
      </Box>
    </Card>
  );
}

/* ─── Review Logs Panel ─── */
function ReviewLogsPanel({ datasetId }) {
  const themeColors = useThemeColors();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/editor/datasets/${datasetId}/review-logs`)
      .then(setLogs)
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, [datasetId]);

  if (loading)
    return (
      <div
        style={{
          color: themeColors.textMuted,
          fontSize: 13,
          padding: "8px 0",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Loader size={14} style={{ animation: "spin 1s linear infinite" }} />{" "}
        Loading history…
      </div>
    );

  if (!logs.length)
    return (
      <p style={{ fontSize: 13, color: themeColors.textMuted, margin: 0 }}>
        No review history yet.
      </p>
    );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {logs.map((log) => (
        <div
          key={log.id}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            background: themeColors.hoverBg || "#f8fafc",
            border: `1px solid ${themeColors.border || "#edf2f7"}`,
            fontSize: 13,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: log.remarks ? 4 : 0,
            }}
          >
            <span
              style={{
                fontWeight: 800,
                color: "#1a202c",
                textTransform: "capitalize",
              }}
            >
              {log.action.replace(/_/g, " ")}
            </span>
            <span style={{ color: "#718096", fontSize: 12 }}>
              {timeAgo(log.created_at)}
            </span>
          </div>
          {log.previous_status && (
            <span style={{ fontSize: 12, color: "#718096" }}>
              {log.previous_status} → {log.new_status}
            </span>
          )}
          {log.remarks && (
            <p style={{ margin: "4px 0 0", color: "#4a5568", lineHeight: 1.5 }}>
              {log.remarks}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE — Approvals (Pending Reviews Only)
═══════════════════════════════════════════════════ */
export default function ApprovalsPage() {
  const themeColors = useThemeColors();
  const navigate = useNavigate();

  // View state: 'list' or 'detail'
  const [view, setView] = useState("list");
  const [tab, setTab] = useState(0); // 0: Overview, 1: Review, 2: History, 3: Edit Metadata

  const [queueDatasets, setQueueDatasets] = useState([]); // unassigned pending
  const [assignedDatasets, setAssignedDatasets] = useState([]); // assigned to me pending
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState("grid");
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [submitting, setSubmitting] = useState(null);
  const [editingMetadata, setEditingMetadata] = useState(false);
  const [metadataForm, setMetadataForm] = useState({
    title: "",
    summary: "",
    description: "",
    tags: "",
  });

  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showNotification = (message, severity = "success") => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === "clickaway") return;
    setNotification({ ...notification, open: false });
  };

  const allPending = [...queueDatasets, ...assignedDatasets];
  const pendingCount = allPending.length;
  const assignedCount = assignedDatasets.length;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [queueRes, assignedRes] = await Promise.allSettled([
        api.get("/editor/datasets/queue?page=1&page_size=100"),
        api.get("/editor/datasets/assigned?page=1&page_size=100"),
      ]);

      const extractItems = (res) => {
        if (res.status === "fulfilled") {
          if (Array.isArray(res.value)) return res.value;
          if (res.value && Array.isArray(res.value.items)) return res.value.items;
        }
        return [];
      };

      setQueueDatasets(extractItems(queueRes));
      setAssignedDatasets(extractItems(assignedRes));
    } catch (err) {
      setError("Failed to load pending reviews.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const assignDataset = async (dataset) => {
    setSubmitting("assign");
    try {
      await api.post(`/editor/datasets/${dataset.id}/review`, {
        action: "review_started",
        remarks: "Editor started review",
      });
      setQueueDatasets((prev) => prev.filter((d) => d.id !== dataset.id));
      setAssignedDatasets((prev) => [dataset, ...prev]);
      showNotification("Dataset assigned to you successfully!", "success");
    } catch (err) {
      console.error("Assign error:", err);
      showNotification("Could not assign dataset. It may have been taken.", "error");
    } finally {
      setSubmitting(null);
    }
  };

  const submitReview = async (dataset, actionDef) => {
    if (!dataset || submitting) return;
    setSubmitting(actionDef.key);
    try {
      await api.post(`/editor/datasets/${dataset.id}/review`, {
        action: actionDef.key,
        new_approval_status: actionDef.newApprovalStatus,
        new_marketplace_status: actionDef.newMarketplaceStatus ?? undefined,
        remarks: reviewNotes || undefined,
      });
      // Remove from assigned (it's no longer pending)
      setAssignedDatasets((prev) => prev.filter((d) => d.id !== dataset.id));
      setView("list");
      setSelectedDataset(null);
      setReviewNotes("");
      showNotification(`Dataset review ${actionDef.key} successfully!`, "success");
      // Optionally refresh to update counts
      fetchData();
    } catch (err) {
      console.error(`Review action '${actionDef.key}' failed:`, err);
      showNotification(`Failed to ${actionDef.key} dataset: ${err.message}`, "error");
    } finally {
      setSubmitting(null);
    }
  };

  const updateMetadata = async (datasetId) => {
    setSubmitting("metadata");
    try {
      const payload = {
        title: metadataForm.title || undefined,
        summary: metadataForm.summary || undefined,
        description: metadataForm.description || undefined,
        tags: metadataForm.tags
          ? metadataForm.tags.split(",").map((t) => t.trim())
          : undefined,
      };
      await api.put(`/editor/datasets/${datasetId}/metadata`, payload);
      // Update local state
      const updateFn = (list) =>
        list.map((d) =>
          d.id === datasetId
            ? {
                ...d,
                title: metadataForm.title || d.title,
                summary: metadataForm.summary || d.summary,
                description: metadataForm.description || d.description,
                tags: payload.tags || d.tags,
              }
            : d,
        );
      setQueueDatasets(updateFn);
      setAssignedDatasets(updateFn);
      setEditingMetadata(false);
      showNotification("Metadata updated successfully!", "success");
    } catch (err) {
      console.error("Metadata update error:", err);
      showNotification("Failed to update metadata.", "error");
    } finally {
      setSubmitting(null);
    }
  };

  const filtered = allPending.filter(
    (d) =>
      !searchQuery ||
      d.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.owner_user_name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderListView = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {/* Header Section */}
      <Box sx={{ 
        borderBottom: `1px solid ${themeColors.border}`, 
        pb: 4, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between", 
        flexWrap: "wrap", 
        gap: 2 
      }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: themeColors.text, letterSpacing: "-0.02em", mb: 0.5 }}>
            Approvals
          </Typography>
          <Typography sx={{ color: themeColors.textMuted, fontSize: "1.05rem", fontWeight: 500 }}>
            Review and approve pending dataset submissions
          </Typography>
        </Box>
        
        <Stack direction="row" spacing={2} alignItems="center">
          {/* View Toggle */}
          <Box sx={{ 
            display: "flex", 
            bgcolor: themeColors.bgSecondary, 
            borderRadius: "12px", 
            p: 0.6, 
            border: `1px solid ${themeColors.border}` 
          }}>
            {[
              { type: "grid", icon: <TrendingUp size={16} /> },
              { type: "list", icon: <Database size={16} /> },
            ].map((v) => (
              <Button
                key={v.type}
                onClick={() => setViewType(v.type)}
                sx={{
                  minWidth: 44,
                  height: 36,
                  borderRadius: "10px",
                  bgcolor: viewType === v.type ? themeColors.bgPanel : "transparent",
                  color: viewType === v.type ? ACCENT : themeColors.textMuted,
                  boxShadow: viewType === v.type ? "0 2px 8px rgba(0,0,0,0.05)" : "none",
                  "&:hover": { bgcolor: viewType === v.type ? themeColors.bgPanel : "transparent" },
                }}
              >
                {v.icon}
              </Button>
            ))}
          </Box>

          <Button
            variant="outlined"
            startIcon={<RefreshCw size={16} className={loading ? "spin" : ""} />}
            onClick={fetchData}
            disabled={loading}
            sx={{
              borderRadius: "12px",
              borderColor: themeColors.border,
              color: themeColors.text,
              textTransform: "none",
              fontWeight: 700,
              px: 2.5,
              py: 1,
              "&:hover": { borderColor: ACCENT, bgcolor: "transparent" },
            }}
          >
            Refresh
          </Button>
        </Stack>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          variant="outlined"
          action={
            <Button color="inherit" size="small" onClick={fetchData}>
              RETRY
            </Button>
          }
          sx={{ borderRadius: "16px", fontWeight: 600 }}
        >
          {error}
        </Alert>
      )}

      {/* Stats Row */}
      <Box sx={{ 
        display: "grid", 
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, 
        gap: 3 
      }}>
        {[
          {
            label: "Total Pending",
            count: pendingCount,
            icon: Clock,
            accent: "#FF8C00",
            bg: "rgba(255,140,0,0.1)",
          },
          {
            label: "Assigned to You",
            count: assignedCount,
            icon: UserPlus,
            accent: "#20B2AA",
            bg: "rgba(32,178,170,0.1)",
          },
        ].map((s) => (
          <Box
            key={s.label}
            sx={{
              p: 3,
              borderRadius: "24px",
              bgcolor: themeColors.bgPanel,
              border: `1px solid ${themeColors.border}`,
              display: "flex",
              alignItems: "center",
              gap: 2.5,
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": { transform: "translateY(-4px)", boxShadow: "0 12px 24px rgba(0,0,0,0.04)" }
            }}
          >
            <Box sx={{ 
              p: 1.5, 
              borderRadius: "16px", 
              bgcolor: s.bg, 
              color: s.accent,
              display: "flex"
            }}>
              <s.icon size={24} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: "0.75rem", fontWeight: 800, color: themeColors.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {s.label}
              </Typography>
              <Typography sx={{ fontSize: "1.8rem", fontWeight: 900, color: themeColors.text, lineHeight: 1.1 }}>
                {loading ? "..." : s.count}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Search & Filters Area */}
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <TextField
          placeholder="Search by title or author…"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <Search size={18} style={{ marginRight: 12, color: themeColors.textMuted }} />,
            sx: {
              borderRadius: "14px",
              bgcolor: themeColors.bgPanel,
              width: { xs: "100%", md: 400 },
              "& fieldset": { borderColor: themeColors.border },
              "&:hover fieldset": { borderColor: ACCENT },
            }
          }}
        />
      </Box>

      {loading ? (
        <Box sx={{ py: 10, textAlign: "center" }}>
          <Loader className="spin" size={32} color={ACCENT} />
          <Typography sx={{ mt: 2, color: themeColors.textMuted, fontWeight: 600 }}>
            Fetching pending reviews...
          </Typography>
        </Box>
      ) : filtered.length > 0 ? (
        <Box sx={{ 
          display: "grid", 
          gridTemplateColumns: viewType === "grid" 
            ? { xs: "1fr", sm: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" } 
            : "1fr", 
          gap: 3 
        }}>
          {filtered.map((d) => {
            const isAssigned = assignedDatasets.some((a) => a.id === d.id);
            return (
              <Box key={d.id} sx={{ animation: "fadeIn 0.3s ease-out" }}>
                <DatasetCard
                  dataset={d}
                  viewType={viewType}
                  showStatus
                  onCardClick={() => {
                    setSelectedDataset(d);
                    setMetadataForm({
                      title: d.title || "",
                      summary: d.summary || "",
                      description: d.description || "",
                      tags: Array.isArray(d.tags) ? d.tags.join(", ") : (d.tags || ""),
                    });
                    setView("detail");
                  }}
                  actionLabel={isAssigned ? "Review" : "Assign & Review"}
                  actionStyle={{
                    background: ACCENT,
                    color: "#fff",
                    border: "none",
                    fontWeight: 800,
                    borderRadius: "10px"
                  }}
                />
              </Box>
            );
          })}
        </Box>
      ) : (
        <Box sx={{ 
          py: 12, 
          textAlign: "center", 
          bgcolor: themeColors.bgPanel, 
          borderRadius: "32px", 
          border: `1px dashed ${themeColors.border}` 
        }}>
          <Box sx={{ mb: 2, opacity: 0.2 }}>
            <Database size={64} />
          </Box>
          <Typography variant="h6" sx={{ color: themeColors.text, fontWeight: 800 }}>
            No pending reviews found
          </Typography>
          <Typography sx={{ color: themeColors.textMuted }}>
            All caught up! Or try adjusting your search terms.
          </Typography>
        </Box>
      )}
    </Box>
  );

  const renderDetailView = () => {
    if (!selectedDataset) return null;

    const isAssigned = assignedDatasets.some((d) => d.id === selectedDataset.id);
    const status = getStatus(selectedDataset);
    const statusStr = status?.toLowerCase();
    const isPending = statusStr === "pending_review" || statusStr === "pending";
    const statusColor = STATUS_COLORS[status] || { bg: "#f3f4f6", text: "#374151" };
    const d = selectedDataset;

    // Engagement calculation
    const engagement = d.total_views > 0 
      ? ((d.total_downloads / d.total_views) * 100).toFixed(1) 
      : "0.0";

    return (
      <Box sx={{ animation: "fadeIn 0.3s ease-out", pb: 6 }}>
        {/* Detail Header - DatasetInfo style */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowLeft size={14} />}
            onClick={() => {
              setView("list");
              setSelectedDataset(null);
              setTab(0);
            }}
            sx={{
              mb: 3,
              color: ACCENT,
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.85rem",
              px: 0,
              "&:hover": { backgroundColor: "transparent", opacity: 0.8 },
            }}
          >
            Back to List
          </Button>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            <Box sx={{ flex: 1, minWidth: 300 }}>
              <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap", gap: 0.8 }}>
                {d.category_name && (
                  <Chip
                    label={d.category_name}
                    size="small"
                    sx={{
                      height: 22,
                      borderRadius: "5px",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      backgroundColor: `${ACCENT}20`,
                      color: ACCENT,
                    }}
                  />
                )}
                {d.subcategory_name && (
                  <Chip
                    label={d.subcategory_name}
                    size="small"
                    sx={{
                      height: 22,
                      borderRadius: "5px",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      backgroundColor: `${ACCENT}12`,
                      color: ACCENT,
                    }}
                  />
                )}
              </Stack>

              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "1.8rem", md: "2.5rem" },
                  fontWeight: 900,
                  lineHeight: 1.1,
                  color: themeColors.text,
                  mb: 1.5,
                  letterSpacing: "-0.02em",
                }}
              >
                {d.title}
              </Typography>

              <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: "wrap", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar sx={{ width: 24, height: 24, fontSize: "0.7rem", bgcolor: ACCENT }}>
                    {d.owner_user_name?.charAt(0) || "U"}
                  </Avatar>
                  <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: themeColors.text }}>
                    {d.owner_user_name || "Unknown Seller"}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: "0.85rem", color: themeColors.textMuted }}>
                  Updated {timeAgo(d.updated_at || d.created_at)}
                </Typography>
                <Chip
                  label={status.replace("_", " ")}
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    backgroundColor: statusColor.bg,
                    color: statusColor.text,
                    px: 1,
                  }}
                />
              </Stack>
            </Box>

            <Box sx={{ display: "flex", gap: 1.5 }}>
              {!isAssigned && (
                <Button
                  variant="contained"
                  startIcon={<UserPlus size={18} />}
                  onClick={() => assignDataset(d)}
                  disabled={!!submitting}
                  sx={{
                    backgroundColor: "#FF8C00",
                    borderRadius: "12px",
                    px: 3,
                    py: 1.2,
                    fontSize: "0.9rem",
                    fontWeight: 800,
                    textTransform: "none",
                    boxShadow: "0 8px 16px rgba(255,140,0,0.25)",
                    "&:hover": { backgroundColor: "#e67e00" },
                  }}
                >
                  {submitting === "assign" ? "Assigning..." : "Assign to Me"}
                </Button>
              )}
            </Box>
          </Box>
        </Box>

        {/* Stats Row - DatasetInfo style */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
            gap: 2,
            mb: 5,
          }}
        >
          {[
            { label: "Views", value: d.total_views || 0, color: "#3b82f6" },
            { label: "Downloads", value: d.total_downloads || 0, color: "#10b981" },
            { label: "Sales", value: d.total_sales || 0, color: ACCENT },
            { label: "Engagement", value: `${engagement}%`, color: themeColors.text },
          ].map((stat) => (
            <Box
              key={stat.label}
              sx={{
                p: 2.5,
                borderRadius: "16px",
                border: `1px solid ${themeColors.border}`,
                backgroundColor: themeColors.bgPanel,
                boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
              }}
            >
              <Typography sx={{ fontSize: "1.8rem", fontWeight: 900, color: stat.color, lineHeight: 1, mb: 0.5 }}>
                {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
              </Typography>
              <Typography sx={{ fontSize: "0.75rem", fontWeight: 800, color: themeColors.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Tabs and Main Content */}
        <Box sx={{ 
          display: "grid", 
          gridTemplateColumns: tab === 2 ? "1fr" : { xs: "1fr", lg: "1fr 350px" }, 
          gap: 4, 
          alignItems: "start" 
        }}>
          
          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ borderBottom: `1px solid ${themeColors.border}`, mb: 4 }}>
              <Tabs
                value={tab}
                onChange={(e, v) => setTab(v)}
                sx={{
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    minWidth: "auto",
                    mr: 4,
                    px: 0,
                    color: themeColors.textMuted,
                    "&.Mui-selected": { color: ACCENT },
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: ACCENT,
                    height: 3,
                    borderRadius: "3px 3px 0 0",
                  },
                }}
              >
                <Tab label="Overview" />
                {isPending && <Tab label="Review Decision" disabled={!isAssigned} />}
                {isPending && <Tab label="Edit Metadata" disabled={!isAssigned} />}
                <Tab label="Review History" />
              </Tabs>
            </Box>

            {tab === 0 && (
              <Box sx={{ animation: "fadeIn 0.2s ease-out" }}>
                <Box sx={{ mb: 5 }}>
                  <SectionLabel>Summary</SectionLabel>
                  <Typography
                    sx={{
                      fontSize: "1.05rem",
                      lineHeight: 1.6,
                      color: themeColors.text,
                      fontWeight: 500,
                    }}
                  >
                    {d.summary || "No summary provided."}
                  </Typography>
                </Box>

                <Box sx={{ mb: 5 }}>
                  <SectionLabel>Full Description</SectionLabel>
                  <Typography
                    sx={{
                      fontSize: "0.95rem",
                      lineHeight: 1.8,
                      color: themeColors.text,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {d.description || "No description provided."}
                  </Typography>
                </Box>
              </Box>
            )}

            {isPending && tab === 1 && isAssigned && (
              <Box sx={{ animation: "fadeIn 0.2s ease-out" }}>
                <Box sx={{ 
                  p: 4, 
                  borderRadius: "24px", 
                  backgroundColor: themeColors.bgPanel, 
                  border: `1px solid ${themeColors.border}`,
                  boxShadow: "0 10px 40px rgba(0,0,0,0.04)"
                }}>
                  <SectionLabel>Review Decision</SectionLabel>
                  <TextField
                    multiline
                    rows={6}
                    fullWidth
                    placeholder="Enter review notes..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    sx={{
                      mb: 4,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "16px",
                        backgroundColor: themeColors.bgSecondary,
                      },
                    }}
                  />
                  
                  <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap", gap: 2 }}>
                    {REVIEW_ACTIONS.map((action) => (
                      <Button
                        key={action.key}
                        variant={action.key === "approved" ? "contained" : "outlined"}
                        onClick={() => submitReview(d, action)}
                        disabled={!!submitting}
                        startIcon={submitting === action.key ? <Loader size={18} className="spin" /> : action.icon}
                        sx={{
                          flex: 1,
                          minWidth: "160px",
                          py: 1.5,
                          borderRadius: "12px",
                          textTransform: "none",
                          fontWeight: 800,
                          ...(action.key === "approved"
                            ? {
                                backgroundColor: "#FF8C00",
                                "&:hover": { backgroundColor: "#e67e00" },
                              }
                            : {
                                color: action.key === "rejected" ? "#ef4444" : themeColors.text,
                                borderColor: action.key === "rejected" ? "#ef4444" : themeColors.border,
                              }),
                        }}
                      >
                        {submitting === action.key ? "Saving..." : action.label}
                      </Button>
                    ))}
                  </Stack>
                </Box>
              </Box>
            )}

            {isPending && tab === 2 && isAssigned && (
              <Box sx={{ animation: "fadeIn 0.2s ease-out" }}>
                <Box sx={{ 
                  p: { xs: 3, md: 5 }, 
                  borderRadius: "24px", 
                  backgroundColor: themeColors.bgPanel, 
                  border: `1px solid ${themeColors.border}`, 
                  boxShadow: "0 10px 40px rgba(0,0,0,0.04)" 
                }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 5 }}>
                    <SectionLabel>Edit Metadata</SectionLabel>
                  </Box>
                  
                  <Box sx={{ 
                    display: "grid", 
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, 
                    gap: 5, 
                    mb: 6 
                  }}>
                    <Stack spacing={4}>
                      <TextField 
                        label="Title" 
                        fullWidth 
                        variant="outlined"
                        value={metadataForm.title} 
                        onChange={(e) => setMetadataForm({ ...metadataForm, title: e.target.value })} 
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                      />
                      <TextField 
                        label="Summary" 
                        multiline 
                        rows={4} 
                        fullWidth 
                        variant="outlined"
                        value={metadataForm.summary} 
                        onChange={(e) => setMetadataForm({ ...metadataForm, summary: e.target.value })} 
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                      />
                      <TextField 
                        label="Tags (comma separated)" 
                        fullWidth 
                        variant="outlined"
                        value={metadataForm.tags} 
                        onChange={(e) => setMetadataForm({ ...metadataForm, tags: e.target.value })} 
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                      />
                    </Stack>
                    
                    <TextField 
                      label="Full Description" 
                      multiline 
                      rows={14} 
                      fullWidth 
                      variant="outlined"
                      value={metadataForm.description} 
                      onChange={(e) => setMetadataForm({ ...metadataForm, description: e.target.value })} 
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                    />
                  </Box>
                  
                  <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                    <Button 
                      onClick={() => setTab(0)}
                      sx={{ 
                        px: 4, 
                        py: 1.2, 
                        borderRadius: "10px", 
                        textTransform: "none", 
                        fontWeight: 700,
                        color: themeColors.textMuted
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="contained" 
                      onClick={() => updateMetadata(d.id)} 
                      disabled={submitting === "metadata"}
                      sx={{ 
                        px: 4, 
                        py: 1.2, 
                        borderRadius: "10px", 
                        textTransform: "none", 
                        fontWeight: 800,
                        backgroundColor: ACCENT,
                        "&:hover": { backgroundColor: ACCENT, opacity: 0.9 }
                      }}
                    >
                      {submitting === "metadata" ? "Saving..." : "Save Changes"}
                    </Button>
                  </Box>
                </Box>
              </Box>
            )}

            {((!isPending && tab === 1) || (isPending && tab === 3)) && (
              <Box sx={{ animation: "fadeIn 0.2s ease-out" }}>
                <SectionLabel>Recent Activity</SectionLabel>
                <Box sx={{ p: 3, borderRadius: "20px", backgroundColor: themeColors.bgPanel, border: `1px solid ${themeColors.border}` }}><ReviewLogsPanel datasetId={d.id} /></Box>
              </Box>
            )}
          </Box>

          {(!isPending || tab !== 2) && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <Box sx={{ backgroundColor: themeColors.bgPanel, borderRadius: "24px", border: `1px solid ${themeColors.border}`, p: 3 }}>
                <SectionLabel>Dataset Details</SectionLabel>
                <SideRow icon={Database} label="Data type" value={d.data_type} colors={themeColors} />
                <SideRow icon={Package} label="Source type" value={d.source_type} colors={themeColors} />
                <SideRow icon={HardDrive} label="Format" value={d.file_format || d.format} colors={themeColors} />
                <SideRow icon={BarChart2} label="Size" value={d.file_size_human || d.size} colors={themeColors} />
                <SideRow icon={Shield} label="License" value={d.license_type} colors={themeColors} />
                <SideRow icon={MapPin} label="Country" value={d.country} colors={themeColors} />
                <SideRow icon={Hash} label="Version" value={d.version || "1.0.0"} colors={themeColors} />
                <SideRow icon={RefreshCw} label="Updates" value={d.update_frequency} colors={themeColors} />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <DashboardLayout role="editor">
      {view === "list" ? renderListView() : renderDetailView()}

      <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert onClose={handleCloseNotification} severity={notification.severity} variant="filled" sx={{ width: "100%", borderRadius: "12px" }}>{notification.message}</Alert>
      </Snackbar>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </DashboardLayout>
  );
}
