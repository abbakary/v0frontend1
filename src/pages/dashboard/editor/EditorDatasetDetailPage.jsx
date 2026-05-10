import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Paper,
  Grid,
  Stack,
  TextareaAutosize,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { ArrowLeft, Save, FileText, CheckCircle, XCircle } from 'lucide-react';
import { useThemeColors } from '../../../utils/useThemeColors';
import { editorDatasetService, datasetService } from '../../../utils/apiService';

export default function EditorDatasetDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const themeColors = useThemeColors();

  const [dataset, setDataset] = useState(null);
  const [reviewLogs, setReviewLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const [reviewForm, setReviewForm] = useState({
    verdict: 'pending',
    notes: '',
    metadata_updates: {},
  });

  useEffect(() => {
    fetchDataset();
    fetchReviewLogs();
  }, [id]);

  const fetchDataset = async () => {
    try {
      const response = await editorDatasetService.get(id);
      const data = response?.data?.data || response?.data;
      if (data) {
        setDataset(data);
      }
    } catch (err) {
      setError('Failed to load dataset');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviewLogs = async () => {
    try {
      const response = await editorDatasetService.reviewLogs(id);
      const logs = response?.data?.data || response?.data || [];
      setReviewLogs(Array.isArray(logs) ? logs : []);
    } catch (err) {
      console.error('Failed to load review logs:', err);
    }
  };

  const handleReviewSubmit = async () => {
    if (!reviewForm.verdict || reviewForm.verdict === 'pending') {
      setError('Please select a verdict');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccessMessage('');

    try {
      const payload = {
        verdict: reviewForm.verdict,
        notes: reviewForm.notes,
        metadata_updates: reviewForm.metadata_updates,
      };

      await editorDatasetService.submitReview(id, payload);
      setSuccessMessage('Review submitted successfully!');
      setTimeout(() => {
        navigate('/dashboard/editor/datasets');
      }, 2000);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to submit review');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="editor">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  if (!dataset) {
    return (
      <DashboardLayout role="editor">
        <Box sx={{ maxWidth: 1200, mx: 'auto', py: 3, px: 2 }}>
          <Alert severity="error">Dataset not found</Alert>
          <Button startIcon={<ArrowLeft size={18} />} onClick={() => navigate('/dashboard/editor/datasets')}>
            Back to Datasets
          </Button>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="editor">
      <Box sx={{ maxWidth: 1200, mx: 'auto', py: 3, px: 2 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowLeft size={18} />}
            onClick={() => navigate('/dashboard/editor/datasets')}
            sx={{ mb: 2, textTransform: 'none' }}
          >
            Back to Datasets
          </Button>
          <Typography variant="h5" sx={{ fontWeight: 700, color: themeColors.text }}>
            Review Dataset
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

        <Grid container spacing={3}>
          {/* Dataset Details */}
          <Grid item xs={12} md={7}>
            <Card sx={{ boxShadow: 'none', border: `1px solid ${themeColors.border}` }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                  Dataset Information
                </Typography>

                <Stack spacing={2}>
                  <Box>
                    <Typography sx={{ fontSize: '12px', color: themeColors.textSecondary, fontWeight: 600, mb: 1 }}>
                      TITLE
                    </Typography>
                    <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>{dataset.title}</Typography>
                  </Box>

                  <Box>
                    <Typography sx={{ fontSize: '12px', color: themeColors.textSecondary, fontWeight: 600, mb: 1 }}>
                      DESCRIPTION
                    </Typography>
                    <Typography sx={{ fontSize: '14px', whiteSpace: 'pre-wrap' }}>
                      {dataset.description || '-'}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography sx={{ fontSize: '12px', color: themeColors.textSecondary, fontWeight: 600, mb: 1 }}>
                      CATEGORY
                    </Typography>
                    <Typography sx={{ fontSize: '14px' }}>{dataset.category_name || dataset.category?.name || '-'}</Typography>
                  </Box>

                  <Box>
                    <Typography sx={{ fontSize: '12px', color: themeColors.textSecondary, fontWeight: 600, mb: 1 }}>
                      REGION
                    </Typography>
                    <Typography sx={{ fontSize: '14px' }}>{dataset.region || dataset.spatial_coverage || '-'}</Typography>
                  </Box>

                  <Box>
                    <Typography sx={{ fontSize: '12px', color: themeColors.textSecondary, fontWeight: 600, mb: 1 }}>
                      COUNTRY
                    </Typography>
                    <Typography sx={{ fontSize: '14px' }}>{dataset.country || '-'}</Typography>
                  </Box>

                  <Box>
                    <Typography sx={{ fontSize: '12px', color: themeColors.textSecondary, fontWeight: 600, mb: 1 }}>
                      STATUS
                    </Typography>
                    <Typography sx={{ fontSize: '14px' }}>{dataset.status || dataset.approval_status || '-'}</Typography>
                  </Box>

                  <Box>
                    <Typography sx={{ fontSize: '12px', color: themeColors.textSecondary, fontWeight: 600, mb: 1 }}>
                      CREATED
                    </Typography>
                    <Typography sx={{ fontSize: '14px' }}>
                      {dataset.created_at ? new Date(dataset.created_at).toLocaleString() : '-'}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Review Form */}
          <Grid item xs={12} md={5}>
            <Card sx={{ boxShadow: 'none', border: `1px solid ${themeColors.border}` }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                  Review Form
                </Typography>

                <Stack spacing={3}>
                  {/* Verdict */}
                  <FormControl fullWidth size="small">
                    <InputLabel>Verdict *</InputLabel>
                    <Select
                      value={reviewForm.verdict}
                      onChange={(e) => setReviewForm({ ...reviewForm, verdict: e.target.value })}
                      label="Verdict *"
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="approved">
                        <CheckCircle size={16} style={{ marginRight: 8 }} />
                        Approved
                      </MenuItem>
                      <MenuItem value="rejected">
                        <XCircle size={16} style={{ marginRight: 8 }} />
                        Rejected
                      </MenuItem>
                      <MenuItem value="changes_requested">Changes Requested</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Notes */}
                  <Box>
                    <Typography sx={{ fontSize: '12px', color: themeColors.textSecondary, fontWeight: 600, mb: 1 }}>
                      Review Notes
                    </Typography>
                    <TextareaAutosize
                      minRows={4}
                      placeholder="Add your review notes, feedback, or required changes..."
                      value={reviewForm.notes}
                      onChange={(e) => setReviewForm({ ...reviewForm, notes: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        border: `1px solid ${themeColors.border}`,
                        fontFamily: 'inherit',
                        fontSize: '14px',
                      }}
                    />
                  </Box>

                  {/* Action Buttons */}
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      onClick={handleReviewSubmit}
                      disabled={submitting}
                      sx={{ flex: 1 }}
                    >
                      {submitting ? 'Submitting...' : 'Submit Review'}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/dashboard/editor/datasets')}
                      disabled={submitting}
                      sx={{ flex: 1 }}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Review History */}
          {reviewLogs.length > 0 && (
            <Grid item xs={12}>
              <Card sx={{ boxShadow: 'none', border: `1px solid ${themeColors.border}` }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                    Review History
                  </Typography>

                  <Stack spacing={2}>
                    {reviewLogs.map((log, idx) => (
                      <Paper
                        key={idx}
                        sx={{
                          p: 2,
                          backgroundColor: themeColors.surface,
                          borderLeft: `4px solid #7F77DD`,
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                          <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>
                            {log.reviewer_name || 'Editor'}
                          </Typography>
                          <Typography sx={{ fontSize: '12px', color: themeColors.textSecondary }}>
                            {log.reviewed_at ? new Date(log.reviewed_at).toLocaleString() : ''}
                          </Typography>
                        </Stack>
                        <Typography sx={{ fontSize: '13px', color: themeColors.textSecondary, mb: 1 }}>
                          Verdict:{' '}
                          <span style={{ fontWeight: 600, color: themeColors.text }}>
                            {log.verdict || '-'}
                          </span>
                        </Typography>
                        {log.notes && (
                          <Typography sx={{ fontSize: '13px', whiteSpace: 'pre-wrap' }}>
                            {log.notes}
                          </Typography>
                        )}
                      </Paper>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Box>
    </DashboardLayout>
  );
}
