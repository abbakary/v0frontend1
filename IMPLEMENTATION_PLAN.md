# Implementation Plan: Admin/Editor Pages

## Overview
Extend public pages (datasets, trades, funds, projects, reports) to admin and editor user roles with full CRUD functionality using appropriate API endpoints.

## Architecture Decision
- **Admin pages**: Use `/datasets/`, `/trades/`, `/funds/`, `/projects/`, `/reports/` endpoints (full management)
- **Editor pages**: Use `/editor/datasets/` for review workflows + general endpoints for fallback
- **CRUD pattern**: Page navigation (detail pages for create/edit)
- **Feature scope**: Include filtering and sorting from public pages + additional admin-specific filters

## File Structure

```
src/pages/
├── dashboard/
│   ├── admin/
│   │   ├── AdminDatasetsPage.jsx (list page)
│   │   ├── AdminDatasetDetailPage.jsx (create/edit page)
│   │   ├── AdminTradesPage.jsx
│   │   ├── AdminTradeDetailPage.jsx
│   │   ├── AdminFundsPage.jsx
│   │   ├── AdminFundDetailPage.jsx
│   │   ├── AdminProjectsPage.jsx
│   │   ├── AdminProjectDetailPage.jsx
│   │   ├── AdminReportsPage.jsx
│   │   ├── AdminReportDetailPage.jsx
│   │   └── components/
│   │       ├── AdminDatasetFilters.jsx (reusable filters)
│   │       └── ... (other filter components)
│   │
│   ├── editor/
│   │   ├── EditorDatasetsPage.jsx (list/queue page)
│   │   ├── EditorDatasetDetailPage.jsx (review/edit page)
│   │   ├── EditorTradesPage.jsx
│   │   ├── EditorTradeDetailPage.jsx
│   │   ├── EditorFundsPage.jsx
│   │   ├── EditorFundDetailPage.jsx
│   │   ├── EditorProjectsPage.jsx
│   │   ├── EditorProjectDetailPage.jsx
│   │   ├── EditorReportsPage.jsx
│   │   ├── EditorReportDetailPage.jsx
│   │   └── components/
│   │       ├── EditorDatasetFilters.jsx
│   │       └── ... (other filter components)
```

## Routes to Add (in App.jsx)

### Admin Routes
```javascript
<Route path="/dashboard/admin/datasets" element={<AdminDatasetsPage />} />
<Route path="/dashboard/admin/datasets/:id" element={<AdminDatasetDetailPage />} />
<Route path="/dashboard/admin/trades" element={<AdminTradesPage />} />
<Route path="/dashboard/admin/trades/:id" element={<AdminTradeDetailPage />} />
<Route path="/dashboard/admin/funds" element={<AdminFundsPage />} />
<Route path="/dashboard/admin/funds/:id" element={<AdminFundDetailPage />} />
<Route path="/dashboard/admin/projects" element={<AdminProjectsPage />} />
<Route path="/dashboard/admin/projects/:id" element={<AdminProjectDetailPage />} />
<Route path="/dashboard/admin/reports" element={<AdminReportsPage />} />
<Route path="/dashboard/admin/reports/:id" element={<AdminReportDetailPage />} />
```

### Editor Routes
```javascript
<Route path="/dashboard/editor/datasets" element={<EditorDatasetsPage />} />
<Route path="/dashboard/editor/datasets/:id" element={<EditorDatasetDetailPage />} />
<Route path="/dashboard/editor/trades" element={<EditorTradesPage />} />
<Route path="/dashboard/editor/trades/:id" element={<EditorTradeDetailPage />} />
<Route path="/dashboard/editor/funds" element={<EditorFundsPage />} />
<Route path="/dashboard/editor/funds/:id" element={<EditorFundDetailPage />} />
<Route path="/dashboard/editor/projects" element={<EditorProjectsPage />} />
<Route path="/dashboard/editor/projects/:id" element={<EditorProjectDetailPage />} />
<Route path="/dashboard/editor/reports" element={<EditorReportsPage />} />
<Route path="/dashboard/editor/reports/:id" element={<EditorReportDetailPage />} />
```

## API Endpoints Mapping

### Admin - Datasets
- List: `GET /datasets/?page=1&page_size=20&search=...&sort_by=...&sort_order=asc|desc`
- Get: `GET /datasets/{id}`
- Create: `POST /datasets/` with form data
- Update: `PUT /datasets/{id}` with form data
- Delete: `DELETE /datasets/{id}`

### Editor - Datasets
- List (Queue): `GET /editor/datasets/queue?page=1&page_size=20`
- List (Assigned): `GET /editor/datasets/assigned?page=1&page_size=20`
- Search: `GET /editor/datasets/search?search=...`
- Get Detail: `GET /editor/datasets/{dataset_id}`
- Review Logs: `GET /editor/datasets/{dataset_id}/review-logs`
- Update Metadata: `PUT /editor/datasets/{dataset_id}/metadata`
- Submit Review: `POST /editor/datasets/{dataset_id}/review` with verdict + notes
- Fallback: `GET /datasets/{id}` for non-review operations

### Trades (Admin & Editor)
- List: `GET /trades/?page=1&page_size=20&search=...&sort_by=...&sort_order=asc|desc`
- Get: `GET /trades/{id}`
- Create: `POST /trades/`
- Update: `PUT /trades/{id}`
- Delete: `DELETE /trades/{id}`

### Funds (Admin & Editor)
- List: `GET /funds/?page=1&page_size=20&search=...&sort_by=...&sort_order=asc|desc`
- Get: `GET /funds/{id}`
- Create: `POST /funds/`
- Update: `PUT /funds/{id}`
- Delete: `DELETE /funds/{id}`

### Projects (Admin & Editor)
- List: `GET /projects/?page=1&page_size=20&search=...&sort_by=...&sort_order=asc|desc`
- Get: `GET /projects/{id}`
- Create: `POST /projects/`
- Update: `PUT /projects/{id}`
- Delete: `DELETE /projects/{id}`

### Reports (Admin & Editor)
- List: `GET /reports/?page=1&page_size=20&search=...&sort_by=...&sort_order=asc|desc`
- Get: `GET /reports/{id}`
- Create: `POST /reports/`
- Update: `PUT /reports/{id}`
- Delete: `DELETE /reports/{id}`

## Page Structure for Each Type

### List Page Pattern
```javascript
AdminDatasetsPage/
├── DashboardLayout wrapper
├── Header section (title, create button)
├── Filters panel (collapse/expand)
│   ├── Search input
│   ├── Status filter
│   ├── Category filter
│   ├── Country/Region filter
│   ├── Date range filter
│   └── Additional admin-specific filters
├── Sort dropdown
├── Results table with:
│   ├── Columns: ID, Title, Category, Status, Created Date, Creator, Actions
│   └── Actions: View/Edit/Delete buttons
├── Pagination (page + page_size)
└── Loading/Error states
```

### Detail Page Pattern (Create/Edit)
```javascript
AdminDatasetDetailPage/
├── DashboardLayout wrapper
├── Header section (title, back button)
├── Form fields:
│   ├── Title
│   ├── Description
│   ├── Category
│   ├── Country/Region
│   ├── Type/Status
│   ├── File upload (if applicable)
│   └── Additional metadata
├── Metadata section (created by, created date, modified date)
├── Action buttons (Save, Cancel, Delete if edit mode)
└── Loading/Error states
```

## Admin-Specific Features
- Additional filtering by approval status, reviewer, review date
- Bulk actions (approve, reject, delete multiple)
- View audit logs for each record
- Force publish/archive features
- Admin notes field

## Editor-Specific Features (Datasets)
- Queue view (unreviewed items)
- Assigned view (items assigned to this editor)
- Review verdict form (approve/reject/request changes with notes)
- View review history and previous editor comments
- Earnings summary per review

## Sidebar Navigation Updates
Update `DashboardLayout.jsx` roleNavItems to include new menu items:

### Admin
- Datasets (new link to `/dashboard/admin/datasets`)
- Trades (link exists, update to `/dashboard/admin/trades`)
- Fund Requests (link exists, update to `/dashboard/admin/funds`)
- Project Requests (link exists, update to `/dashboard/admin/projects`)
- Reports (link exists, update to `/dashboard/admin/reports`)

### Editor
- Datasets (new link to `/dashboard/editor/datasets`)
- Trades (link exists, update to `/dashboard/editor/trades`)
- Fund Requests (link exists, update to `/dashboard/editor/funds`)
- Project Requests (link exists, update to `/dashboard/editor/projects`)
- Reports (link exists, update to `/dashboard/editor/reports`)

## Implementation Phases

### Phase 1: Setup & Datasets (Admin)
1. Create AdminDatasetsPage (list)
2. Create AdminDatasetDetailPage (create/edit)
3. Add routes to App.jsx
4. Update sidebar navigation
5. Add API service methods (if needed)

### Phase 2: Other Record Types (Admin)
1. Create AdminTradesPage + AdminTradeDetailPage
2. Create AdminFundsPage + AdminFundDetailPage
3. Create AdminProjectsPage + AdminProjectDetailPage
4. Create AdminReportsPage + AdminReportDetailPage

### Phase 3: Editor Pages
1. Create EditorDatasetsPage (queue/assigned view)
2. Create EditorDatasetDetailPage (review form)
3. Create Editor pages for Trades, Funds, Projects, Reports
4. Add editor-specific API service methods

### Phase 4: Polish
1. Add admin-specific filters and bulk actions
2. Add audit logs and analytics
3. Add editor earnings summary
4. Performance optimization (pagination, lazy loading)

## Shared Components to Create
- `AdminRecordFilters.jsx` - Reusable filter panel with common filters
- `EditorRecordFilters.jsx` - Editor-specific filters
- `RecordTable.jsx` - Reusable table component with sort/filter support
- `RecordForm.jsx` - Reusable form with validation
- `DeleteConfirmationModal.jsx` - Confirmation dialog

## API Service Additions (apiService.js)
Ensure these exist or add them:
```javascript
export const editorDatasetService = {
  queue: (params) => api.get("/editor/datasets/queue", { params }),
  assigned: (params) => api.get("/editor/datasets/assigned", { params }),
  search: (params) => api.get("/editor/datasets/search", { params }),
  get: (id) => api.get(`/editor/datasets/${id}`),
  reviewLogs: (id) => api.get(`/editor/datasets/${id}/review-logs`),
  updateMetadata: (id, data) => api.put(`/editor/datasets/${id}/metadata`, data),
  submitReview: (id, data) => api.post(`/editor/datasets/${id}/review`, data),
};
```

## Key Considerations
- Maintain consistent styling with existing admin/editor pages
- Reuse DashboardLayout wrapper for consistency
- Handle loading and error states properly
- Implement proper role-based access control
- Use debounced search like public pages
- Maintain pagination for large datasets
- Support both grid and list views (if applicable)
- Add success/error toast notifications
