import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Chip,
} from "@mui/material";
import {
  ArrowLeft,
  Save,
  Trash2,
  Globe,
  Ship,
  TrendingUp,
  Tag,
  CalendarRange,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useThemeColors } from "../../../utils/useThemeColors";
import publicMarketplaceStore from "../../../utils/publicMarketplaceStore";

const PRIMARY = "#FF8C00";
const ACCENT = "#61C5C3";

const emptyDraft = () => ({
  id: `pub-trade-${Date.now()}`,
  title: "",
  description: "",
  category_name: "Agriculture",
  region: "East",
  country: "",
  partner: "",
  type: "Export",
  value: 0,
  currency: "USD",
  growth: 0,
  volume: "",
  transport: "Sea",
  start_date: "",
  end_date: "",
  status: "Completed",
  tags: "",
  sector: "Agriculture",
});

export default function EditorTradeListingEditorPage() {
  const { tradeId } = useParams();
  const navigate = useNavigate();
  const themeColors = useThemeColors();
  const isNew = tradeId === "new";

  const [draft, setDraft] = useState(emptyDraft);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (isNew) {
      setDraft(emptyDraft());
      return;
    }
    const row = publicMarketplaceStore.getTradeById(tradeId);
    if (row) {
      setDraft({
        ...row,
        tags: Array.isArray(row.tags) ? row.tags.join(", ") : row.tags || "",
      });
    } else {
      setSnack({ open: true, message: "Listing not found.", severity: "error" });
    }
  }, [tradeId, isNew]);

  const heroSubtitle = useMemo(() => {
    return `${draft.country || "—"} ↔ ${draft.partner || "—"} · ${draft.category_name || ""}`;
  }, [draft]);

  const save = () => {
    const tagsArr = String(draft.tags || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    publicMarketplaceStore.upsertTrade({
      ...draft,
      tags: tagsArr,
      sector: draft.sector || draft.category_name,
      value: Number(draft.value) || 0,
      growth: Number(draft.growth) || 0,
    });
    setSnack({ open: true, message: "Saved to marketplace catalog.", severity: "success" });
    navigate("/dashboard/editor/trades");
  };

  const remove = () => {
    if (!draft.id || isNew) return;
    if (!confirm("Remove this listing from the public catalog?")) return;
    publicMarketplaceStore.deleteTrade(draft.id);
    navigate("/dashboard/editor/trades");
  };

  return (
    <DashboardLayout role="editor">
      <Container maxWidth="xl" disableGutters sx={{ px: { xs: 0, sm: 1 } }}>
        <Button
          startIcon={<ArrowLeft size={18} />}
          onClick={() => navigate("/dashboard/editor/trades")}
          sx={{
            mb: 2,
            color: ACCENT,
            fontWeight: 700,
            textTransform: "none",
          }}
        >
          Back to trade operations
        </Button>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: `1px solid ${themeColors.border}`,
            overflow: "hidden",
            mb: 3,
            background: themeColors.card,
          }}
        >
          <Box
            sx={{
              px: { xs: 2, md: 4 },
              py: { xs: 2.5, md: 3.5 },
              borderLeft: `6px solid ${ACCENT}`,
              background:
                themeColors.isDarkMode
                  ? "linear-gradient(135deg, rgba(97,197,195,0.08) 0%, transparent 55%)"
                  : "linear-gradient(135deg, rgba(97,197,195,0.12) 0%, #fff 50%)",
            }}
          >
            <Stack direction="row" flexWrap="wrap" justifyContent="space-between" alignItems="flex-start" gap={2}>
              <Box sx={{ flex: 1, minWidth: 240 }}>
                <Typography
                  sx={{
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    color: ACCENT,
                    textTransform: "uppercase",
                    mb: 1,
                  }}
                >
                  {isNew ? "New marketplace listing" : "Edit marketplace listing"}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "1.35rem", md: "1.85rem" },
                    fontWeight: 900,
                    color: themeColors.text,
                    lineHeight: 1.2,
                    mb: 1,
                  }}
                >
                  {draft.title || "Untitled trade dataset"}
                </Typography>
                <Typography sx={{ color: themeColors.textMuted, fontWeight: 500, display: "flex", alignItems: "center", gap: 0.75 }}>
                  <Globe size={16} strokeWidth={2.2} />
                  {heroSubtitle}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip
                  icon={<TrendingUp size={14} />}
                  label={`${draft.growth ?? 0}% YoY`}
                  sx={{ fontWeight: 700, bgcolor: `${PRIMARY}18`, color: PRIMARY }}
                />
                <Chip
                  icon={<Ship size={14} />}
                  label={draft.transport || "Transport"}
                  sx={{ fontWeight: 700, bgcolor: `${ACCENT}18`, color: ACCENT }}
                />
                <Chip
                  label={draft.status || "Status"}
                  sx={{ fontWeight: 700, bgcolor: themeColors.bgSecondary, color: themeColors.text }}
                />
              </Stack>
            </Stack>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 3,
            border: `1px solid ${themeColors.border}`,
            bgcolor: themeColors.card,
          }}
        >
          <Typography sx={{ fontWeight: 800, fontSize: "1.05rem", color: themeColors.text, mb: 2 }}>
            Listing detail
          </Typography>
          <Typography sx={{ color: themeColors.textMuted, fontSize: "0.9rem", mb: 3 }}>
            Fields below map directly to public trade cards at{" "}
            <Box component="span" sx={{ fontWeight: 700, color: themeColors.text }}>
              /public/trade
            </Box>
            .
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Listing ID"
                value={draft.id}
                disabled={!isNew}
                onChange={(e) => setDraft({ ...draft, id: e.target.value })}
                fullWidth
                size="small"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Title"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                fullWidth
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Description"
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                fullWidth
                multiline
                minRows={4}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 1 }}>
                <Chip icon={<Tag size={14} />} label="Classification & route" size="small" />
              </Divider>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="Category" fullWidth value={draft.category_name} onChange={(e) => setDraft({ ...draft, category_name: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="Region (chip)" fullWidth value={draft.region} onChange={(e) => setDraft({ ...draft, region: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="Origin country" fullWidth value={draft.country} onChange={(e) => setDraft({ ...draft, country: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="Partner country" fullWidth value={draft.partner} onChange={(e) => setDraft({ ...draft, partner: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="Sector" fullWidth value={draft.sector || ""} onChange={(e) => setDraft({ ...draft, sector: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="Trade type" fullWidth value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 1 }}>
                <Chip icon={<CalendarRange size={14} />} label="Value & period" size="small" />
              </Divider>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField type="number" label="Trade value" fullWidth value={draft.value} onChange={(e) => setDraft({ ...draft, value: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField label="Currency" fullWidth value={draft.currency} onChange={(e) => setDraft({ ...draft, currency: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField type="number" label="YoY growth %" fullWidth value={draft.growth} onChange={(e) => setDraft({ ...draft, growth: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="Volume label" fullWidth placeholder="e.g. 12,400 tonnes" value={draft.volume} onChange={(e) => setDraft({ ...draft, volume: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="Transport" fullWidth value={draft.transport} onChange={(e) => setDraft({ ...draft, transport: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="Period start (YYYY-MM-DD)" fullWidth value={draft.start_date} onChange={(e) => setDraft({ ...draft, start_date: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="Period end (YYYY-MM-DD)" fullWidth value={draft.end_date} onChange={(e) => setDraft({ ...draft, end_date: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="Card status label" fullWidth value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField label="Tags (comma separated)" fullWidth value={draft.tags} onChange={(e) => setDraft({ ...draft, tags: e.target.value })} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} helperText="Shown as hashtag chips on the public marketplace card." />
            </Grid>
          </Grid>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 4, pt: 3, borderTop: `1px solid ${themeColors.border}` }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<Save size={18} />}
              onClick={save}
              sx={{
                bgcolor: PRIMARY,
                fontWeight: 800,
                textTransform: "none",
                borderRadius: 2,
                px: 4,
                py: 1.25,
                "&:hover": { bgcolor: PRIMARY, opacity: 0.92 },
              }}
            >
              Save to catalog
            </Button>
            {!isNew && (
              <Button
                variant="outlined"
                color="error"
                size="large"
                startIcon={<Trash2 size={18} />}
                onClick={remove}
                sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}
              >
                Delete listing
              </Button>
            )}
            <Button variant="text" onClick={() => navigate("/dashboard/editor/trades")} sx={{ textTransform: "none", fontWeight: 700 }}>
              Cancel
            </Button>
          </Stack>
        </Paper>
      </Container>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.severity} variant="filled" sx={{ borderRadius: 2 }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}
