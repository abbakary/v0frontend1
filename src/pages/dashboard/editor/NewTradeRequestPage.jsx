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
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { ArrowLeft, Save, Globe, Truck, DollarSign } from 'lucide-react';

const ACCENT = "#61C5C3";
const PRIMARY = "#FF8C00";

const tradeTypes = [
  { value: 'export', label: 'Export' },
  { value: 'import', label: 'Import' },
];

const priorities = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const countries = [
  { value: 'kenya', label: 'Kenya' },
  { value: 'nigeria', label: 'Nigeria' },
  { value: 'uganda', label: 'Uganda' },
  { value: 'ghana', label: 'Ghana' },
  { value: 'germany', label: 'Germany' },
  { value: 'china', label: 'China' },
  { value: 'usa', label: 'USA' },
];

export default function NewTradeRequestPage() {
  const navigate = useNavigate();
  const colors = useThemeColors();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'export',
    value: '',
    currency: 'USD',
    volume: '',
    origin: '',
    destination: '',
    priority: 'medium',
    category: 'Agriculture',
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
    console.log('New Trade Request:', formData);
    // Navigate back to trades list after submission
    navigate('/dashboard/editor/trades');
  };

  const handleCancel = () => {
    navigate('/dashboard/editor/trades');
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
              New Trade Request
            </Typography>
            <Typography sx={{ color: colors.textMuted, fontSize: "0.9rem" }}>
              Create a new trade request for international commerce
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
            Back to Trade Requests
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
                  Trade Title *
                </Typography>
                <TextField
                  fullWidth
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange('title')(e)}
                  placeholder="Enter trade title"
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
                  placeholder="Describe the trade request"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    },
                  }}
                />
              </Box>

              {/* Trade Type - 4 Columns */}
              <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / span 4' } }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, mb: 1, color: colors.text }}
                >
                  Trade Type *
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>Trade Type</InputLabel>
                  <Select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type')(e)}
                  >
                    {tradeTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Value - 4 Columns */}
              <Box sx={{ gridColumn: { xs: '1 / -1', md: '5 / span 4' } }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, mb: 1, color: colors.text }}
                >
                  Value (USD) *
                </Typography>
                <TextField
                  fullWidth
                  required
                  type="number"
                  value={formData.value}
                  onChange={(e) => handleInputChange('value')(e)}
                  placeholder="Enter value in USD"
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

              {/* Volume - 4 Columns */}
              <Box sx={{ gridColumn: { xs: '1 / -1', md: '9 / span 4' } }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, mb: 1, color: colors.text }}
                >
                  Volume *
                </Typography>
                <TextField
                  fullWidth
                  required
                  value={formData.volume}
                  onChange={(e) => handleInputChange('volume')(e)}
                  placeholder="e.g., 500 metric tons, 200 units"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    },
                  }}
                />
              </Box>

              {/* Origin - 6 Columns */}
              <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / span 6' } }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, mb: 1, color: colors.text }}
                >
                  Origin *
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>Origin Country</InputLabel>
                  <Select
                    value={formData.origin}
                    onChange={(e) => handleInputChange('origin')(e)}
                  >
                    {countries.map((country) => (
                      <MenuItem key={country.value} value={country.value}>
                        {country.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Destination - 6 Columns */}
              <Box sx={{ gridColumn: { xs: '1 / -1', md: '7 / -1' } }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, mb: 1, color: colors.text }}
                >
                  Destination *
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>Destination Country</InputLabel>
                  <Select
                    value={formData.destination}
                    onChange={(e) => handleInputChange('destination')(e)}
                  >
                    {countries.map((country) => (
                      <MenuItem key={country.value} value={country.value}>
                        {country.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Priority - 6 Columns */}
              <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / span 6' } }}>
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

              {/* Category - 6 Columns */}
              <Box sx={{ gridColumn: { xs: '1 / -1', md: '7 / -1' } }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, mb: 1, color: colors.text }}
                >
                  Category
                </Typography>
                <TextField
                  fullWidth
                  value={formData.category}
                  onChange={(e) => handleInputChange('category')(e)}
                  placeholder="e.g., Agriculture, Manufacturing, Technology"
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
