import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextareaAutosize,
  Grid,
} from '@mui/material';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { useThemeColors } from '../../../utils/useThemeColors';
import { tradeService } from '../../../utils/apiService';

export default function AdminTradeDetailPage() {
  const navigate = useNavigate();
  const { tradeId } = useParams();
  const [searchParams] = useSearchParams();
  const themeColors = useThemeColors();

  const isEdit = searchParams.get('mode') === 'edit' || !!tradeId;
  const isNew = !tradeId;

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Export',
    status: 'pending',
    value: '',
    currency: 'USD',
    origin: '',
    destination: '',
    volume: '',
    category: '',
    priority: 'medium',
    metadata: {},
  });

  // Fetch trade if editing
  useEffect(() => {
    if (isNew) {
      setLoading(false);
      return;
    }

    const fetchTrade = async () => {
      try {
        const response = await tradeService.get(tradeId);
        const data = response?.data?.data || response?.data;
        if (data) {
          setFormData({
            title: data.title || '',
            description: data.description || '',
            type: data.type || data.trade_type || 'Export',
            status: data.status || 'pending',
            value: data.value || data.total_value || '',
            currency: data.currency || 'USD',
            origin: data.origin || data.country_of_origin || '',
            destination: data.destination || data.country_of_destination || '',
            volume: data.volume || '',
            category: data.category || '',
            priority: data.priority || 'medium',
            metadata: data.metadata || {},
          });
        }
      } catch (err) {
        setError('Failed to load trade');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrade();
  }, [tradeId, isNew]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        status: formData.status,
        value: parseFloat(formData.value) || 0,
        currency: formData.currency,
        origin: formData.origin,
        destination: formData.destination,
        volume: formData.volume,
        category: formData.category,
        priority: formData.priority,
        metadata: formData.metadata,
      };

      if (isNew) {
        await tradeService.create(payload);
      } else {
        await tradeService.update(tradeId, payload);
      }

      navigate('/dashboard/admin/trades');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save trade');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this trade? This action cannot be undone.')) {
      return;
    }

    setSaving(true);
    try {
      await tradeService.delete(tradeId);
      navigate('/dashboard/admin/trades');
    } catch (err) {
      setError('Failed to delete trade');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box sx={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <Button
            onClick={() => navigate('/dashboard/admin/trades')}
            startIcon={<ArrowLeft size={20} />}
            sx={{ textTransform: 'none', color: '#61C5C3' }}
          >
            Back
          </Button>
          <Typography variant="h4" sx={{ fontWeight: 700, color: themeColors.text }}>
            {isNew ? 'Create Trade' : 'Edit Trade'}
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Box
            sx={{
              padding: '16px',
              background: 'rgba(239,68,68,0.15)',
              borderRadius: '8px',
              marginBottom: '24px',
              color: '#EF4444',
              border: '1px solid rgba(239,68,68,0.3)',
            }}
          >
            {error}
          </Box>
        )}

        {/* Form Card */}
        <Card sx={{ background: themeColors.card, border: `1px solid ${themeColors.border}`, marginBottom: '24px' }}>
          <CardContent sx={{ padding: '24px' }}>
            <Grid container spacing={24}>
              {/* Title */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                  InputLabelProps={{ style: { color: themeColors.textMuted } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: themeColors.text,
                      '& fieldset': { borderColor: themeColors.border },
                    },
                  }}
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ marginBottom: '8px', color: themeColors.textMuted }}>
                  Description
                </Typography>
                <TextareaAutosize
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  minRows={4}
                  maxRows={8}
                  placeholder="Enter trade description"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '6px',
                    border: `1px solid ${themeColors.border}`,
                    backgroundColor: themeColors.card,
                    color: themeColors.text,
                    fontFamily: 'inherit',
                    fontSize: '14px',
                    resize: 'vertical',
                  }}
                />
              </Grid>

              {/* Type and Status */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: themeColors.textMuted }}>Type</InputLabel>
                  <Select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    label="Type"
                    sx={{
                      color: themeColors.text,
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: themeColors.border },
                    }}
                  >
                    <MenuItem value="Export">Export</MenuItem>
                    <MenuItem value="Import">Import</MenuItem>
                    <MenuItem value="Domestic">Domestic</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: themeColors.textMuted }}>Status</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    label="Status"
                    sx={{
                      color: themeColors.text,
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: themeColors.border },
                    }}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Value and Currency */}
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="Value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => handleInputChange('value', e.target.value)}
                  InputLabelProps={{ style: { color: themeColors.textMuted } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: themeColors.text,
                      '& fieldset': { borderColor: themeColors.border },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: themeColors.textMuted }}>Currency</InputLabel>
                  <Select
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    label="Currency"
                    sx={{
                      color: themeColors.text,
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: themeColors.border },
                    }}
                  >
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="EUR">EUR</MenuItem>
                    <MenuItem value="GBP">GBP</MenuItem>
                    <MenuItem value="KES">KES</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Origin and Destination */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Origin"
                  value={formData.origin}
                  onChange={(e) => handleInputChange('origin', e.target.value)}
                  placeholder="Country of origin"
                  InputLabelProps={{ style: { color: themeColors.textMuted } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: themeColors.text,
                      '& fieldset': { borderColor: themeColors.border },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Destination"
                  value={formData.destination}
                  onChange={(e) => handleInputChange('destination', e.target.value)}
                  placeholder="Country of destination"
                  InputLabelProps={{ style: { color: themeColors.textMuted } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: themeColors.text,
                      '& fieldset': { borderColor: themeColors.border },
                    },
                  }}
                />
              </Grid>

              {/* Volume and Category */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Volume"
                  value={formData.volume}
                  onChange={(e) => handleInputChange('volume', e.target.value)}
                  placeholder="e.g., 500 metric tons"
                  InputLabelProps={{ style: { color: themeColors.textMuted } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: themeColors.text,
                      '& fieldset': { borderColor: themeColors.border },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  placeholder="e.g., Agriculture, Manufacturing"
                  InputLabelProps={{ style: { color: themeColors.textMuted } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: themeColors.text,
                      '& fieldset': { borderColor: themeColors.border },
                    },
                  }}
                />
              </Grid>

              {/* Priority */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: themeColors.textMuted }}>Priority</InputLabel>
                  <Select
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    label="Priority"
                    sx={{
                      color: themeColors.text,
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: themeColors.border },
                    }}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/dashboard/admin/trades')}
            sx={{ textTransform: 'none', color: themeColors.textMuted, borderColor: themeColors.border }}
          >
            Cancel
          </Button>

          {!isNew && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<Trash2 size={18} />}
              onClick={handleDelete}
              disabled={saving}
              sx={{ textTransform: 'none' }}
            >
              Delete
            </Button>
          )}

          <Button
            variant="contained"
            startIcon={<Save size={18} />}
            onClick={handleSave}
            disabled={saving || !formData.title}
            sx={{
              background: '#61C5C3',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { background: '#4fb3b1' },
              '&:disabled': { opacity: 0.5 },
            }}
          >
            {saving ? 'Saving...' : 'Save Trade'}
          </Button>
        </Box>
      </Box>
    </DashboardLayout>
  );
}
