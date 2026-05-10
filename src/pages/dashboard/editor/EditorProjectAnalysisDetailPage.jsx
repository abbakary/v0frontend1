import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Avatar,
  alpha,
} from "@mui/material";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  FileText,
  User,
  Users,
  Briefcase,
  Save,
  Edit3,
  Database,
  Link2,
  Layers,
  Target,
  ClipboardList,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useThemeColors } from "../../../utils/useThemeColors";
import projectRequestService from "../../../utils/projectRequestService";

const PRIMARY = "#FF8C00";
const ACCENT = "#61C5C3";

const HERO_FALLBACK =
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80";

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
  if (value == null || value === "") return null;
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
        <Typography sx={{ fontSize: "0.78rem", color: colors.textMuted }}>{label}</Typography>
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

const STATUS_OPTIONS = ["PENDING", "BIDDING", "ACCEPTED", "IN_PROGRESS", "COMPLETED", "REJECTED"];

export default function EditorProjectAnalysisDetailPage() {
  const { analysisId } = useParams();
  const navigate = useNavigate();
  const colors = useThemeColors();

  const [tab, setTab] = useState(0);
  const [dataVersion, setDataVersion] = useState(0);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  const [mgmt, setMgmt] = useState({
    title: "",
    description: "",
    category: "",
    dataType: "",
    datasetSize: "",
    budgetMin: "",
    budgetMax: "",
    deadline: "",
    priorityLevel: "Medium",
    sourcePreference: "",
    attachmentUrl: "",
    preferredCollaborator: "",
    buyerName: "",
    buyerId: "",
    status: "PENDING",
    editorWorkspaceNotes: "",
    openToSuggestions: "true",
  });

  const raw = useMemo(
    () => projectRequestService.getRequestById(analysisId),
    [analysisId, dataVersion],
  );

  const syncFormFromRaw = useCallback((r) => {
    if (!r) return;
    setMgmt({
      title: r.title || "",
      description: r.description || "",
      category: r.category || "",
      dataType: r.dataType || "",
      datasetSize: r.datasetSize || "",
      budgetMin: r.budgetMin != null ? String(r.budgetMin) : "",
      budgetMax: r.budgetMax != null ? String(r.budgetMax) : "",
      deadline: r.deadline || "",
      priorityLevel: r.priorityLevel || "Medium",
      sourcePreference: r.sourcePreference || "",
      attachmentUrl: r.attachmentUrl || "",
      preferredCollaborator: r.preferredCollaborator || "",
      buyerName: r.buyerName || "",
      buyerId: r.buyerId != null ? String(r.buyerId) : "",
      status: r.status || "PENDING",
      editorWorkspaceNotes: r.editorWorkspaceNotes || "",
      openToSuggestions: r.openToSuggestions !== false ? "true" : "false",
    });
  }, []);

  useEffect(() => {
    syncFormFromRaw(raw);
  }, [raw, syncFormFromRaw]);

  const reportLike = useMemo(() => {
    if (!raw) return null;
    const acceptedBid = raw.bids?.find((b) => b.status === "ACCEPTED");
    const midBudget = ((Number(raw.budgetMin) || 0) + (Number(raw.budgetMax) || 0)) / 2;
    const summary =
      (raw.description || "").replace(/\s+/g, " ").trim().slice(0, 280) +
      ((raw.description || "").length > 280 ? "…" : "");
    return {
      title: raw.title,
      summary,
      category: raw.category,
      buyerName: raw.buyerName,
      buyerAvatar: raw.buyerAvatar,
      status: raw.status,
      budgetMid: acceptedBid ? acceptedBid.price : midBudget,
      collaborator: acceptedBid?.collaboratorName || "Unassigned",
      bidsCount: raw.bids?.length || 0,
      deadline: raw.deadline,
      dataType: raw.dataType,
      priorityLevel: raw.priorityLevel,
      datasetSize: raw.datasetSize,
      createdAt: raw.createdAt,
    };
  }, [raw]);

  const persistManagement = () => {
    if (!raw) return;
    try {
      projectRequestService.patchRequest(raw.id, {
        title: mgmt.title.trim(),
        description: mgmt.description.trim(),
        category: mgmt.category.trim(),
        dataType: mgmt.dataType.trim(),
        datasetSize: mgmt.datasetSize.trim(),
        budgetMin: Number(mgmt.budgetMin) || 0,
        budgetMax: Number(mgmt.budgetMax) || 0,
        deadline: mgmt.deadline.trim(),
        priorityLevel: mgmt.priorityLevel,
        sourcePreference: mgmt.sourcePreference.trim(),
        attachmentUrl: mgmt.attachmentUrl.trim(),
        preferredCollaborator: mgmt.preferredCollaborator.trim(),
        buyerName: mgmt.buyerName.trim(),
        buyerId: mgmt.buyerId.trim(),
        status: mgmt.status,
        editorWorkspaceNotes: mgmt.editorWorkspaceNotes,
        openToSuggestions: mgmt.openToSuggestions === "true",
      });
      setDataVersion((v) => v + 1);
      setSnack({ open: true, message: "Project analysis updated.", severity: "success" });
    } catch (e) {
      setSnack({ open: true, message: e.message || "Save failed", severity: "error" });
    }
  };

  if (!raw || !reportLike) {
    return (
      <DashboardLayout role="editor">
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography sx={{ fontWeight: 800, mb: 2 }}>Analysis not found</Typography>
          <Button
            startIcon={<ArrowLeft size={16} />}
            onClick={() => navigate("/dashboard/editor/reports")}
            sx={{ textTransform: "none", fontWeight: 700, color: ACCENT }}
          >
            Back to Analysis Reports
          </Button>
        </Container>
      </DashboardLayout>
    );
  }

  const statusColors = {
    PENDING: { bg: "#fffbeb", color: "#b45309", label: "Pending" },
    BIDDING: { bg: "#e6f7f6", color: "#0f766e", label: "Requesting" },
    ACCEPTED: { bg: "#f0fdf4", color: "#15803d", label: "Active" },
    IN_PROGRESS: { bg: "#e6f0ff", color: "#1d4ed8", label: "In progress" },
    COMPLETED: { bg: "#ecfdf5", color: "#047857", label: "Completed" },
    REJECTED: { bg: "#fef2f2", color: "#b91c1c", label: "Rejected" },
  };
  const sc = statusColors[raw.status] || {
    bg: colors.bgSecondary,
    color: colors.text,
    label: raw.status,
  };

  const thumb = reportLike.buyerAvatar || HERO_FALLBACK;
  const createdLabel = raw.createdAt
    ? new Date(raw.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  const statPills = [
    {
      label: "Budget span",
      value: `$${Number(raw.budgetMin || 0).toLocaleString()} – $${Number(raw.budgetMax || 0).toLocaleString()}`,
      c: PRIMARY,
    },
    {
      label: "Bids",
      value: String(reportLike.bidsCount),
      c: ACCENT,
    },
    {
      label: "Deadline",
      value: reportLike.deadline ? new Date(reportLike.deadline).toLocaleDateString() : "—",
      c: "#2563eb",
    },
    {
      label: "Created",
      value: createdLabel,
      c: colors.text,
    },
  ];

  return (
    <DashboardLayout role="editor">
      <Box sx={{ minHeight: "100%", bgcolor: colors.bg }}>
        {/* —— Hero (DatasetInfo-style) —— */}
        <Box sx={{ position: "relative", overflow: "hidden" }}>
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${thumb})`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
              filter: "brightness(0.22) saturate(0.55)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(to bottom, transparent 0%, ${colors.bg} 100%)`,
            }}
          />

          <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, pt: { xs: 2, md: 3 }, pb: 4 }}>
            <Button
              startIcon={<ArrowLeft size={14} />}
              onClick={() => navigate("/dashboard/editor/reports")}
              sx={{
                mb: 3,
                color: "rgba(255,255,255,0.75)",
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.8rem",
                px: 0,
                "&:hover": { bgcolor: "transparent", color: "#fff" },
              }}
            >
              Back to Analysis Reports
            </Button>

            <Box
              sx={{
                display: "flex",
                gap: { xs: 2, md: 4 },
                alignItems: "flex-start",
                flexWrap: { xs: "wrap", md: "nowrap" },
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap", gap: 0.8 }}>
                  <Chip
                    icon={<FileText size={12} />}
                    label="Custom project analysis"
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      bgcolor: "rgba(255,255,255,0.14)",
                      color: "#e2e8f0",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                  />
                  <Chip
                    label={sc.label}
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      bgcolor: sc.bg,
                      color: sc.color,
                    }}
                  />
                  {reportLike.category && (
                    <Chip
                      label={reportLike.category}
                      size="small"
                      sx={{
                        height: 22,
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        bgcolor: "rgba(97,197,195,0.25)",
                        color: "#a5f3fc",
                        border: "1px solid rgba(97,197,195,0.35)",
                      }}
                    />
                  )}
                </Stack>

                <Typography
                  sx={{
                    fontSize: { xs: "1.65rem", md: "2.35rem" },
                    fontWeight: 900,
                    lineHeight: 1.12,
                    color: "#fff",
                    letterSpacing: "-0.025em",
                    mb: 1.5,
                    textShadow: "0 2px 16px rgba(0,0,0,0.5)",
                  }}
                >
                  {reportLike.title}
                </Typography>

                {reportLike.summary && (
                  <Typography
                    sx={{
                      fontSize: "0.92rem",
                      color: "rgba(255,255,255,0.7)",
                      lineHeight: 1.75,
                      maxWidth: 720,
                      mb: 2.5,
                    }}
                  >
                    {reportLike.summary}
                  </Typography>
                )}

                <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
                  <Stack direction="row" spacing={0.8} alignItems="center">
                    <Avatar
                      src={reportLike.buyerAvatar}
                      sx={{
                        width: 26,
                        height: 26,
                        fontSize: "0.7rem",
                        fontWeight: 800,
                        bgcolor: ACCENT,
                        color: "#fff",
                      }}
                    >
                      {reportLike.buyerName?.[0] || "?"}
                    </Avatar>
                    <Typography sx={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>
                      {reportLike.buyerName}
                    </Typography>
                  </Stack>
                  <Typography sx={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)" }}>
                    Priority · {reportLike.priorityLevel || "—"}
                  </Typography>
                </Stack>
              </Box>

              <Stack
                spacing={1}
                sx={{
                  flexShrink: 0,
                  alignItems: "stretch",
                  minWidth: { xs: "100%", sm: 200 },
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<Edit3 size={15} />}
                  onClick={() => setTab(2)}
                  sx={{
                    borderRadius: "10px",
                    textTransform: "none",
                    fontWeight: 800,
                    py: 1.2,
                    bgcolor: ACCENT,
                    color: "#fff",
                    boxShadow: "none",
                    "&:hover": { bgcolor: "#50ada8", boxShadow: "none" },
                  }}
                >
                  Edit record
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ClipboardList size={15} />}
                  onClick={() => setTab(1)}
                  sx={{
                    borderRadius: "10px",
                    textTransform: "none",
                    fontWeight: 700,
                    py: 1.2,
                    borderColor: "rgba(255,255,255,0.28)",
                    color: "rgba(255,255,255,0.9)",
                    "&:hover": { borderColor: ACCENT, bgcolor: "rgba(255,255,255,0.06)" },
                  }}
                >
                  Review bids
                </Button>
              </Stack>
            </Box>
          </Container>
        </Box>

        {/* —— Stats —— */}
        <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" },
              gap: 1.5,
              mb: 4,
            }}
          >
            {statPills.map(({ label, value, c }) => (
              <Box
                key={label}
                sx={{
                  p: "14px 18px",
                  borderRadius: "12px",
                  border: `1px solid ${colors.border}`,
                  bgcolor: colors.card,
                }}
              >
                <Typography sx={{ fontSize: "1.35rem", fontWeight: 900, color: c, lineHeight: 1, mb: 0.35 }}>
                  {value}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: colors.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                  }}
                >
                  {label}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* —— Tabs + body —— */}
          <Box
            sx={{
              display: "flex",
              gap: 4,
              alignItems: "flex-start",
              flexWrap: tab === 2 ? "wrap" : { xs: "wrap", lg: "nowrap" },
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0, width: tab === 2 ? "100%" : undefined }}>
              <Box sx={{ borderBottom: `1px solid ${colors.border}`, mb: 3.5 }}>
                <Tabs
                  value={tab}
                  onChange={(_, v) => setTab(v)}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    minHeight: 40,
                    "& .MuiTabs-indicator": {
                      backgroundColor: ACCENT,
                      height: 2.5,
                      borderRadius: 999,
                    },
                    "& .MuiTab-root": {
                      textTransform: "none",
                      minHeight: 40,
                      px: 0,
                      mr: 3,
                      fontSize: "0.875rem",
                      color: colors.textMuted,
                      fontWeight: 500,
                    },
                    "& .Mui-selected": {
                      color: `${colors.text} !important`,
                      fontWeight: 700,
                    },
                  }}
                >
                  <Tab label="Overview" />
                  <Tab label={`Bids & proposals (${reportLike.bidsCount})`} />
                  <Tab label="Management" />
                </Tabs>
              </Box>

              {tab === 0 && (
                <Box>
                  {raw.description && (
                    <Box sx={{ mb: 4 }}>
                      <SectionLabel>Description</SectionLabel>
                      {String(raw.description)
                        .split(/\n\n+/)
                        .filter(Boolean)
                        .map((p, i) => (
                          <Typography
                            key={i}
                            sx={{
                              fontSize: "0.92rem",
                              color: colors.textMuted,
                              lineHeight: 1.85,
                              mb: 1.5,
                            }}
                          >
                            {p}
                          </Typography>
                        ))}
                    </Box>
                  )}

                  <Box sx={{ mb: 4 }}>
                    <SectionLabel>Project scope</SectionLabel>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 3,
                        flexWrap: "wrap",
                        p: 2.5,
                        borderRadius: "12px",
                        border: `1px solid ${colors.border}`,
                        bgcolor: colors.card,
                      }}
                    >
                      <Stack direction="row" spacing={1.2} alignItems="center">
                        <Database size={16} color={ACCENT} />
                        <Box>
                          <Typography sx={{ fontSize: "0.72rem", color: colors.textMuted, fontWeight: 700 }}>
                            Data type
                          </Typography>
                          <Typography sx={{ fontWeight: 700 }}>{raw.dataType || "—"}</Typography>
                        </Box>
                      </Stack>
                      <Stack direction="row" spacing={1.2} alignItems="center">
                        <Layers size={16} color={ACCENT} />
                        <Box>
                          <Typography sx={{ fontSize: "0.72rem", color: colors.textMuted, fontWeight: 700 }}>
                            Dataset size
                          </Typography>
                          <Typography sx={{ fontWeight: 700 }}>{raw.datasetSize || "—"}</Typography>
                        </Box>
                      </Stack>
                      <Stack direction="row" spacing={1.2} alignItems="center">
                        <Target size={16} color={ACCENT} />
                        <Box>
                          <Typography sx={{ fontSize: "0.72rem", color: colors.textMuted, fontWeight: 700 }}>
                            Source preference
                          </Typography>
                          <Typography sx={{ fontWeight: 700 }}>{raw.sourcePreference || "—"}</Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Box>

                  {raw.editorWorkspaceNotes && (
                    <Box>
                      <SectionLabel>Editor workspace notes</SectionLabel>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.5,
                          borderRadius: "12px",
                          border: `1px solid ${colors.border}`,
                          bgcolor: colors.bgSecondary,
                        }}
                      >
                        <Typography sx={{ fontSize: "0.9rem", color: colors.text, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>
                          {raw.editorWorkspaceNotes}
                        </Typography>
                      </Paper>
                    </Box>
                  )}
                </Box>
              )}

              {tab === 1 && (
                <Box>
                  {(raw.bids || []).length === 0 ? (
                    <Typography sx={{ color: colors.textMuted }}>No bids yet.</Typography>
                  ) : (
                    <Stack spacing={2}>
                      {raw.bids.map((b) => (
                        <Paper
                          key={b.id}
                          elevation={0}
                          sx={{
                            p: 2.5,
                            borderRadius: "14px",
                            border: `1px solid ${colors.border}`,
                            bgcolor: colors.card,
                          }}
                        >
                          <Stack direction="row" spacing={2} alignItems="flex-start">
                            <Avatar src={b.collaboratorAvatar} sx={{ width: 44, height: 44 }}>
                              {b.collaboratorName?.[0]}
                            </Avatar>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={1}>
                                <Typography sx={{ fontWeight: 800, fontSize: "1rem" }}>{b.collaboratorName}</Typography>
                                <Chip size="small" label={b.status} sx={{ fontWeight: 800 }} />
                              </Stack>
                              <Typography sx={{ mt: 1, fontSize: "0.9rem", color: colors.textMuted, lineHeight: 1.7 }}>
                                {b.proposal || "—"}
                              </Typography>
                              <Stack direction="row" spacing={2} sx={{ mt: 2 }} flexWrap="wrap">
                                <Typography sx={{ fontWeight: 900, color: PRIMARY }}>
                                  ${Number(b.price || 0).toLocaleString()}
                                </Typography>
                                <Typography sx={{ color: colors.textMuted, fontWeight: 600 }}>
                                  {b.deliveryTime || "—"}
                                </Typography>
                              </Stack>
                            </Box>
                          </Stack>
                        </Paper>
                      ))}
                    </Stack>
                  )}
                </Box>
              )}

              {tab === 2 && (
                <Box sx={{ animation: "fadeIn 0.2s ease-out", width: "100%" }}>
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: colors.text, mb: 1, letterSpacing: "-0.02em" }}>
                      Project Analysis Management
                    </Typography>
                    <Typography sx={{ color: colors.textMuted, fontSize: "1rem" }}>
                      Modern project form for submitting & managing project analysis requests with expanded layout and input fields.
                    </Typography>
                  </Box>

                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 3, md: 5 },
                      borderRadius: "24px",
                      border: `1px solid ${colors.border}`,
                      bgcolor: colors.bgPanel,
                      boxShadow: colors.isDarkMode ? "none" : "0 10px 40px rgba(0,0,0,0.04)",
                    }}
                  >
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12 }}>
                        <Box sx={{ mb: 1 }}>
                          <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: colors.textMuted, mb: 1, ml: 0.5 }}>
                            Project Title
                          </Typography>
                          <TextField
                            fullWidth
                            placeholder="pus — clinical notes (de-ID)"
                            value={mgmt.title}
                            onChange={(e) => setMgmt({ ...mgmt, title: e.target.value })}
                            sx={{
                              "& .MuiOutlinedInput-root": { 
                                borderRadius: "12px", 
                                bgcolor: colors.card,
                                fontSize: "1rem",
                                fontWeight: 500,
                                transition: "all 0.2s ease",
                                "& fieldset": { borderColor: colors.border },
                                "&:hover fieldset": { borderColor: ACCENT },
                                "&.Mui-focused fieldset": { borderColor: ACCENT, borderWidth: "2px" },
                              },
                            }}
                          />
                        </Box>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: colors.textMuted, mb: 1, ml: 0.5 }}>
                          Data Type
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="JSONL"
                          value={mgmt.dataType}
                          onChange={(e) => setMgmt({ ...mgmt, dataType: e.target.value })}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: colors.card, "& fieldset": { borderColor: colors.border } } }}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: colors.textMuted, mb: 1, ml: 0.5 }}>
                          Budget Min ($)
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="12000"
                          value={mgmt.budgetMin}
                          onChange={(e) => setMgmt({ ...mgmt, budgetMin: e.target.value })}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: colors.card, "& fieldset": { borderColor: colors.border } } }}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: colors.textMuted, mb: 1, ml: 0.5 }}>
                          Budget Max ($)
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="22000"
                          value={mgmt.budgetMax}
                          onChange={(e) => setMgmt({ ...mgmt, budgetMax: e.target.value })}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: colors.card, "& fieldset": { borderColor: colors.border } } }}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: colors.textMuted, mb: 1, ml: 0.5 }}>
                          Priority
                        </Typography>
                        <TextField
                          fullWidth
                          select
                          SelectProps={{ native: true }}
                          value={mgmt.priorityLevel}
                          onChange={(e) => setMgmt({ ...mgmt, priorityLevel: e.target.value })}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: colors.card, "& fieldset": { borderColor: colors.border } } }}
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </TextField>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: colors.textMuted, mb: 1, ml: 0.5 }}>
                          Category
                        </Typography>
                        <TextField
                          fullWidth
                          value={mgmt.category}
                          onChange={(e) => setMgmt({ ...mgmt, category: e.target.value })}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: colors.card, "& fieldset": { borderColor: colors.border } } }}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: colors.textMuted, mb: 1, ml: 0.5 }}>
                          Dataset Size
                        </Typography>
                        <TextField
                          fullWidth
                          value={mgmt.datasetSize}
                          onChange={(e) => setMgmt({ ...mgmt, datasetSize: e.target.value })}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: colors.card, "& fieldset": { borderColor: colors.border } } }}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                        <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: colors.textMuted, mb: 1, ml: 0.5 }}>
                          Status
                        </Typography>
                        <TextField
                          fullWidth
                          select
                          SelectProps={{ native: true }}
                          value={mgmt.status}
                          onChange={(e) => setMgmt({ ...mgmt, status: e.target.value })}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: colors.card, "& fieldset": { borderColor: colors.border } } }}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </TextField>
                      </Grid>

                      <Grid size={{ xs: 12 }}>
                        <Box sx={{ mb: 1 }}>
                          <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: colors.textMuted, mb: 2, ml: 0.5 }}>
                            Full Description
                          </Typography>
                          <TextField
                            fullWidth
                            multiline
                            minRows={10}
                            maxRows={40}
                            placeholder="Provide a detailed project description..."
                            value={mgmt.description}
                            onChange={(e) => setMgmt({ ...mgmt, description: e.target.value })}
                            sx={{
                              "& .MuiOutlinedInput-root": { 
                                borderRadius: "12px", 
                                bgcolor: colors.card,
                                lineHeight: 1.7,
                                border: `2px solid ${colors.border}`,
                                "& fieldset": { borderColor: "transparent" },
                                "&:hover fieldset": { borderColor: "transparent" },
                                "&.Mui-focused fieldset": { borderColor: "transparent" },
                                "&:hover": { borderColor: ACCENT, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" },
                                "&.Mui-focused": { borderColor: ACCENT, boxShadow: `0 4px 16px ${ACCENT}20` },
                              },
                              "& .MuiInputBase-input": { p: 2.5, fontSize: "0.95rem" }
                            }}
                          />
                        </Box>
                      </Grid>

                      <Grid size={{ xs: 12 }}>
                        <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: colors.textMuted, mb: 1, ml: 0.5 }}>
                          Source Preference
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          minRows={2}
                          placeholder="Preferred source requirements..."
                          value={mgmt.sourcePreference}
                          onChange={(e) => setMgmt({ ...mgmt, sourcePreference: e.target.value })}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: colors.card, "& fieldset": { borderColor: colors.border } } }}
                        />
                      </Grid>

                      <Grid size={{ xs: 12 }}>
                        <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: colors.textMuted, mb: 1, ml: 0.5 }}>
                          Editor Workspace Notes (Internal)
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          minRows={3}
                          placeholder="Add your review notes here..."
                          value={mgmt.editorWorkspaceNotes}
                          onChange={(e) => setMgmt({ ...mgmt, editorWorkspaceNotes: e.target.value })}
                          sx={{
                            "& .MuiOutlinedInput-root": { 
                              borderRadius: "12px", 
                              bgcolor: colors.card,
                              "& fieldset": { borderColor: colors.border },
                              "&:hover fieldset": { borderColor: ACCENT },
                              "&.Mui-focused fieldset": { borderColor: ACCENT, borderWidth: "2px" },
                            },
                          }}
                        />
                      </Grid>
                    </Grid>

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 5 }}>
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
                          sx={{ 
                            borderRadius: "10px", 
                            textTransform: "none", 
                            fontWeight: 700, 
                            borderColor: colors.border,
                            color: colors.text,
                            px: 3
                          }}
                        >
                          Add to new
                        </Button>
                      </Stack>

                      <Stack direction="row" spacing={3} alignItems="center">
                        <Button
                          onClick={() => setTab(0)}
                          sx={{ 
                            fontWeight: 700, 
                            textTransform: "none", 
                            color: ACCENT,
                            fontSize: "1rem"
                          }}
                        >
                          Back to overview
                        </Button>
                        <Button
                          variant="contained"
                          onClick={persistManagement}
                          sx={{
                            bgcolor: ACCENT,
                            fontWeight: 800,
                            px: 5,
                            py: 1.5,
                            borderRadius: "12px",
                            textTransform: "none",
                            fontSize: "1rem",
                            boxShadow: `0 8px 20px ${ACCENT}33`,
                            "&:hover": { bgcolor: ACCENT, opacity: 0.9, boxShadow: `0 10px 25px ${ACCENT}44` },
                          }}
                        >
                          Save changes
                        </Button>
                      </Stack>
                    </Box>
                  </Paper>
                </Box>
              )}
            </Box>

            {tab !== 2 && (
              <Box
                sx={{
                  width: { xs: "100%", lg: 320 },
                  flexShrink: 0,
                  position: { lg: "sticky" },
                  top: { lg: 24 },
                  alignSelf: "flex-start",
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: "16px",
                    border: `1px solid ${colors.border}`,
                    bgcolor: colors.card,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      color: ACCENT,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      mb: 1,
                    }}
                  >
                    Record summary
                  </Typography>
                  <SideRow icon={User} label="Buyer" value={reportLike.buyerName} colors={colors} />
                  <SideRow icon={Briefcase} label="Category" value={reportLike.category} colors={colors} />
                  <SideRow icon={Database} label="Data type" value={reportLike.dataType} colors={colors} />
                  <SideRow icon={Layers} label="Dataset size" value={reportLike.datasetSize} colors={colors} />
                  <SideRow
                    icon={DollarSign}
                    label="Budget (range)"
                    value={`$${Number(raw.budgetMin || 0).toLocaleString()} – $${Number(raw.budgetMax || 0).toLocaleString()}`}
                    colors={colors}
                  />
                  <SideRow
                    icon={Calendar}
                    label="Deadline"
                    value={reportLike.deadline ? new Date(reportLike.deadline).toLocaleDateString() : "—"}
                    colors={colors}
                  />
                  <SideRow icon={Users} label="Lead collaborator" value={reportLike.collaborator} colors={colors} />
                  <SideRow icon={ClipboardList} label="Open bids" value={String(reportLike.bidsCount)} colors={colors} />
                  <SideRow icon={Link2} label="Attachment" value={raw.attachmentUrl || "—"} colors={colors} />
                  <Divider sx={{ my: 2 }} />
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Edit3 size={16} />}
                    onClick={() => setTab(2)}
                    sx={{
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 800,
                      bgcolor: PRIMARY,
                      py: 1.1,
                      "&:hover": { bgcolor: PRIMARY, opacity: 0.92 },
                    }}
                  >
                    Open full editor
                  </Button>
                </Paper>
              </Box>
            )}
          </Box>
        </Container>
      </Box>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.severity} variant="filled" sx={{ borderRadius: 2 }}>
          {snack.message}
        </Alert>
      </Snackbar>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </DashboardLayout>
  );
}
