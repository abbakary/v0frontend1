import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Snackbar,
  Alert,
  Divider,
  Container,
  Grid,
  Paper,
} from "@mui/material";
import {
  Globe,
  Plus,
  Trash2,
  Inbox,
  CreditCard,
  TrendingUp,
  DollarSign,
  ExternalLink,
  Pencil,
  ArrowLeft,
  FileText,
  Clock,
  Briefcase,
  User,
  Mail,
  Info,
  Save,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { useThemeColors } from "../../../utils/useThemeColors";
import DashboardLayout from "../components/DashboardLayout";
import AdminTradeRequestsPage from "../admin/TradeRequestsPage";
import publicMarketplaceStore from "../../../utils/publicMarketplaceStore";
import tradeRequestService from "../../../utils/tradeRequestService";
import { alpha } from "@mui/material/styles";

function TabPanel({ children, value, index }) {
  if (value !== index) return null;
  return <Box sx={{ pt: 3 }}>{children}</Box>;
}

export default function EditorTradeHubPage() {
  const navigate = useNavigate();
  const themeColors = useThemeColors();
  const ACCENT = "#61C5C3";
  const PRIMARY = "#FF8C00";
  const SUCCESS = "#16a34a";
  const DANGER = "#dc2626";

  const [tab, setTab] = useState(0);
  const [view, setView] = useState("list"); // 'list' or 'detail'
  const [detailTab, setDetailTab] = useState(0);
  const [catalogVersion, setCatalogVersion] = useState(0);
  const [requestVersion, setRequestVersion] = useState(0);
  const [selectedReq, setSelectedReq] = useState(null);
  const [reqDraft, setReqDraft] = useState(null);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  const trades = useMemo(() => {
    void catalogVersion;
    return publicMarketplaceStore.listAllTrades();
  }, [catalogVersion]);

  const tradeRequests = useMemo(() => {
    void requestVersion;
    return tradeRequestService.getAllRequests();
  }, [requestVersion]);

  const removeTrade = (id) => {
    if (!confirm("Remove this trade listing from the public marketplace?")) return;
    publicMarketplaceStore.deleteTrade(id);
    setCatalogVersion((v) => v + 1);
    setSnack({ open: true, message: "Listing removed.", severity: "success" });
  };

  const openReqDetail = (r) => {
    setSelectedReq(r);
    setReqDraft({ ...r });
    setView("detail");
    setDetailTab(0);
  };

  const saveReqEdits = () => {
    if (!reqDraft?.id) return;
    tradeRequestService.updateRequest(reqDraft.id, {
      title: reqDraft.title,
      description: reqDraft.description,
      category: reqDraft.category,
      tradeType: reqDraft.tradeType,
      budget: reqDraft.budget,
      deadline: reqDraft.deadline,
      specifications: reqDraft.specifications,
      priorityLevel: reqDraft.priorityLevel,
      regions: reqDraft.regions,
      editorNotes: reqDraft.editorNotes,
    });
    setRequestVersion((v) => v + 1);
    setSnack({ open: true, message: "Request updated.", severity: "success" });
  };

  const setReqStatus = (id, status) => {
    tradeRequestService.setStatus(id, status, { reviewedByRole: "editor" });
    setRequestVersion((v) => v + 1);
    if (selectedReq?.id === id) {
      setSelectedReq(prev => ({ ...prev, status }));
    }
    setSnack({ open: true, message: `Marked ${status}.`, severity: "success" });
  };

  const growthColor = (g) => {
    const n = Number(g);
    if (Number.isNaN(n) || n === 0) return themeColors.textMuted;
    return n > 0 ? "#15803d" : "#b91c1c";
  };

  const renderDetailView = () => {
    if (!selectedReq) return null;
    const r = selectedReq;
    const status = String(r.status).toUpperCase();
    const sc = status === "APPROVED" 
      ? { label: "Approved", bg: "#dcfce7", color: "#15803d" }
      : status === "REJECTED"
        ? { label: "Rejected", bg: "#fee2e2", color: "#b91c1c" }
        : { label: status, bg: "#fef9c3", color: "#854d0e" };

    return (
      <Box sx={{ animation: "fadeIn 0.3s ease-out", bgcolor: "#F7FAFC", minHeight: "100vh", mt: -2, mx: -2, p: 2 }}>
        {/* HERO SECTION */}
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "24px",
            mb: 4,
            background: "#FFFFFF",
            border: `1px solid #E2E8F0`,
            boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
          }}
        >
          <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, pt: 4, pb: 4 }}>
            <Button
              startIcon={<ArrowLeft size={16} />}
              onClick={() => setView("list")}
              sx={{
                mb: 3,
                color: "#718096",
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.9rem",
                "&:hover": { backgroundColor: "transparent", color: PRIMARY },
              }}
            >
              Back to requests
            </Button>

            <Box sx={{ display: "flex", gap: 4, alignItems: "flex-start", flexWrap: "wrap" }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Stack direction="row" spacing={1.5} sx={{ mb: 2, flexWrap: "wrap" }}>
                  <Chip
                    label="Custom Trade Request"
                    size="small"
                    sx={{
                      fontWeight: 800,
                      bgcolor: "#F7FAFC",
                      color: "#4A5568",
                      border: "1px solid #E2E8F0",
                      borderRadius: "6px",
                    }}
                  />
                  <Chip
                    label={sc.label}
                    size="small"
                    sx={{
                      fontWeight: 800,
                      bgcolor: sc.bg,
                      color: sc.color,
                      borderRadius: "6px",
                    }}
                  />
                </Stack>

                <Typography
                  sx={{
                    fontSize: { xs: "1.75rem", md: "2.5rem" },
                    fontWeight: 800,
                    lineHeight: 1.2,
                    color: "#2D3748",
                    letterSpacing: "-0.02em",
                    mb: 2,
                  }}
                >
                  {r.title}
                </Typography>

                <Typography sx={{ fontSize: "1.1rem", color: "#718096", fontWeight: 500 }}>
                  Submitted by <b style={{ color: "#2D3748" }}>{r.userName}</b> · {r.category} · {r.tradeType}
                </Typography>
              </Box>

              <Box sx={{ textAlign: { xs: "left", md: "right" }, minWidth: { xs: "100%", md: 300 } }}>
                <Typography sx={{ fontSize: "2.25rem", fontWeight: 800, color: PRIMARY, lineHeight: 1, mb: 1 }}>
                  {r.budget || "No Budget"}
                </Typography>
                <Typography sx={{ color: "#718096", fontWeight: 600, fontSize: "1rem" }}>
                  Estimated Budget
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="xl" disableGutters>
          <Box sx={{ borderBottom: `1px solid #E2E8F0`, mb: 4 }}>
            <Tabs
              value={detailTab}
              onChange={(_, v) => setDetailTab(v)}
              sx={{
                "& .MuiTabs-indicator": { backgroundColor: PRIMARY, height: 3 },
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "#718096",
                  mr: 4,
                  minWidth: "auto",
                  px: 0,
                },
                "& .Mui-selected": { color: `${PRIMARY} !important`, fontWeight: 700 },
              }}
            >
              <Tab label="Overview" />
              <Tab label="Management" />
            </Tabs>
          </Box>

          {detailTab === 0 && (
            <Box sx={{ animation: "fadeIn 0.2s ease-out" }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", lg: "1fr 360px" },
                  gap: 4,
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 3, md: 6 },
                      borderRadius: "16px",
                      border: `1px solid #E2E8F0`,
                      bgcolor: "#FFFFFF",
                    }}
                  >
                    <Typography
                      component="div"
                      sx={{
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        color: PRIMARY,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        mb: 4,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5
                      }}
                    >
                      <Box sx={{ width: 4, height: 18, bgcolor: PRIMARY, borderRadius: 1 }} />
                      Request Details
                    </Typography>

                    <Grid container spacing={4} sx={{ mb: 6 }}>
                      {[
                        { label: "Category", value: r.category, icon: FileText },
                        { label: "Trade Type", value: r.tradeType, icon: Briefcase },
                        { label: "Deadline", value: r.deadline, icon: Clock },
                        { label: "Priority", value: r.priorityLevel, icon: TrendingUp },
                      ].map((item, idx) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Box sx={{ p: 1, borderRadius: "10px", bgcolor: "#F7FAFC", color: PRIMARY }}>
                              <item.icon size={20} />
                            </Box>
                            <Box>
                              <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#718096", textTransform: "uppercase" }}>
                                {item.label}
                              </Typography>
                              <Typography sx={{ fontWeight: 800, fontSize: "1.1rem", color: "#2D3748" }}>
                                {item.value || "—"}
                              </Typography>
                            </Box>
                          </Stack>
                        </Grid>
                      ))}
                    </Grid>

                    <Typography
                      component="div"
                      sx={{
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        color: PRIMARY,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        mb: 3,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5
                      }}
                    >
                      <Box sx={{ width: 4, height: 18, bgcolor: PRIMARY, borderRadius: 1 }} />
                      Description
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "1.1rem",
                        lineHeight: 1.8,
                        color: "#4A5568",
                        whiteSpace: "pre-wrap",
                        mb: 6,
                      }}
                    >
                      {r.description}
                    </Typography>

                    <Typography
                      component="div"
                      sx={{
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        color: PRIMARY,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        mb: 3,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5
                      }}
                    >
                      <Box sx={{ width: 4, height: 18, bgcolor: PRIMARY, borderRadius: 1 }} />
                      Specifications
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "1.1rem",
                        lineHeight: 1.8,
                        color: "#4A5568",
                        whiteSpace: "pre-wrap",
                        mb: 6,
                      }}
                    >
                      {r.specifications || "No specific requirements provided."}
                    </Typography>

                    <Box sx={{ pt: 4, borderTop: `1px solid #E2E8F0`, display: "flex", justifyContent: "flex-end" }}>
                      <Button
                        variant="contained"
                        onClick={() => setDetailTab(1)}
                        sx={{
                          bgcolor: PRIMARY,
                          fontWeight: 700,
                          px: 4,
                          py: 1.5,
                          borderRadius: "10px",
                          textTransform: "none",
                          fontSize: "1rem",
                          boxShadow: "none",
                          "&:hover": { bgcolor: PRIMARY, opacity: 0.9, boxShadow: "none" },
                        }}
                      >
                        Manage Request
                      </Button>
                    </Box>
                  </Paper>
                </Box>

                <Box sx={{ position: { lg: "sticky" }, top: { lg: 24 }, alignSelf: "start" }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3.5,
                      bgcolor: "#FFFFFF",
                      borderRadius: "16px",
                      border: `1px solid #E2E8F0`,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        fontWeight: 800,
                        color: PRIMARY,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        mb: 4,
                      }}
                    >
                      Quick Summary
                    </Typography>
                    <Stack spacing={3.5}>
                      {[
                        { label: "Submitted", value: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—", icon: Calendar, color: SUCCESS },
                        { label: "Deadline", value: r.deadline || "—", icon: Clock, color: DANGER },
                        { label: "Priority", value: r.priorityLevel, icon: TrendingUp, color: ACCENT },
                        { label: "Trade Type", value: r.tradeType, icon: Briefcase, color: "#7c3aed" },
                      ].map((item, idx) => (
                        <Box sx={{ display: "flex", gap: 2.5 }} key={idx}>
                          <Box
                            sx={{
                              p: 1.25,
                              borderRadius: "10px",
                              bgcolor: `${item.color}10`,
                              color: item.color,
                              height: "fit-content",
                            }}
                          >
                            <item.icon size={18} />
                          </Box>
                          <Box>
                            <Typography sx={{ fontSize: "0.8rem", color: "#718096", fontWeight: 600 }}>
                              {item.label}
                            </Typography>
                            <Typography sx={{ fontWeight: 800, color: "#2D3748", fontSize: "1rem" }}>
                              {item.value || "—"}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Stack>

                    <Divider sx={{ my: 4, borderColor: "#E2E8F0" }} />
                    
                    <Box>
                      <Typography sx={{ fontSize: "0.75rem", fontWeight: 800, color: "#718096", textTransform: "uppercase", mb: 2 }}>
                        Requester
                      </Typography>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ bgcolor: PRIMARY, width: 32, height: 32, fontSize: "0.8rem" }}>{r.userName?.[0]}</Avatar>
                        <Typography sx={{ fontWeight: 700, color: "#2D3748" }}>{r.userName}</Typography>
                      </Stack>
                    </Box>
                  </Paper>
                </Box>
              </Box>
            </Box>
          )}

          {detailTab === 1 && (
            <Box sx={{ animation: "fadeIn 0.2s ease-out" }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 6 },
                  borderRadius: "16px",
                  border: `1px solid #E2E8F0`,
                  bgcolor: "#FFFFFF",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                }}
              >
                <Box sx={{ mb: 5 }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: "#2D3748", mb: 1, letterSpacing: "-0.02em" }}>
                    Manage Trade Request
                  </Typography>
                  <Typography sx={{ color: "#718096", fontSize: "1.05rem", fontWeight: 500 }}>
                    Review specifications, update details, and approve or reject the request.
                  </Typography>
                </Box>

                <Grid container spacing={4}>
                  <Grid size={{ xs: 12 }}>
                    <Box>
                      <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: "#2D3748", mb: 1.5, ml: 0.5 }}>
                        Trade Request Title
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Importing premium medical equipment..."
                        value={reqDraft.title}
                        onChange={(e) => setReqDraft({ ...reqDraft, title: e.target.value })}
                        sx={{
                          "& .MuiOutlinedInput-root": { 
                            borderRadius: "10px", 
                            bgcolor: "#FFFFFF",
                            fontSize: "1.05rem",
                            color: "#2D3748",
                            "& fieldset": { borderColor: "#E2E8F0" },
                            "&:hover fieldset": { borderColor: "#CBD5E0" },
                            "&.Mui-focused fieldset": { borderColor: PRIMARY, borderWidth: "1.5px" },
                          },
                          "& .MuiInputBase-input": { py: 1.75, px: 2.25 }
                        }}
                      />
                    </Box>
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: "#2D3748", mb: 1.5, ml: 0.5 }}>
                      Category
                    </Typography>
                    <TextField
                      fullWidth
                      select
                      SelectProps={{ native: true }}
                      value={reqDraft.category}
                      onChange={(e) => setReqDraft({ ...reqDraft, category: e.target.value })}
                      sx={{ 
                        "& .MuiOutlinedInput-root": { 
                          borderRadius: "10px", 
                          bgcolor: "#FFFFFF",
                          color: "#2D3748",
                          "& fieldset": { borderColor: "#E2E8F0" },
                        },
                        "& select": { py: 1.75, px: 2.25 }
                      }}
                    >
                      <option value="Agriculture">Agriculture</option>
                      <option value="Technology">Technology</option>
                      <option value="Health">Health</option>
                      <option value="Finance">Finance</option>
                    </TextField>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: "#2D3748", mb: 1.5, ml: 0.5 }}>
                      Trade Type
                    </Typography>
                    <TextField
                      fullWidth
                      select
                      SelectProps={{ native: true }}
                      value={reqDraft.tradeType}
                      onChange={(e) => setReqDraft({ ...reqDraft, tradeType: e.target.value })}
                      sx={{ 
                        "& .MuiOutlinedInput-root": { 
                          borderRadius: "10px", 
                          bgcolor: "#FFFFFF",
                          color: "#2D3748",
                          "& fieldset": { borderColor: "#E2E8F0" },
                        },
                        "& select": { py: 1.75, px: 2.25 }
                      }}
                    >
                      <option value="Import">Import</option>
                      <option value="Export">Export</option>
                      <option value="Bilateral">Bilateral</option>
                    </TextField>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: "#2D3748", mb: 1.5, ml: 0.5 }}>
                      Budget ($)
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="12000"
                      value={reqDraft.budget}
                      onChange={(e) => setReqDraft({ ...reqDraft, budget: e.target.value })}
                      sx={{ 
                        "& .MuiOutlinedInput-root": { 
                          borderRadius: "10px", 
                          bgcolor: "#FFFFFF",
                          color: "#2D3748",
                          "& fieldset": { borderColor: "#E2E8F0" },
                        },
                        "& .MuiInputBase-input": { py: 1.75, px: 2.25 }
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: "#2D3748", mb: 1.5, ml: 0.5 }}>
                      Deadline
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="2024-12-31"
                      value={reqDraft.deadline}
                      onChange={(e) => setReqDraft({ ...reqDraft, deadline: e.target.value })}
                      sx={{ 
                        "& .MuiOutlinedInput-root": { 
                          borderRadius: "10px", 
                          bgcolor: "#FFFFFF",
                          color: "#2D3748",
                          "& fieldset": { borderColor: "#E2E8F0" },
                        },
                        "& .MuiInputBase-input": { py: 1.75, px: 2.25 }
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: "#2D3748", mb: 1.5, ml: 0.5 }}>
                      Priority
                    </Typography>
                    <TextField
                      fullWidth
                      select
                      SelectProps={{ native: true }}
                      value={reqDraft.priorityLevel}
                      onChange={(e) => setReqDraft({ ...reqDraft, priorityLevel: e.target.value })}
                      sx={{ 
                        "& .MuiOutlinedInput-root": { 
                          borderRadius: "10px", 
                          bgcolor: "#FFFFFF",
                          color: "#2D3748",
                          "& fieldset": { borderColor: "#E2E8F0" },
                        },
                        "& select": { py: 1.75, px: 2.25 }
                      }}
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </TextField>
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Box>
                      <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: "#2D3748", mb: 1.5, ml: 0.5 }}>
                        Full Description
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        minRows={6}
                        placeholder="Provide a detailed trade request description..."
                        value={reqDraft.description}
                        onChange={(e) => setReqDraft({ ...reqDraft, description: e.target.value })}
                        sx={{
                          "& .MuiOutlinedInput-root": { 
                            borderRadius: "10px", 
                            bgcolor: "#FFFFFF",
                            color: "#2D3748",
                            lineHeight: 1.6,
                            "& fieldset": { borderColor: "#E2E8F0" },
                            "&:hover fieldset": { borderColor: "#CBD5E0" },
                            "&.Mui-focused fieldset": { borderColor: PRIMARY, borderWidth: "1.5px" },
                          },
                          "& .MuiInputBase-input": { p: 2.25 }
                        }}
                      />
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: "#2D3748", mb: 1.5, ml: 0.5 }}>
                      Specifications
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      minRows={4}
                      placeholder="Enter detailed specifications..."
                      value={reqDraft.specifications}
                      onChange={(e) => setReqDraft({ ...reqDraft, specifications: e.target.value })}
                      sx={{ 
                        "& .MuiOutlinedInput-root": { 
                          borderRadius: "10px", 
                          bgcolor: "#FFFFFF",
                          color: "#2D3748",
                          "& fieldset": { borderColor: "#E2E8F0" },
                        },
                        "& .MuiInputBase-input": { py: 1.75, px: 2.25 }
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Box>
                      <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: "#2D3748", mb: 1.5, ml: 0.5 }}>
                        Editor Notes (Internal)
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        minRows={4}
                        placeholder="Add assessment notes for approval or rejection..."
                        value={reqDraft.editorNotes}
                        onChange={(e) => setReqDraft({ ...reqDraft, editorNotes: e.target.value })}
                        sx={{
                          "& .MuiOutlinedInput-root": { 
                            borderRadius: "10px", 
                            bgcolor: "#FFFFFF",
                            color: "#2D3748",
                            "& fieldset": { borderColor: "#E2E8F0" },
                            "&:hover fieldset": { borderColor: "#CBD5E0" },
                            "&.Mui-focused fieldset": { borderColor: PRIMARY, borderWidth: "1.5px" },
                          },
                          "& .MuiInputBase-input": { p: 2.25 }
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 8 }}>
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="outlined"
                      startIcon={<Plus size={18} />}
                      onClick={saveReqEdits}
                      sx={{ 
                        borderRadius: "10px", 
                        textTransform: "none", 
                        fontWeight: 700, 
                        borderColor: "#E2E8F0",
                        color: "#2D3748",
                        px: 3.5,
                        py: 1.25,
                        "&:hover": { borderColor: "#CBD5E0", bgcolor: "#F7FAFC" }
                      }}
                    >
                      Save draft
                    </Button>
                    <IconButton 
                      sx={{ 
                        border: `1px solid #E2E8F0`, 
                        borderRadius: "10px",
                        p: 1.5,
                        "&:hover": { bgcolor: "#F7FAFC" }
                      }}
                    >
                      <MoreHorizontal size={22} color="#4A5568" />
                    </IconButton>
                  </Stack>

                  <Stack direction="row" spacing={5} alignItems="center">
                    <Button
                      onClick={() => setDetailTab(0)}
                      sx={{ 
                        fontWeight: 700, 
                        textTransform: "none", 
                        color: "#718096",
                        fontSize: "1.05rem",
                        "&:hover": { bgcolor: "transparent", color: PRIMARY }
                      }}
                    >
                      Back to overview
                    </Button>
                    <Box sx={{ display: "flex", gap: 3 }}>
                      <Button
                        variant="contained"
                        startIcon={<ThumbsUp size={18} />}
                        disabled={status !== "PENDING"}
                        onClick={() => setReqStatus(r.id, "APPROVED")}
                        sx={{ 
                          bgcolor: SUCCESS, 
                          fontWeight: 700, 
                          px: 5, 
                          py: 1.85,
                          borderRadius: "10px", 
                          textTransform: "none", 
                          fontSize: "1.05rem",
                          boxShadow: "none",
                          "&:hover": { bgcolor: SUCCESS, opacity: 0.9, boxShadow: "none" } 
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<ThumbsDown size={18} />}
                        disabled={status !== "PENDING"}
                        onClick={() => setReqStatus(r.id, "REJECTED")}
                        sx={{ 
                          color: DANGER, 
                          borderColor: DANGER, 
                          fontWeight: 700, 
                          px: 5, 
                          py: 1.85,
                          borderRadius: "10px", 
                          textTransform: "none", 
                          fontSize: "1.05rem",
                          "&:hover": { borderColor: DANGER, bgcolor: `${DANGER}08` } 
                        }}
                      >
                        Reject
                      </Button>
                    </Box>
                  </Stack>
                </Box>
              </Paper>
            </Box>
          )}
        </Container>
      </Box>
    );
  };

  return (
    <DashboardLayout role="editor">
      <Box sx={{ backgroundColor: themeColors.bg }}>
        {view === "list" ? (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "flex-end" },
                justifyContent: "space-between",
                gap: 2,
                mb: 1,
              }}
            >
              <Box>
                <Typography sx={{ fontSize: "1.85rem", fontWeight: 900, color: themeColors.text, letterSpacing: "-0.02em" }}>
                  Trade operations
                </Typography>
                <Typography sx={{ color: themeColors.textMuted, mt: 0.5, maxWidth: 560 }}>
                  Curate the same marketplace buyers see on{" "}
                  <Box component="span" sx={{ fontWeight: 700, color: ACCENT }}>
                    /public/trade
                  </Box>
                  , review custom dataset requests, and handle subscriptions — all inside this layout.
                </Typography>
              </Box>
            </Box>

            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              sx={{
                borderBottom: `1px solid ${themeColors.border}`,
                "& .MuiTab-root": { textTransform: "none", fontWeight: 700, minHeight: 48 },
                "& .Mui-selected": { color: `${PRIMARY} !important` },
                "& .MuiTabs-indicator": { bgcolor: PRIMARY, height: 3 },
              }}
            >
              <Tab icon={<Globe size={17} />} iconPosition="start" label="Marketplace listings" />
              <Tab icon={<Inbox size={17} />} iconPosition="start" label="Custom trade requests" />
              <Tab icon={<CreditCard size={17} />} iconPosition="start" label="Subscriptions" />
            </Tabs>

            <TabPanel value={tab} index={0}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Plus size={18} />}
                  onClick={() => navigate("/dashboard/editor/trades/catalog/new")}
                  sx={{
                    bgcolor: ACCENT,
                    textTransform: "none",
                    fontWeight: 800,
                    borderRadius: "14px",
                    px: 3,
                    py: 1.25,
                    boxShadow: `0 8px 24px ${ACCENT}44`,
                    "&:hover": { bgcolor: ACCENT, filter: "brightness(0.95)" },
                  }}
                >
                  Add listing
                </Button>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gap: 3,
                  gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" },
                }}
              >
                {trades.map((t) => (
                  <Card
                    key={t.id}
                    elevation={0}
                    sx={{
                      borderRadius: "20px",
                      border: `1px solid ${themeColors.border}`,
                      bgcolor: themeColors.card,
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: themeColors.isDarkMode ? "0 16px 40px rgba(0,0,0,0.35)" : "0 18px 42px rgba(97,197,195,0.18)",
                        borderColor: ACCENT,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        height: 108,
                        px: 2.5,
                        py: 2,
                        background: themeColors.isDarkMode
                          ? `linear-gradient(125deg, ${ACCENT}33 0%, #1e293b 45%, ${PRIMARY}28 100%)`
                          : `linear-gradient(125deg, ${ACCENT}35 0%, #f8fafc 50%, ${PRIMARY}25 100%)`,
                        borderBottom: `1px solid ${themeColors.border}`,
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                      }}
                    >
                      <Stack spacing={0.75}>
                        <Chip
                          label={t.category_name || "Trade"}
                          size="small"
                          sx={{ fontWeight: 800, bgcolor: "rgba(255,255,255,0.92)", color: "#365314" }}
                        />
                        <Chip
                          label={t.region || "Global"}
                          size="small"
                          sx={{ fontWeight: 800, bgcolor: "rgba(255,255,255,0.85)", color: "#4338ca", width: "fit-content" }}
                        />
                      </Stack>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography sx={{ fontSize: "0.65rem", fontWeight: 800, color: themeColors.textMuted, letterSpacing: "0.08em" }}>
                          LISTING ID
                        </Typography>
                        <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: themeColors.text, fontFamily: "monospace" }}>
                          {t.id.length > 22 ? `${t.id.slice(0, 20)}…` : t.id}
                        </Typography>
                      </Box>
                    </Box>

                    <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", p: 2.5 }}>
                      <Typography sx={{ fontWeight: 900, fontSize: "1.05rem", color: themeColors.text, lineHeight: 1.35, mb: 1 }}>
                        {t.title}
                      </Typography>
                      <Stack direction="row" spacing={0.75} alignItems="center" sx={{ color: themeColors.textMuted, mb: 2 }}>
                        <Globe size={15} />
                        <Typography sx={{ fontSize: "0.88rem", fontWeight: 600 }}>
                          {t.country} ↔ {t.partner}
                        </Typography>
                      </Stack>

                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 1.5,
                          p: 1.75,
                          borderRadius: "14px",
                          bgcolor: themeColors.bgSecondary,
                          border: `1px solid ${themeColors.border}`,
                          mb: 2,
                        }}
                      >
                        <Box>
                          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: themeColors.textMuted, mb: 0.35 }}>
                            <DollarSign size={14} />
                            <Typography sx={{ fontSize: "0.68rem", fontWeight: 800, textTransform: "uppercase" }}>Value</Typography>
                          </Stack>
                          <Typography sx={{ fontWeight: 900, color: "#15803d", fontSize: "1.05rem" }}>
                            ${Number(t.value || 0).toLocaleString()}
                          </Typography>
                          <Typography sx={{ fontSize: "0.72rem", color: themeColors.textMuted }}>{t.currency || "USD"}</Typography>
                        </Box>
                        <Box sx={{ textAlign: "right" }}>
                          <Stack direction="row" alignItems="center" spacing={0.5} justifyContent="flex-end" sx={{ color: themeColors.textMuted, mb: 0.35 }}>
                            <TrendingUp size={14} />
                            <Typography sx={{ fontSize: "0.68rem", fontWeight: 800, textTransform: "uppercase" }}>YoY</Typography>
                          </Stack>
                          <Typography sx={{ fontWeight: 900, fontSize: "1.05rem", color: growthColor(t.growth) }}>
                            {t.growth != null ? `${t.growth >= 0 ? "+" : ""}${t.growth}%` : "—"}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 1, mb: 2 }}>
                        <Box>
                          <Typography sx={{ fontSize: "0.65rem", fontWeight: 800, color: themeColors.textMuted }}>Volume</Typography>
                          <Typography sx={{ fontWeight: 700, fontSize: "0.82rem", color: themeColors.text }}>{t.volume || "—"}</Typography>
                        </Box>
                        <Box>
                          <Typography sx={{ fontSize: "0.65rem", fontWeight: 800, color: themeColors.textMuted }}>Transport</Typography>
                          <Typography sx={{ fontWeight: 700, fontSize: "0.82rem", color: "#4338ca" }}>{t.transport || "—"}</Typography>
                        </Box>
                        <Box>
                          <Typography sx={{ fontSize: "0.65rem", fontWeight: 800, color: themeColors.textMuted }}>Status</Typography>
                          <Typography sx={{ fontWeight: 700, fontSize: "0.82rem" }}>{t.status || "—"}</Typography>
                        </Box>
                      </Box>

                      <Typography
                        sx={{
                          fontSize: "0.82rem",
                          color: themeColors.textMuted,
                          lineHeight: 1.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          mb: "auto",
                        }}
                      >
                        {t.description || "No description."}
                      </Typography>

                      <Stack direction="row" spacing={1} sx={{ mt: 2.5, pt: 2, borderTop: `1px solid ${themeColors.border}` }}>
                        <Button
                          fullWidth
                          variant="contained"
                          endIcon={<Pencil size={16} />}
                          onClick={() => navigate(`/dashboard/editor/trades/catalog/${encodeURIComponent(t.id)}`)}
                          sx={{
                            bgcolor: PRIMARY,
                            textTransform: "none",
                            fontWeight: 800,
                            borderRadius: "12px",
                            py: 1.1,
                            "&:hover": { bgcolor: PRIMARY, opacity: 0.92 },
                          }}
                        >
                          Full-page edit
                        </Button>
                        <Button
                          variant="outlined"
                          sx={{ minWidth: 48, borderRadius: "12px", borderColor: themeColors.border }}
                          onClick={() => window.open(`/public/trade/${encodeURIComponent(t.id)}`, "_blank", "noopener,noreferrer")}
                          title="Preview public page"
                        >
                          <ExternalLink size={18} />
                        </Button>
                        <Button
                          color="error"
                          variant="outlined"
                          sx={{ minWidth: 48, borderRadius: "12px" }}
                          onClick={() => removeTrade(t.id)}
                        >
                          <Trash2 size={18} />
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </TabPanel>

            <TabPanel value={tab} index={1}>
              {tradeRequests.length === 0 ? (
                <Typography sx={{ color: themeColors.textMuted }}>
                  No requests yet — they appear when users submit from “Request Custom Trade Data”.
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {tradeRequests.map((r) => (
                    <Card
                      key={r.id}
                      sx={{
                        borderRadius: "20px",
                        border: `1px solid ${themeColors.border}`,
                        bgcolor: themeColors.card,
                        boxShadow: "none",
                        transition: "all 0.2s ease",
                        "&:hover": { borderColor: ACCENT, transform: "translateY(-2px)" }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontWeight: 800, fontSize: "1.1rem", color: themeColors.text }}>{r.title}</Typography>
                            <Typography sx={{ fontSize: "0.85rem", color: themeColors.textMuted, mb: 1.5 }}>
                              {r.userName} · {r.category} · {r.tradeType}
                            </Typography>
                            <Typography sx={{ mt: 1, fontSize: "0.95rem", color: themeColors.text, lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                              {r.description}
                            </Typography>
                          </Box>
                          <Chip
                            label={r.status}
                            size="small"
                            sx={{
                              fontWeight: 800,
                              textTransform: "uppercase",
                              fontSize: "0.7rem",
                              ...(String(r.status).toUpperCase() === "APPROVED"
                                ? { bgcolor: "#dcfce7", color: "#15803d" }
                                : String(r.status).toUpperCase() === "REJECTED"
                                  ? { bgcolor: "#fee2e2", color: "#b91c1c" }
                                  : { bgcolor: "#fef9c3", color: "#854d0e" }),
                            }}
                          />
                        </Box>
                        <Divider sx={{ my: 2.5, opacity: 0.6 }} />
                        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                          <Button 
                            variant="contained" 
                            onClick={() => openReqDetail(r)} 
                            sx={{ 
                              textTransform: "none", 
                              fontWeight: 800, 
                              bgcolor: ACCENT, 
                              borderRadius: "10px",
                              px: 3,
                              "&:hover": { bgcolor: ACCENT, opacity: 0.9 }
                            }}
                          >
                            Manage Request
                          </Button>
                          <Button
                            variant="outlined"
                            disabled={String(r.status).toUpperCase() !== "PENDING"}
                            onClick={() => setReqStatus(r.id, "APPROVED")}
                            sx={{ textTransform: "none", color: SUCCESS, borderColor: SUCCESS, fontWeight: 700, borderRadius: "10px", "&:hover": { borderColor: SUCCESS, bgcolor: `${SUCCESS}08` } }}
                          >
                            Quick Approve
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            disabled={String(r.status).toUpperCase() !== "PENDING"}
                            onClick={() => setReqStatus(r.id, "REJECTED")}
                            sx={{ textTransform: "none", fontWeight: 700, borderRadius: "10px" }}
                          >
                            Reject
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </TabPanel>

            <TabPanel value={tab} index={2}>
              <Typography sx={{ color: themeColors.textMuted, mb: 2 }}>
                Subscription queue (same tools as before, embedded here).
              </Typography>
              <AdminTradeRequestsPage role="editor" hideLayout />
            </TabPanel>
          </>
        ) : (
          renderDetailView()
        )}
      </Box>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.severity} variant="filled" sx={{ borderRadius: 2 }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}
