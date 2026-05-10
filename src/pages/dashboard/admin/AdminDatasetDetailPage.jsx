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
import { datasetService, categoryService } from '../../../utils/apiService';

export default function AdminDatasetDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const themeColors = useThemeColors();

  const isEdit = searchParams.get('mode') === 'edit' || !!id;
  const isNew = !id;

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    category_name: '',
    country: '',
    region: '',
    status: 'pending',
    data_type: '',
    is_featured: false,
    is_downloadable: true,
    metadata: {},
  });

  // Fetch dataset if editing
  useEffect(() => {
    if (isNew) {
      setLoading(false);
      return;
    }

    const fetchDataset = async () => {
      try {
        const response = await datasetService.get(id);
        const data = response?.data?.data || response?.data;
        if (data) {
          setFormData({
            title: data.title || '',
            description: data.description || '',
            category_id: data.category_id || '',
            category_name: data.category_name || data.category?.name || '',
            country: data.country || '',
            region: data.region || data.spatial_coverage || '',
            status: data.status || data.approval_status || 'pending',
            data_type: data.data_type || '',
            is_featured: data.is_featured || false,
            is_downloadable: data.is_downloadable !== false,
            metadata: data.metadata || {},
          });
        }
      } catch (err) {
        setError('Failed to load dataset');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDataset();
  }, [id, isNew]);

  // Fetch categories
  useEffect(() => {
    categoryService
      .list()
      .then((res) => {
        const data = res?.data?.data || res?.data || [];
        setCategories(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error('Failed to load categories:', err));
  }, []);

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
        category_id: formData.category_id,
        category_name: formData.category_name,
        country: formData.country,
        region: formData.region,
        status: formData.status,
        data_type: formData.data_type,
        is_featured: formData.is_featured,
        is_downloadable: formData.is_downloadable,
        metadata: formData.metadata,
      };

      if (isNew) {
        await datasetService.create(payload);
      } else {
        await datasetService.update(id, payload);
      }

      navigate('/dashboard/admin/datasets');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save dataset');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this dataset? This action cannot be undone.')) {
      return;
    }

    setSaving(true);
    try {
      await datasetService.delete(id);
      navigate('/dashboard/admin/datasets');
    } catch (err) {
      setError('Failed to delete dataset');
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
            onClick={() => navigate('/dashboard/admin/datasets')}
            startIcon={<ArrowLeft size={20} />}
            sx={{ textTransform: 'none', color: '#61C5C3' }}
          >
            Back
          </Button>
          <Typography variant="h4" sx={{ fontWeight: 700, color: themeColors.text }}>
            {isNew ? 'Create Dataset' : 'Edit Dataset'}
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
                  placeholder="Enter dataset description"
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

              {/* Grid: Category, Country, Region, Status */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: themeColors.textMuted }}>Category</InputLabel>
                  <Select
                    value={formData.category_id}
                    onChange={(e) => handleInputChange('category_id', e.target.value)}
                    label="Category"
                    sx={{
                      color: themeColors.text,
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: themeColors.border },
                    }}
                  >
                    <MenuItem value="">— None —</MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
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
                  label="Region"
                  value={formData.region}
                  onChange={(e) => handleInputChange('region', e.target.value)}
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
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Data Type */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Data Type"
                  value={formData.data_type}
                  onChange={(e) => handleInputChange('data_type', e.target.value)}
                  placeholder="e.g., CSV, GeoJSON, etc."
                  InputLabelProps={{ style: { color: themeColors.textMuted } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: themeColors.text,
                      '& fieldset': { borderColor: themeColors.border },
                    },
                  }}
                />
              </Grid>

              {/* Checkboxes */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: '24px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: themeColors.text }}>
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => handleInputChange('is_featured', e.target.checked)}
                    />
                    Featured Dataset
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: themeColors.text }}>
                    <input
                      type="checkbox"
                      checked={formData.is_downloadable}
                      onChange={(e) => handleInputChange('is_downloadable', e.target.checked)}
                    />
                    Downloadable
                  </label>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/dashboard/admin/datasets')}
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
            {saving ? 'Saving...' : 'Save Dataset'}
          </Button>
        </Box>
      </Box>
    </DashboardLayout>
  );
}
