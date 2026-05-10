# Admin/Editor Pages Implementation Plan

## Summary
Extend admin and editor pages for datasets, trades, funds, projects, and reports with full CRUD functionality, proper API integration, and enhanced filtering.

## Current State
✅ Admin pages mostly exist:
- AdminDatasetsManagementPage (list)
- AdminDatasetDetailPage (create/edit)
- AdminTradesManagementPage, AdminTradeDetailPage2
- AdminFundsManagementPage, AdminFundDetailPage
- AdminProjectsManagementPage, AdminProjectDetailPage
- AdminReportsManagementPage, AdminReportDetailPage

⚠️ Editor pages partially exist:
- EditorTradeRequestsPage (trades)
- EditorFundRequestsPage (funds)
- EditorProjectRequestsPage (projects)
- EditorReportsExtensionsPage (reports)
- ❌ Missing: EditorDatasetsPage (datasets)

## Implementation Tasks

### Phase 1: Add Editor-Specific Services to apiService.js
- Add editorDatasetService with editor-specific endpoints
- Add editorTradeService with editor-specific endpoints
- Add editorFundService with editor-specific endpoints
- Add editorProjectService with editor-specific endpoints
- Add editorReportService with editor-specific endpoints

### Phase 2: Create Missing Editor Pages
- Create EditorDatasetsPage (list with queue/assigned views)
- Create EditorDatasetDetailPage (review form)
- Create filter components for editor pages

### Phase 3: Verify & Fix Admin Pages
- Ensure all admin pages use correct API endpoints
- Add missing filter components
- Verify CRUD operations work correctly

### Phase 4: Enhance Filtering & Features
- Add advanced filtering to all list pages
- Add bulk actions where applicable
- Add success/error notifications

### Phase 5: Update Sidebar Navigation
- Ensure DashboardLayout has correct routes
- Verify all links point to correct pages

## API Endpoints Reference

### Admin Datasets
- List: GET /datasets/?page=1&page_size=20&search=...&sort_by=...
- Get: GET /datasets/{id}
- Create: POST /datasets/
- Update: PUT /datasets/{id}
- Delete: DELETE /datasets/{id}

### Editor Datasets
- List (Queue): GET /editor/datasets/queue?page=1&page_size=20
- List (Assigned): GET /editor/datasets/assigned?page=1&page_size=20
- Search: GET /editor/datasets/search?search=...
- Get: GET /editor/datasets/{id}
- Review Logs: GET /editor/datasets/{id}/review-logs
- Update Metadata: PUT /editor/datasets/{id}/metadata
- Submit Review: POST /editor/datasets/{id}/review

### Trades (Admin & Editor)
- List: GET /trades/?page=1&page_size=20&search=...
- Get: GET /trades/{id}
- Create: POST /trades/
- Update: PUT /trades/{id}
- Delete: DELETE /trades/{id}

### Similar for Funds, Projects, Reports

## Files to Create/Modify

### Create
1. src/pages/dashboard/editor/EditorDatasetsPage.jsx
2. src/pages/dashboard/editor/EditorDatasetDetailPage.jsx
3. src/pages/dashboard/editor/components/EditorDatasetFilters.jsx
4. src/pages/dashboard/editor/components/EditorRecordFilters.jsx

### Modify
1. src/utils/apiService.js (add editor services)
2. src/App.jsx (add new routes for editor datasets)
3. src/pages/dashboard/components/DashboardLayout.jsx (update nav if needed)
4. All admin detail pages (verify API usage)

## Priority
1. ✅ API Services Setup
2. ✅ Editor Dataset Pages (critical gap)
3. ✅ Route Setup
4. Enhance existing pages with filters
5. Final QA and testing

## Status
[ ] Phase 1: API Services
[ ] Phase 2: Editor Dataset Pages
[ ] Phase 3: Verify Admin Pages
[ ] Phase 4: Enhanced Filtering
[ ] Phase 5: Navigation & Testing
