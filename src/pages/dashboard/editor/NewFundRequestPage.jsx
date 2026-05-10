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
import { ArrowLeft, Save, DollarSign } from 'lucide-react';

const ACCENT = "#61C5C3";
const PRIMARY = "#FF8C00";

const requestTypes = [
  { value: 'grant', label: 'Grant' },
  { value: 'investment', label: 'Investment' },
  { value: 'loan', label: 'Loan' },
];

const priorities = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const categories = [
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'technology', label: 'Technology' },
];

export default function NewFundRequestPage() {
  const navigate = useNavigate();
  const colors = useThemeColors();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'grant',
    amount: '',
    currency: 'USD',
    company: '',
    email: '',
    category: 'agriculture',
    priority: 'medium',
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
    console.log('New Fund Request:', formData);
    // Navigate back to funds list after submission
    navigate('/dashboard/editor/funds');
  };

  const handleCancel = () => {
    navigate('/dashboard/editor/funds');
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
              New Fund Request
            </Typography>
            <Typography sx={{ color: colors.textMuted, fontSize: "0.9rem" }}>
              Submit a funding request for your project or initiative
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
            Back to Fund Requests
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
                  Request Title *
                </Typography>
                <TextField
                  fullWidth
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange('title')(e)}
                  placeholder="Enter request title"
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
                  placeholder="Describe your funding request"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    },
                  }}
                />
              </Box>

              {/* Request Type - 6 Columns */}
              <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / span 6' } }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, mb: 1, color: colors.text }}
                >
                  Request Type *
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>Request Type</InputLabel>
                  <Select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type')(e)}
                  >
                    {requestTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Amount - 6 Columns */}
              <Box sx={{ gridColumn: { xs: '1 / -1', md: '7 / -1' } }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, mb: 1, color: colors.text }}
                >
                  Amount (USD) *
                </Typography>
                <TextField
                  fullWidth
                  required
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount')(e)}
                  placeholder="Enter amount in USD"
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

              {/* Company Name - 6 Columns */}
              <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / span 6' } }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, mb: 1, color: colors.text }}
                >
                  Company Name *
                </Typography>
                <TextField
                  fullWidth
                  required
                  value={formData.company}
                  onChange={(e) => handleInputChange('company')(e)}
                  placeholder="Enter company name"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    },
                  }}
                />
              </Box>

              {/* Contact Email - 6 Columns */}
              <Box sx={{ gridColumn: { xs: '1 / -1', md: '7 / -1' } }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, mb: 1, color: colors.text }}
                >
                  Contact Email *
                </Typography>
                <TextField
                  fullWidth
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email')(e)}
                  placeholder="Enter contact email"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    },
                  }}
                />
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
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category')(e)}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.value} value={category.value}>
                        {category.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
