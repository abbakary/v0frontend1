import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper,
  Typography,
  Stack,
  Card,
  CardContent,
} from "@mui/material";
import { Edit3, Eye, Plus, FileText } from "lucide-react";
import { useState } from "react";
import { useThemeColors } from "../../../utils/useThemeColors";
import DashboardLayout from "../components/DashboardLayout";

const ACCENT = "#61C5C3";
const PRIMARY = "#FF8C00";

const mockReportRequests = [
  {
    id: "AR-001",
    title: "African Tech Market Analysis 2025",
    type: "analysis",
    author: "Dr. Sarah Mitchell",
    pages: 156,
    country: "Multiple",
    status: "pending_review",
    createdAt: "2025-01-05",
  },
  {
    id: "AR-002",
    title: "Supply Chain Optimization in East Africa",
    type: "case_study",
    author: "Prof. James Kipchoge",
    pages: 98,
    country: "Kenya",
    status: "pending_review",
    createdAt: "2025-01-11",
  },
  {
    id: "AR-003",
    title: "Digital Payment Trends in Africa",
    type: "research",
    author: "Dr. Emily Zhang",
    pages: 124,
    country: "Multiple",
    status: "under_review",
    createdAt: "2025-01-13",
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

function TypeChip({ type }) {
  const types = {
    research: { bg: "#dbeafe", text: "#1d4ed8", label: "Research" },
    analysis: { bg: "#dcfce7", text: "#15803d", label: "Analysis" },
    whitepaper: { bg: "#fef9c3", text: "#854d0e", label: "Whitepaper" },
    case_study: { bg: "#fee2e2", text: "#991b1b", label: "Case Study" },
  };
  const config = types[type] || types.research;
  return (
    <Chip
      label={config.label}
      size="small"
      sx={{
        backgroundColor: config.bg,
        color: config.text,
        fontWeight: 600,
        fontSize: "0.75rem",
      }}
    />
  );
}

export default function EditorReportsPage() {
  const navigate = useNavigate();
  const colors = useThemeColors();
  const [requests] = useState(mockReportRequests);

  return (
    <DashboardLayout role="editor">
      <Box sx={{ maxWidth: 1200, mx: "auto", py: 4, px: 2 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 900,
              color: colors.text,
              mb: 1,
            }}
          >
            Analysis Report Requests
          </Typography>
          <Typography sx={{ color: colors.textMuted, fontSize: "0.9rem" }}>
            Manage and review analysis report submissions
          </Typography>
        </Box>
        <Button
          startIcon={<Plus size={18} />}
          variant="contained"
          sx={{
            backgroundColor: ACCENT,
            color: "white",
            fontWeight: 700,
            textTransform: "none",
            fontSize: "0.9rem",
          }}
          onClick={() => navigate('/dashboard/editor/reports/new')}
        >
          + New Request
        </Button>
      </Box>

      {/* Stats Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", md: "1fr 1fr 1fr" },
          gap: 2,
          mb: 4,
        }}
      >
        {[
          { icon: FileText, label: "Total Reports", value: requests.length },
          { label: "Analysis Reports", value: requests.filter((r) => r.type === "analysis").length },
          { label: "Case Studies", value: requests.filter((r) => r.type === "case_study").length },
        ].map((stat, idx) => (
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
                  color: colors.textMuted,
                  mb: 0.5,
                }}
              >
                {stat.label}
              </Typography>
              <Typography
                sx={{
                  fontWeight: 700,
                  color: ACCENT,
                  fontSize: "1.8rem",
                }}
              >
                {stat.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Reports Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "12px",
          border: `1px solid ${colors.border}`,
          backgroundColor: colors.bgPanel,
          boxShadow: "none",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: colors.bgPanel }}>
              <TableCell sx={{ fontWeight: 700, color: colors.text }}>
                Report Title
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: colors.text }}>
                Type
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: colors.text }}>
                Author
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: colors.text }}>
                Pages
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: colors.text }}>
                Country
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: colors.text }}>
                Status
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: colors.text }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request, idx) => (
              <TableRow
                key={idx}
                sx={{
                  borderTop: `1px solid ${colors.border}`,
                  "&:hover": { backgroundColor: colors.bgPanel },
                }}
              >
                <TableCell sx={{ color: colors.text, fontWeight: 600 }}>
                  {request.title}
                </TableCell>
                <TableCell>
                  <TypeChip type={request.type} />
                </TableCell>
                <TableCell sx={{ color: colors.textMuted }}>
                  {request.author}
                </TableCell>
                <TableCell sx={{ color: colors.textMuted }}>
                  {request.pages}
                </TableCell>
                <TableCell sx={{ color: colors.textMuted }}>
                  {request.country}
                </TableCell>
                <TableCell>
                  <StatusBadge status={request.status} />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      startIcon={<Eye size={16} />}
                      variant="outlined"
                      sx={{
                        color: ACCENT,
                        borderColor: ACCENT,
                        fontWeight: 700,
                        textTransform: "none",
                        fontSize: "0.8rem",
                      }}
                      onClick={() =>
                        navigate(`/dashboard/editor/reports/${request.id}/edit`)
                      }
                    >
                      View
                    </Button>
                    <Button
                      size="small"
                      startIcon={<Edit3 size={16} />}
                      variant="outlined"
                      sx={{
                        color: ACCENT,
                        borderColor: ACCENT,
                        fontWeight: 700,
                        textTransform: "none",
                        fontSize: "0.8rem",
                      }}
                      onClick={() =>
                        navigate(`/dashboard/editor/reports/${request.id}/edit`)
                      }
                    >
                      Edit
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
    </DashboardLayout>
  );
}
