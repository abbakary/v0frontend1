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
  Container,
} from "@mui/material";
import {
  ArrowLeft,
  Save,
  X,
  DollarSign,
  Calendar,
  User,
  Building,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useThemeColors } from "../../../utils/useThemeColors";
import DashboardLayout from "../components/DashboardLayout";

const ACCENT = "#61C5C3";
const PRIMARY = "#FF8C00";
const SUCCESS = "#16a34a";
const WARNING = "#f59e0b";
const DANGER = "#dc2626";

const mockFundRequests = [
  {
    id: "FR-001",
    title: "Working capital for regulated finance datasets",
    description: "Bridge financing while awaiting enterprise PO from two anchor banks.",
    fullDescription: "Detailed funding requirement for working capital to support operations while waiting for major enterprise contracts to be finalized.",
    reviewNotes: "Incomplete KYB documentation.",
    type: "Debt",
    category: "Finance and investment",
    dataType: "CSV",
    currencyType: "USD - US Dollar",
    timeline: 9,
    amount: 420000,
    currency: "USD",
    company: "Riverbank Analytics",
    contactPerson: "James Okonkwo",
    status: "pending_review",
    createdAt: "2025-01-15",
  },
  {
    id: "FR-002",
    title: "Equipment procurement funding",
    description: "Capital for IT infrastructure upgrade.",
    fullDescription: "Comprehensive funding request for IT infrastructure modernization.",
    reviewNotes: "Awaiting collateral documentation.",
    type: "Equity",
    category: "Equipment",
    dataType: "JSON",
    currencyType: "USD - US Dollar",
    timeline: 6,
    amount: 250000,
    currency: "USD",
    company: "Tech Solutions Inc",
    contactPerson: "Sarah Anderson",
    status: "pending_review",
    createdAt: "2025-01-20",
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

export default function EditFundRequestPage() {
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
    category: "",
    dataType: "",
    currencyType: "",
    timeline: "",
    amount: "",
    company: "",
    contactPerson: "",
    status: "pending_review",
  });

  useEffect(() => {
    const data = mockFundRequests.find((r) => r.id === id);
    if (data) {
      setRequest(data);
      setForm({
        title: data.title,
        fullDescription: data.fullDescription,
        reviewNotes: data.reviewNotes,
        type: data.type,
        category: data.category,
        dataType: data.dataType,
        currencyType: data.currencyType,
        timeline: data.timeline,
        amount: data.amount,
        company: data.company,
        contactPerson: data.contactPerson,
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
      showNotification("Fund request updated successfully!");
      setTimeout(() => navigate("/dashboard/editor/funds"), 1500);
    } catch (err) {
      showNotification(err.message || "Failed to update", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="editor">
        <Container maxWidth="lg">
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
        </Container>
      </DashboardLayout>
    );
  }

  if (!request) {
    return (
      <DashboardLayout role="editor">
        <Container maxWidth="lg">
          <Box sx={{ py: 10, textAlign: "center" }}>
            <Typography
              variant="h5"
              sx={{ color: colors.text, fontWeight: 700, mb: 2 }}
            >
              Request Not Found
            </Typography>
            <Button
              startIcon={<ArrowLeft size={16} />}
              onClick={() => navigate("/dashboard/editor/funds")}
              sx={{ color: ACCENT, fontWeight: 700 }}
            >
              Back to Fund Requests
            </Button>
          </Box>
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="editor">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Helmet>
          <title>Edit Fund Request - {request.title}</title>
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
            onClick={() => navigate("/dashboard/editor/funds")}
            sx={{
              color: ACCENT,
              fontWeight: 700,
              textTransform: "none",
              px: 0,
              "&:hover": { backgroundColor: "transparent", opacity: 0.8 },
            }}
          >
            Back to Fund Requests
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
                  { icon: DollarSign, label: "Amount Requested", value: `$${request.amount.toLocaleString()}` },
                  { icon: Calendar, label: "Timeline", value: `${request.timeline} months` },
                  { icon: Building, label: "Company/Organization", value: request.company },
                  { icon: User, label: "Contact Person", value: request.contactPerson },
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
                Quick Info
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
                    Type
                  </Typography>
                  <Typography sx={{ fontWeight: 700, color: colors.text }}>
                    {request.type}
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
                    Category
                  </Typography>
                  <Typography sx={{ fontWeight: 700, color: colors.text }}>
                    {request.category}
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
            Edit Fund Request
          </Typography>

          <Stack spacing={3}>
            {/* Title - Full Width */}
            <TextField
              fullWidth
              label="Request Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
              }}
            />

            {/* Two Column Row */}
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <TextField
                label="Funding Type"
                select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                SelectProps={{ native: true }}
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                }}
              >
                <option value="Debt">Debt</option>
                <option value="Equity">Equity</option>
                <option value="Grant">Grant</option>
                <option value="Loan">Loan</option>
              </TextField>
              <TextField
                label="Category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                }}
              />
            </Box>

            {/* Two Column Row */}
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <TextField
                label="Data Type"
                value={form.dataType}
                onChange={(e) => setForm({ ...form, dataType: e.target.value })}
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                }}
              />
              <TextField
                label="Currency Type"
                value={form.currencyType}
                onChange={(e) =>
                  setForm({ ...form, currencyType: e.target.value })
                }
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                }}
              />
            </Box>

            {/* Two Column Row */}
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <TextField
                label="Timeline (months)"
                type="number"
                value={form.timeline}
                onChange={(e) =>
                  setForm({ ...form, timeline: parseInt(e.target.value) })
                }
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                }}
              />
              <TextField
                label="Requested Amount"
                type="number"
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: parseFloat(e.target.value) })
                }
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                }}
              />
            </Box>

            {/* Two Column Row */}
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <TextField
                label="Company / Organization"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                }}
              />
              <TextField
                label="Contact Person Name"
                value={form.contactPerson}
                onChange={(e) =>
                  setForm({ ...form, contactPerson: e.target.value })
                }
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
                onClick={() => navigate("/dashboard/editor/funds")}
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
      </Container>
    </DashboardLayout>
  );
}
