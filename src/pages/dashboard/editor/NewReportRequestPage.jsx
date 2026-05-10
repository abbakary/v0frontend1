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
import { ArrowLeft, Save, FileText, User, Calendar, Globe } from 'lucide-react';

const ACCENT = "#61C5C3";
const PRIMARY = "#FF8C00";

const reportTypes = [
  { value: 'research', label: 'Research' },
  { value: 'analysis', label: 'Analysis' },
  { value: 'whitepaper', label: 'Whitepaper' },
  { value: 'case_study', label: 'Case Study' },
];

const priorities = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const languages = [
  { value: 'english', label: 'English' },
  { value: 'french', label: 'French' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'arabic', label: 'Arabic' },
];

export default function NewReportRequestPage() {
  const navigate = useNavigate();
  const colors = useThemeColors();
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    description: '',
    fullDescription: '',
    reportType: 'research',
    author: '',
    publisher: '',
    publishedYear: new Date().getFullYear(),
    language: 'english',
    pageCount: 0,
    fileFormat: 'PDF',
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
    console.log('New Report Request:', formData);
    // Navigate back to reports list after submission
    navigate('/dashboard/editor/reports');
  };

  const handleCancel = () => {
    navigate('/dashboard/editor/reports');
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
              New Report Request
            </Typography>
            <Typography sx={{ color: colors.textMuted, fontSize: "0.9rem" }}>
              Submit a new analysis report for publication
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
            Back to Report Requests
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
                  Report Title *
                </Typography>
                <TextField
                  fullWidth
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange('title')(e)}
                  placeholder="Enter report title"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    },
                  }}
                />
              </Box>

              {/* Summary - Full Width */}
              <Box sx={{ gridColumn: '1 / -1' }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, mb: 1, color: colors.text }}
                >
                  Summary *
                </Typography>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={3}
                  value={formData.summary}
                  onChange={(e) => handleInputChange('summary')(e)}
                  placeholder="Brief summary of the report"
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
                  placeholder="Provide comprehensive report details"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    },
                  }}
                />
              </Box>

              {/* Report Type - 6 Columns */}
              <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / span 6' } }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, mb: 1, color: colors.text }}
                >
                  Report Type *
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>Report Type</InputLabel>
                  <Select
                    value={formData.reportType}
                    onChange={(e) => handleInputChange('reportType')(e)}
                  >
                    {reportTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Placeholder for spacing - 6 Columns */}
              <Box sx={{ gridColumn: { xs: '1 / -1', md: '7 / -1' } }} />

              {/* Author - 6 Columns */}
              <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / span 6' } }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, mb: 1, color: colors.text }}
                >
                  Author *
                </Typography>
                <TextField
                  fullWidth
                  required
                  value={formData.author}
                  onChange={(e) => handleInputChange('author')(e)}
                  placeholder="Enter author name"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    },
                  }}
                />
              </Box>

              {/* Publisher - 6 Columns */}
              <Box sx={{ gridColumn: { xs: '1 / -1', md: '7 / -1' } }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, mb: 1, color: colors.text }}
                >
                  Publisher *
                </Typography>
                <TextField
                  fullWidth
                  required
                  value={formData.publisher}
                  onChange={(e) => handleInputChange('publisher')(e)}
                  placeholder="Enter publisher name"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    },
                  }}
                />
              </Box>

              {/* Published Year - 6 Columns */}
              <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / span 6' } }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, mb: 1, color: colors.text }}
                >
                  Published Year *
                </Typography>
                <TextField
                  fullWidth
                  required
                  type="number"
                  value={formData.publishedYear}
                  onChange={(e) => handleInputChange('publishedYear')(e)}
                  placeholder="Enter publication year"
                  InputProps={{
                    inputProps: { min: 2000, max: 2030 },
                    startAdornment: <Calendar size={18} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    },
                  }}
                />
              </Box>

              {/* Language - 6 Columns */}
              <Box sx={{ gridColumn: { xs: '1 / -1', md: '7 / -1' } }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, mb: 1, color: colors.text }}
                >
                  Language *
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={formData.language}
                    onChange={(e) => handleInputChange('language')(e)}
                  >
                    {languages.map((language) => (
                      <MenuItem key={language.value} value={language.value}>
                        {language.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Page Count - 6 Columns */}
              <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / span 6' } }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, mb: 1, color: colors.text }}
                >
                  Page Count
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  value={formData.pageCount}
                  onChange={(e) => handleInputChange('pageCount')(e)}
                  placeholder="Number of pages"
                  InputProps={{
                    inputProps: { min: 1 },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    },
                  }}
                />
              </Box>

              {/* File Format - 6 Columns */}
              <Box sx={{ gridColumn: { xs: '1 / -1', md: '7 / -1' } }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, mb: 1, color: colors.text }}
                >
                  File Format *
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>File Format</InputLabel>
                  <Select
                    value={formData.fileFormat}
                    onChange={(e) => handleInputChange('fileFormat')(e)}
                  >
                    <MenuItem value="PDF">PDF</MenuItem>
                    <MenuItem value="DOC">DOC</MenuItem>
                    <MenuItem value="HTML">HTML</MenuItem>
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
