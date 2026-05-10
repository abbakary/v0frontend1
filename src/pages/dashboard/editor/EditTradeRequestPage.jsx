import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
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
  Truck,
  DollarSign,
  Globe,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useThemeColors } from "../../../utils/useThemeColors";

const ACCENT = "#61C5C3";
const PRIMARY = "#FF8C00";
const WARNING = "#f59e0b";
const DANGER = "#dc2626";

const mockTradeRequests = [
  {
    id: "TR-001",
    title: "Coffee Export Initiative",
    description: "High-quality coffee beans from East Africa for European markets.",
    fullDescription: "Comprehensive trade initiative targeting premium coffee bean exports from East African regions to established European distribution networks.",
    reviewNotes: "Pending compliance documentation from origin countries.",
    type: "Export",
    sector: "Agriculture",
    partner: "European Coffee Importers",
    transport: "Sea Freight",
    value: 150000,
    currency: "USD",
    volume: "500 metric tons",
    growth: 25,
    country: "Kenya",
    region: "East Africa",
    status: "pending_review",
    createdAt: "2025-01-10",
  },
  {
    id: "TR-002",
    title: "Industrial Equipment Import",
    description: "Manufacturing machinery from Germany to West Africa.",
    fullDescription: "Strategic import of advanced manufacturing equipment from European suppliers.",
    reviewNotes: "Awaiting port clearance documents.",
    type: "Import",
    sector: "Manufacturing",
    partner: "German Industrial Suppliers",
    transport: "Air Freight",
    value: 320000,
    currency: "USD",
    volume: "200 units",
    growth: 15,
    country: "Nigeria",
    region: "West Africa",
    status: "pending_review",
    createdAt: "2025-01-12",
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

export default function EditTradeRequestPage() {
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
    type: "Export",
    sector: "",
    partner: "",
    transport: "",
    value: "",
    currency: "USD",
    volume: "",
    growth: "",
    country: "",
    region: "",
    status: "pending_review",
  });

  useEffect(() => {
    const data = mockTradeRequests.find((r) => r.id === id);
    if (data) {
      setRequest(data);
      setForm({
        title: data.title,
        fullDescription: data.fullDescription,
        reviewNotes: data.reviewNotes,
        type: data.type,
        sector: data.sector,
        partner: data.partner,
        transport: data.transport,
        value: data.value,
        currency: data.currency,
        volume: data.volume,
        growth: data.growth,
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
      showNotification("Trade request updated successfully!");
      setTimeout(() => navigate("/dashboard/editor/trades"), 1500);
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
          onClick={() => navigate("/dashboard/editor/trades")}
          sx={{ color: ACCENT, fontWeight: 700 }}
        >
          Back to Trade Requests
        </Button>
      </Box>
    );
  }

  return (
    <DashboardLayout role="editor">
      <Box sx={{ maxWidth: 1200, mx: "auto", py: 4, px: 2 }}>
        <Helmet>
          <title>Edit Trade Request - {request.title}</title>
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
          onClick={() => navigate("/dashboard/editor/trades")}
          sx={{
            color: ACCENT,
            fontWeight: 700,
            textTransform: "none",
            px: 0,
            "&:hover": { backgroundColor: "transparent", opacity: 0.8 },
          }}
        >
          Back to Trade Requests
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
                { icon: Truck, label: "Type", value: request.type },
                { icon: AlertCircle, label: "Sector", value: request.sector },
                { icon: DollarSign, label: "Trade Value", value: `$${request.value.toLocaleString()}` },
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
              Trade Summary
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
                  Volume
                </Typography>
                <Typography sx={{ fontWeight: 700, color: colors.text }}>
                  {request.volume}
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
                  Growth Rate
                </Typography>
                <Typography sx={{ fontWeight: 700, color: colors.text }}>
                  {request.growth}%
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
          Edit Trade Request
        </Typography>

        <Stack spacing={3}>
          {/* Title - Full Width */}
          <TextField
            fullWidth
            label="Trade Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: "12px" },
            }}
          />

          {/* Two Column Row */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              label="Trade Type"
              select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              SelectProps={{ native: true }}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
              }}
            >
              <option value="Export">Export</option>
              <option value="Import">Import</option>
            </TextField>
            <TextField
              label="Sector"
              value={form.sector}
              onChange={(e) => setForm({ ...form, sector: e.target.value })}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
              }}
            />
          </Box>

          {/* Two Column Row */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              label="Trading Partner"
              value={form.partner}
              onChange={(e) => setForm({ ...form, partner: e.target.value })}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
              }}
            />
            <TextField
              label="Transport Method"
              value={form.transport}
              onChange={(e) => setForm({ ...form, transport: e.target.value })}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
              }}
            />
          </Box>

          {/* Two Column Row */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              label="Trade Value"
              type="number"
              value={form.value}
              onChange={(e) =>
                setForm({ ...form, value: parseFloat(e.target.value) })
              }
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
              }}
            />
            <TextField
              label="Currency"
              select
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
              SelectProps={{ native: true }}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
              }}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="KES">KES</option>
            </TextField>
          </Box>

          {/* Two Column Row */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              label="Volume"
              value={form.volume}
              onChange={(e) => setForm({ ...form, volume: e.target.value })}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
              }}
            />
            <TextField
              label="Growth Rate (%)"
              type="number"
              value={form.growth}
              onChange={(e) =>
                setForm({ ...form, growth: parseFloat(e.target.value) })
              }
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
              }}
            />
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

          {/* Status */}
          <TextField
            fullWidth
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
              onClick={() => navigate("/dashboard/editor/trades")}
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
