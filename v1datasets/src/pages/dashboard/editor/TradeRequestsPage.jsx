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
import DashboardLayout from "../components/DashboardLayout";
import { Edit3, Eye, Plus, Truck } from "lucide-react";
import { useState } from "react";
import { useThemeColors } from "../../../utils/useThemeColors";

const ACCENT = "#61C5C3";
const PRIMARY = "#FF8C00";

const mockTradeRequests = [
  {
    id: "TR-001",
    title: "Coffee Export Initiative",
    type: "Export",
    value: 150000,
    country: "Kenya",
    status: "pending_review",
    createdAt: "2025-01-10",
  },
  {
    id: "TR-002",
    title: "Industrial Equipment Import",
    type: "Import",
    value: 320000,
    country: "Nigeria",
    status: "pending_review",
    createdAt: "2025-01-12",
  },
  {
    id: "TR-003",
    title: "Agricultural Products Trade",
    type: "Export",
    value: 85000,
    country: "Uganda",
    status: "under_review",
    createdAt: "2025-01-14",
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

export default function EditorTradeRequestsPage() {
  const navigate = useNavigate();
  const colors = useThemeColors();
  const [requests] = useState(mockTradeRequests);

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
            Trade Requests
          </Typography>
          <Typography sx={{ color: colors.textMuted, fontSize: "0.9rem" }}>
            Manage and review trade request submissions
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
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
            onClick={() => navigate('/dashboard/editor/trades/new')}
          >
            New Request
          </Button>
        </Box>
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
          { icon: Truck, label: "Total Requests", value: requests.length },
          { label: "Exports", value: requests.filter((r) => r.type === "Export").length },
          { label: "Imports", value: requests.filter((r) => r.type === "Import").length },
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

      {/* Requests Table */}
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
                Trade Title
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: colors.text }}>
                Type
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: colors.text }}>
                Value
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
                <TableCell sx={{ color: colors.textMuted }}>
                  <Chip
                    label={request.type}
                    size="small"
                    sx={{
                      backgroundColor:
                        request.type === "Export"
                          ? `${ACCENT}20`
                          : `${PRIMARY}20`,
                      color: request.type === "Export" ? ACCENT : PRIMARY,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                    }}
                  />
                </TableCell>
                <TableCell sx={{ color: colors.text, fontWeight: 600 }}>
                  ${request.value.toLocaleString()}
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
                        navigate(`/dashboard/editor/trades/${request.id}/edit`)
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
                        navigate(`/dashboard/editor/trades/${request.id}/edit`)
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
