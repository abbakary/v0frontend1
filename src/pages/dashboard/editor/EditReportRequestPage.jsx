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
} from "@mui/material";
import {
  ArrowLeft,
  Save,
  X,
  FileText,
  User,
  Calendar,
  Eye,
  Globe,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useThemeColors } from "../../../utils/useThemeColors";
import DashboardLayout from "../components/DashboardLayout";

const ACCENT = "#61C5C3";
const PRIMARY = "#FF8C00";
const WARNING = "#f59e0b";
const DANGER = "#dc2626";

const mockReportRequests = [
  {
    id: "AR-001",
    title: "African Tech Market Analysis 2025",
    summary: "Comprehensive analysis of technology adoption across African markets.",
    description: "In-depth market research covering technology adoption, digital transformation, and emerging opportunities in the African tech sector.",
    fullDescription: "This comprehensive analysis examines the technology landscape across major African markets, identifying key trends, adoption patterns, and emerging opportunities for investors and stakeholders.",
    reviewNotes: "Pending final review of data sources and methodology.",
    reportType: "analysis",
    author: "Dr. Sarah Mitchell",
    publisher: "African Tech Research",
    publishedYear: 2025,
    language: "English",
    pageCount: 156,
    fileFormat: "PDF",
    visibility: "public",
    isDownloadable: true,
    status: "pending_review",
    country: "Multiple",
    region: "Africa",
    createdAt: "2025-01-05",
  },
  {
    id: "AR-002",
    title: "Supply Chain Optimization in East Africa",
    summary: "Detailed case study of supply chain improvements across East African logistics.",
    description: "Case study documenting supply chain transformation initiatives in East African trade.",
    fullDescription: "Examination of supply chain optimization strategies implemented across East African logistics networks and their impact on trade efficiency.",
    reviewNotes: "Under stakeholder validation.",
    reportType: "case_study",
    author: "Prof. James Kipchoge",
    publisher: "East African Trade Institute",
    publishedYear: 2025,
    language: "English",
    pageCount: 98,
    fileFormat: "PDF",
    visibility: "public",
    isDownloadable: true,
    status: "pending_review",
    country: "Kenya",
    region: "East Africa",
    createdAt: "2025-01-11",
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

export default function EditReportRequestPage() {
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
    summary: "",
    fullDescription: "",
    reviewNotes: "",
    reportType: "research",
    author: "",
    publisher: "",
    publishedYear: new Date().getFullYear(),
    language: "English",
    pageCount: "",
    fileFormat: "PDF",
    visibility: "public",
    isDownloadable: true,
    status: "pending_review",
    country: "",
    region: "",
  });

  useEffect(() => {
    const data = mockReportRequests.find((r) => r.id === id);
    if (data) {
      setRequest(data);
      setForm({
        title: data.title,
        summary: data.summary,
        fullDescription: data.fullDescription,
        reviewNotes: data.reviewNotes,
        reportType: data.reportType,
        author: data.author,
        publisher: data.publisher,
        publishedYear: data.publishedYear,
        language: data.language,
        pageCount: data.pageCount,
        fileFormat: data.fileFormat,
        visibility: data.visibility,
        isDownloadable: data.isDownloadable,
        status: data.status,
        country: data.country,
        region: data.region,
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
      showNotification("Report request updated successfully!");
      setTimeout(() => navigate("/dashboard/editor/reports"), 1500);
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
          onClick={() => navigate("/dashboard/editor/reports")}
          sx={{ color: ACCENT, fontWeight: 700 }}
        >
          Back to Report Requests
        </Button>
      </Box>
    );
  }

  return (
    <DashboardLayout role="editor">
      <Box sx={{ maxWidth: 1200, mx: "auto", py: 4, px: 2 }}>
        <Helmet>
          <title>Edit Report Request - {request.title}</title>
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
          onClick={() => navigate("/dashboard/editor/reports")}
          sx={{
            color: ACCENT,
            fontWeight: 700,
            textTransform: "none",
            px: 0,
            "&:hover": { backgroundColor: "transparent", opacity: 0.8 },
          }}
        >
          Back to Report Requests
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
                { icon: FileText, label: "Report Type", value: request.reportType },
                { icon: User, label: "Author", value: request.author },
                { icon: User, label: "Publisher", value: request.publisher },
                { icon: Calendar, label: "Published Year", value: request.publishedYear },
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
              Report Summary
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
                  Language
                </Typography>
                <Typography sx={{ fontWeight: 700, color: colors.text }}>
                  {request.language}
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
                  Pages
                </Typography>
                <Typography sx={{ fontWeight: 700, color: colors.text }}>
                  {request.pageCount}
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
          Edit Report Request
        </Typography>

        <Stack spacing={3}>
          {/* Title - Full Width */}
          <TextField
            fullWidth
            label="Report Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: "12px" },
            }}
          />

          {/* Summary - Full Width */}
          <TextField
            fullWidth
            label="Summary"
            multiline
            rows={2}
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: "12px" },
            }}
          />

          {/* Two Column Row */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              label="Report Type"
              select
              value={form.reportType}
              onChange={(e) => setForm({ ...form, reportType: e.target.value })}
              SelectProps={{ native: true }}
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
          </Box>

          {/* Two Column Row */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              label="Author"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
              }}
            />
            <TextField
              label="Publisher"
              value={form.publisher}
              onChange={(e) => setForm({ ...form, publisher: e.target.value })}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
              }}
            />
          </Box>

          {/* Two Column Row */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              label="Published Year"
              type="number"
              inputProps={{ min: 1900, max: 2099 }}
              value={form.publishedYear}
              onChange={(e) =>
                setForm({
                  ...form,
                  publishedYear: parseInt(e.target.value),
                })
              }
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
              }}
            />
            <TextField
              label="Language"
              value={form.language}
              onChange={(e) => setForm({ ...form, language: e.target.value })}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
              }}
            />
          </Box>

          {/* Two Column Row */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              label="Page Count"
              type="number"
              inputProps={{ min: 0 }}
              value={form.pageCount}
              onChange={(e) =>
                setForm({
                  ...form,
                  pageCount: parseInt(e.target.value),
                })
              }
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
              }}
            />
            <TextField
              label="File Format"
              value={form.fileFormat}
              onChange={(e) => setForm({ ...form, fileFormat: e.target.value })}
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
              onClick={() => navigate("/dashboard/editor/reports")}
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
