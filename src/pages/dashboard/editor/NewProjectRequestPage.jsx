import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useThemeColors } from '../../../utils/useThemeColors';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { ArrowLeft, Save, Briefcase, TrendingUp, AlertCircle } from 'lucide-react';

const ACCENT = "#61C5C3";
const PRIMARY = "#FF8C00";

const projectTypes = [
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'education', label: 'Education' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'technology', label: 'Technology' },
  { value: 'manufacturing', label: 'Manufacturing' },
];

const priorities = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

const regions = [
  { value: 'central', label: 'Central Region' },
  { value: 'eastern', label: 'Eastern Region' },
  { value: 'western', label: 'Western Region' },
  { value: 'northern', label: 'Northern Region' },
  { value: 'southern', label: 'Southern Region' },
];

export default function NewProjectRequestPage() {
  const navigate = useNavigate();
  const colors = useThemeColors();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fullDescription: '',
    type: 'infrastructure',
    priority: 'medium',
    country: '',
    region: '',
    budget: '',
    progress: 0,
    startDate: '',
    endDate: '',
  });

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you would typically save the data
    console.log('New Project Request:', formData);
    // Navigate back to projects list after submission
    navigate('/dashboard/editor/projects');
  };

  const handleCancel = () => {
    navigate('/dashboard/editor/projects');
  };

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
              New Project Request
            </Typography>
            <Typography sx={{ color: colors.textMuted, fontSize: "0.9rem" }}>
              Submit a new project request for development initiatives
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<ArrowLeft size={18} />}
            onClick={handleCancel}
            sx={{
              color: colors.textMuted,
              borderColor: colors.border,
              textTransform: "none",
              fontSize: "0.9rem",
            }}
          >
            Back to Project Requests
          </Button>
        </Box>

        {/* Form */}
        <Paper
          sx={{
            p: 4,
            borderRadius: 2,
            border: `1px solid ${colors.border}`,
          }}
        >
          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }}>
              {/* Title - Full Width */}
              <Box sx={{ gridColumn: '1 / -1' }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, mb: 1, color: colors.text }}
                >
                  Project Title *
                </Typography>
                <TextField
                  fullWidth
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange('title')(e)}
                  placeholder="Enter project title"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    },
                  }}
                />
              </Box>

              {/* Description - Full Width */}
              <Box sx={{ gridColumn: '1 / -1' }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, mb: 1, color: colors.text }}
                >
                  Description *
                </Typography>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description')(e)}
                  placeholder="Describe your project"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    },
                  }}
                />
              </Box>

              {/* Full Description - Full Width */}
              <Box sx={{ gridColumn: '1 / -1' }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, mb: 1, color: colors.text }}
                >
                  Full Description
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  value={formData.fullDescription}
                  onChange={(e) => handleInputChange('fullDescription')(e)}
                  placeholder="Provide comprehensive project details"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    },
                  }}
                />
              </Box>

              {/* Project Type - 6 Columns */}
              <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / span 6' } }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, mb: 1, color: colors.text }}
                >
                  Project Type *
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>Project Type</InputLabel>
                  <Select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type')(e)}
                  >
                    {projectTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Priority - 6 Columns */}
              <Box sx={{ gridColumn: { xs: '1 / -1', md: '7 / -1' } }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, mb: 1, color: colors.text }}
                >
                  Priority *
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority')(e)}
                  >
                    {priorities.map((priority) => (
                      <MenuItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Country - 6 Columns */}
              <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / span 6' } }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, mb: 1, color: colors.text }}
                >
                  Country *
                </Typography>
                <TextField
                  fullWidth
                  required
                  value={formData.country}
                  onChange={(e) => handleInputChange('country')(e)}
                  placeholder="Enter country name"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    },
                  }}
                />
              </Box>

              {/* Region - 6 Columns */}
              <Box sx={{ gridColumn: { xs: '1 / -1', md: '7 / -1' } }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, mb: 1, color: colors.text }}
                >
                  Region *
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>Region</InputLabel>
                  <Select
                    value={formData.region}
                    onChange={(e) => handleInputChange('region')(e)}
                  >
                    {regions.map((region) => (
                      <MenuItem key={region.value} value={region.value}>
                        {region.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Budget - 6 Columns */}
              <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / span 6' } }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, mb: 1, color: colors.text }}
                >
                  Budget (USD) *
                </Typography>
                <TextField
                  fullWidth
                  required
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget')(e)}
                  placeholder="Enter project budget"
                  InputProps={{
                    startAdornment: <DollarSign size={18} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    },
                  }}
                />
              </Box>

              {/* Progress - 6 Columns */}
              <Box sx={{ gridColumn: { xs: '1 / -1', md: '7 / -1' } }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, mb: 1, color: colors.text }}
                >
                  Progress (%)
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  value={formData.progress}
                  onChange={(e) => handleInputChange('progress')(e)}
                  placeholder="Expected progress"
                  InputProps={{
                    startAdornment: <TrendingUp size={18} />,
                    inputProps: { min: 0, max: 100 },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    },
                  }}
                />
              </Box>

              {/* Start Date - 6 Columns */}
              <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / span 6' } }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, mb: 1, color: colors.text }}
                >
                  Start Date *
                </Typography>
                <TextField
                  fullWidth
                  required
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate')(e)}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    },
                  }}
                />
              </Box>

              {/* End Date - 6 Columns */}
              <Box sx={{ gridColumn: { xs: '1 / -1', md: '7 / -1' } }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, mb: 1, color: colors.text }}
                >
                  End Date *
                </Typography>
                <TextField
                  fullWidth
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate')(e)}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    },
                  }}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Action Buttons */}
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                sx={{
                  flex: 1,
                  color: colors.textMuted,
                  borderColor: colors.border,
                  textTransform: "none",
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<Save size={18} />}
                sx={{
                  flex: 1,
                  backgroundColor: ACCENT,
                  color: "white",
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                Submit Request
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </DashboardLayout>
  );
}
