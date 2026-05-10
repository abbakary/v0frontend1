import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  Grid,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  ArrowLeft,
  DollarSign,
  Calendar,
  Users,
  MapPin,
  Briefcase,
  CheckCircle,
  AlertCircle,
  Edit,
  Save,
  X,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useThemeColors } from "../../../utils/useThemeColors";

const ACCENT = "#61C5C3";
const PRIMARY = "#FF8C00";

const mockProjects = {
  "PRJ-001": {
    id: "PRJ-001",
    title: "East Africa Agricultural Initiative",
    description: "Large-scale agricultural development project focusing on sustainable farming practices in rural communities.",
    status: "active",
    budget: 1500000,
    currency: "USD",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    manager: "John Smith",
    team: 12,
    location: "Kenya",
    progress: 65,
    category: "Agriculture",
    submittedBy: "Ministry of Agriculture",
    submittedDate: "2024-10-15",
    email: "project@agriculture.gov.ke",
    objectives: [
      "Improve soil health and crop yield",
      "Train 500+ local farmers on sustainable practices",
      "Establish 10 demonstration plots",
      "Create market linkages for farmer cooperatives",
    ],
    milestones: [
      { name: "Baseline Survey", date: "2025-01-31", status: "completed" },
      { name: "Farmer Training Program", date: "2025-06-30", status: "in_progress" },
      { name: "Harvest & Evaluation", date: "2025-11-30", status: "pending" },
    ],
    attachments: [
      { name: "Project Proposal.pdf", size: "2.4 MB" },
      { name: "Budget Breakdown.xlsx", size: "856 KB" },
      { name: "Baseline Report.docx", size: "1.2 MB" },
    ],
  },
};

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

function StatusChip({ status }) {
  const statusMap = {
    active: { bg: "#dcfce7", text: "#15803d", label: "Active" },
    planning: { bg: "#dbeafe", text: "#1d4ed8", label: "Planning" },
    completed: { bg: "#f3f4f6", text: "#374151", label: "Completed" },
    on_hold: { bg: "#fef9c3", text: "#854d0e", label: "On Hold" },
    cancelled: { bg: "#fee2e2", text: "#991b1b", label: "Cancelled" },
  };

  const config = statusMap[status] || {
    bg: "#f3f4f6",
    text: "#374151",
    label: status,
  };

  return (
    <Chip
      label={config.label}
      sx={{
        height: 28,
        borderRadius: "6px",
        fontSize: "0.8rem",
        fontWeight: 700,
        backgroundColor: config.bg,
        color: config.text,
      }}
    />
  );
}

export default function AdminProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const colors = useThemeColors();

  const [tab, setTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });
  const [project, setProject] = useState(mockProjects[projectId] || null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        status: project.status,
        budget: project.budget,
        manager: project.manager,
        location: project.location,
        progress: project.progress,
      });
    }
  }, [project]);

  if (!project) {
    return (
      <DashboardLayout role="admin">
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  const handleSave = () => {
    setSnack({ open: true, message: "Project updated successfully", severity: "success" });
    setIsEditing(false);
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <DashboardLayout role="admin">
      <Box sx={{ minHeight: "100%", backgroundColor: colors.bg }}>
        {/* Hero Section */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${ACCENT}20 0%, ${PRIMARY}15 100%)`,
            borderBottom: `1px solid ${colors.border}`,
            p: 4,
          }}
        >
          <Box sx={{ maxWidth: 1200, mx: "auto" }}>
            <Button
              startIcon={<ArrowLeft size={18} />}
              onClick={() => navigate("/dashboard/admin/projects")}
              sx={{
                color: colors.text,
                textTransform: "none",
                mb: 2,
                "&:hover": { backgroundColor: `${ACCENT}15` },
              }}
            >
              Back to Projects
            </Button>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: colors.text, mb: 1 }}>
                  {project.title}
                </Typography>
                <Typography sx={{ color: colors.textMuted, mb: 2, fontSize: "0.95rem" }}>
                  {project.description}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <StatusChip status={project.status} />
                  <Chip
                    label={project.category}
                    size="small"
                    variant="outlined"
                    sx={{ borderColor: colors.border }}
                  />
                </Stack>
              </Box>

              <Stack direction="row" spacing={1}>
                <Button
                  startIcon={<Edit size={18} />}
                  variant={isEditing ? "contained" : "outlined"}
                  onClick={() => setIsEditing(!isEditing)}
                  sx={{
                    textTransform: "none",
                    borderColor: isEditing ? ACCENT : colors.border,
                    color: isEditing ? "white" : colors.text,
                    backgroundColor: isEditing ? ACCENT : "transparent",
                    "&:hover": {
                      backgroundColor: isEditing ? `${ACCENT}dd` : `${ACCENT}15`,
                    },
                  }}
                >
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
                {isEditing && (
                  <Button
                    startIcon={<Save size={18} />}
                    variant="contained"
                    onClick={handleSave}
                    sx={{
                      textTransform: "none",
                      backgroundColor: PRIMARY,
                      "&:hover": { backgroundColor: `${PRIMARY}dd` },
                    }}
                  >
                    Save
                  </Button>
                )}
              </Stack>
            </Box>
          </Box>
        </Box>

        {/* Stats Pills */}
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            mt: -2,
            px: 4,
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", md: "1fr 1fr 1fr 1fr" },
            gap: 2,
            position: "relative",
            zIndex: 10,
          }}
        >
          {[
            { icon: DollarSign, label: "Budget", value: `$${project.budget.toLocaleString()}` },
            { icon: Users, label: "Team Size", value: `${project.team} members` },
            { icon: MapPin, label: "Location", value: project.location },
            { icon: Calendar, label: "Progress", value: `${project.progress}%` },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Paper
                key={idx}
                sx={{
                  backgroundColor: colors.bgPanel,
                  border: `1px solid ${colors.border}`,
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "8px",
                    backgroundColor: `${ACCENT}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: ACCENT,
                  }}
                >
                  <Icon size={20} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: "0.75rem", color: colors.textMuted, mb: 0.2 }}>
                    {stat.label}
                  </Typography>
                  <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: colors.text }}>
                    {stat.value}
                  </Typography>
                </Box>
              </Paper>
            );
          })}
        </Box>

        {/* Content Tabs */}
        <Box sx={{ maxWidth: 1200, mx: "auto", px: 4, py: 4 }}>
          <Box sx={{ borderBottom: `1px solid ${colors.border}`, mb: 4 }}>
            <Tabs value={tab} onChange={(e, newTab) => setTab(newTab)} sx={{ mb: -1 }}>
              <Tab label="Overview" />
              <Tab label="Milestones" />
              <Tab label="Management" />
              <Tab label="Attachments" />
            </Tabs>
          </Box>

          {/* Tab: Overview */}
          {tab === 0 && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 8 }}>
                <Paper sx={{ backgroundColor: colors.bgPanel, border: `1px solid ${colors.border}`, p: 3 }}>
                  <SectionLabel>Project Summary</SectionLabel>
                  <Typography sx={{ color: colors.text, lineHeight: 1.6, mb: 3 }}>
                    {project.description}
                  </Typography>

                  <SectionLabel>Objectives</SectionLabel>
                  <ul style={{ color: colors.text, paddingLeft: 20 }}>
                    {project.objectives.map((obj, idx) => (
                      <li key={idx} style={{ marginBottom: 8 }}>
                        <Typography sx={{ color: colors.text, fontSize: "0.9rem" }}>
                          {obj}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Paper sx={{ backgroundColor: colors.bgPanel, border: `1px solid ${colors.border}`, p: 3 }}>
                  <SectionLabel>Project Details</SectionLabel>
                  <Stack spacing={2}>
                    {[
                      { icon: Briefcase, label: "Manager", value: project.manager },
                      { icon: Users, label: "Team Size", value: `${project.team} members` },
                      { icon: MapPin, label: "Location", value: project.location },
                      { icon: Calendar, label: "Start Date", value: project.startDate },
                      { icon: Calendar, label: "End Date", value: project.endDate },
                      { icon: DollarSign, label: "Budget", value: `$${project.budget.toLocaleString()}` },
                    ].map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <Box key={idx} sx={{ pb: 1.5, borderBottom: `1px solid ${colors.border}` }}>
                          <Typography sx={{ fontSize: "0.75rem", color: colors.textMuted, mb: 0.5, display: "flex", alignItems: "center", gap: 1 }}>
                            <Icon size={14} /> {item.label}
                          </Typography>
                          <Typography sx={{ fontSize: "0.95rem", fontWeight: 600, color: colors.text }}>
                            {item.value}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* Tab: Milestones */}
          {tab === 1 && (
            <Paper sx={{ backgroundColor: colors.bgPanel, border: `1px solid ${colors.border}`, p: 3 }}>
              <SectionLabel>Project Milestones</SectionLabel>
              <Stack spacing={2}>
                {project.milestones.map((milestone, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      p: 2,
                      border: `1px solid ${colors.border}`,
                      borderRadius: "8px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 600, color: colors.text, mb: 0.5 }}>
                        {milestone.name}
                      </Typography>
                      <Typography sx={{ fontSize: "0.85rem", color: colors.textMuted }}>
                        {milestone.date}
                      </Typography>
                    </Box>
                    <Chip
                      label={milestone.status === "completed" ? "Completed" : milestone.status === "in_progress" ? "In Progress" : "Pending"}
                      size="small"
                      sx={{
                        backgroundColor:
                          milestone.status === "completed"
                            ? "#dcfce7"
                            : milestone.status === "in_progress"
                            ? "#dbeafe"
                            : "#fef9c3",
                        color:
                          milestone.status === "completed"
                            ? "#15803d"
                            : milestone.status === "in_progress"
                            ? "#1d4ed8"
                            : "#854d0e",
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            </Paper>
          )}

          {/* Tab: Management */}
          {tab === 2 && (
            <Paper sx={{ backgroundColor: colors.bgPanel, border: `1px solid ${colors.border}`, p: 3 }}>
              <SectionLabel>Project Management</SectionLabel>
              <Stack spacing={2}>
                {/* Title - Full Width */}
                <TextField
                  fullWidth
                  label="Title"
                  value={formData.title || ""}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                  disabled={!isEditing}
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                  }}
                />

                {/* Two Column Row */}
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                  <TextField
                    label="Manager"
                    value={formData.manager || ""}
                    onChange={(e) => handleFieldChange("manager", e.target.value)}
                    disabled={!isEditing}
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                    }}
                  />
                  <TextField
                    label="Status"
                    value={formData.status || ""}
                    onChange={(e) => handleFieldChange("status", e.target.value)}
                    disabled={!isEditing}
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                    }}
                  />
                </Box>

                {/* Two Column Row */}
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                  <TextField
                    label="Budget"
                    type="number"
                    value={formData.budget || ""}
                    onChange={(e) => handleFieldChange("budget", e.target.value)}
                    disabled={!isEditing}
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                    }}
                  />
                  <TextField
                    label="Progress (%)"
                    type="number"
                    value={formData.progress || ""}
                    onChange={(e) => handleFieldChange("progress", e.target.value)}
                    disabled={!isEditing}
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                    }}
                  />
                </Box>

                {/* Location - Full Width */}
                <TextField
                  fullWidth
                  label="Location"
                  value={formData.location || ""}
                  onChange={(e) => handleFieldChange("location", e.target.value)}
                  disabled={!isEditing}
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                  }}
                />

                {/* Description - Full Width */}
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={6}
                  value={formData.description || ""}
                  onChange={(e) => handleFieldChange("description", e.target.value)}
                  disabled={!isEditing}
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                  }}
                />
              </Stack>
            </Paper>
          )}

          {/* Tab: Attachments */}
          {tab === 3 && (
            <Paper sx={{ backgroundColor: colors.bgPanel, border: `1px solid ${colors.border}`, p: 3 }}>
              <SectionLabel>Attachments</SectionLabel>
              <Stack spacing={1}>
                {project.attachments.map((attachment, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      p: 2,
                      border: `1px solid ${colors.border}`,
                      borderRadius: "6px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 600, color: colors.text }}>
                        {attachment.name}
                      </Typography>
                      <Typography sx={{ fontSize: "0.85rem", color: colors.textMuted }}>
                        {attachment.size}
                      </Typography>
                    </Box>
                    <Button variant="outlined" size="small" sx={{ textTransform: "none" }}>
                      Download
                    </Button>
                  </Box>
                ))}
              </Stack>
            </Paper>
          )}
        </Box>

        {/* Snackbar */}
        <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })}>
          <Alert severity={snack.severity}>{snack.message}</Alert>
        </Snackbar>
      </Box>
    </DashboardLayout>
  );
}
