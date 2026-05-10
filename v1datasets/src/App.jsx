// src/App.jsx

import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { lightTheme, darkTheme } from "./theme";
import "./App.css";

/* ===================== Public ===================== */

import OnboardPage from "./pages/OnboardPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import NewPassword from "./pages/NewPassword.jsx";

import DatasetsPage from "./pages/public/dataset/DatasetsPage.jsx";
import DatasetInfo from "./pages/public/dataset/DatasetInfo.jsx";
import TradePage from "./pages/public/trade/TradePage.jsx";
import TradeInfo from "./pages/public/trade/TradeInfo.jsx";
import RequestPage from "./pages/public/request/RequestPage.jsx";
import OrderAnyData from "./pages/public/request/OrderAnyData.jsx";

import SubscriptionPage from "./pages/public/subscription/SubscriptionPage.jsx";
import ProjectPage from "./pages/public/project/ProjectPage.jsx";
import ProjectInfo from "./pages/public/project/ProjectInfo.jsx";
import FundsPage from "./pages/public/funds/FundsPage.jsx";
import FundInfo from "./pages/public/funds/FundInfo.jsx";
import ReportPage from "./pages/public/reports/ReportsPage.jsx";
import ReportInfo from "./pages/public/reports/ReportInfo.jsx";
/* ===================== User Profile ===================== */

import UserProfile from "./pages/profile/UserProfile";

/* ===================== Dashboards ===================== */

import BuyerDashboard from "./pages/dashboard/BuyerDashboard";
import SellerDashboard from "./pages/dashboard/SellerDashboard";
import EditorDashboard from "./pages/dashboard/EditorDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import ViewerDashboard from "./pages/dashboard/ViewerDashboard";

/* ===================== Admin Sub-pages ===================== */
import AdminUsersPage from "./pages/dashboard/admin/UsersPage";
import AdminAdvertisementsPage from "./pages/dashboard/admin/AdvertisementsPage";
import AdminDatasetsPage from "./pages/dashboard/admin/DatasetsPage";
import AdminRevenueReportsPage from "./pages/dashboard/admin/RevenueReportsPage";
import AdminRequestsPage from "./pages/dashboard/admin/RequestsPage";
import AdminReportsPage from "./pages/dashboard/admin/ReportsPage";
import AdminProjectsPage from "./pages/dashboard/admin/ProjectsPage";
import AdminProjectDetailPage from "./pages/dashboard/admin/AdminProjectDetailPage";
import AdminTradeRequestsPage from "./pages/dashboard/admin/TradeRequestsPage";
import AdminTradeDetailPage from "./pages/dashboard/admin/AdminTradeDetailPage";
import AdminFundRequestsPage from "./pages/dashboard/admin/FundRequestsPage";
import AdminFundDetailPage from "./pages/dashboard/admin/AdminFundDetailPage";
import AdminFinanceControlPage from "./pages/dashboard/admin/FinanceControlPage";
import AdminOrganizationsPage from "./pages/dashboard/admin/OrganizationsPage";
import AdminReportDetailPage from "./pages/dashboard/admin/AdminReportDetailPage";
import SettingsPage from "./pages/dashboard/components/SettingsPage";

/* ===================== Editor Sub-pages ===================== */
import EditorReviewsPage from "./pages/dashboard/editor/ReviewsPage";
import EditorApprovalsPage from "./pages/dashboard/editor/ApprovalsPage";
import EditorModerationPage from "./pages/dashboard/editor/ModerationPage";
import EditorRevenueAnalyticsPage from "./pages/dashboard/editor/RevenueAnalyticsPage";
import EditorRequestsPage from "./pages/dashboard/admin/RequestsPage";
import EditorReportsExtensionsPage from "./pages/dashboard/editor/EditorReportsExtensions";
import EditorProjectsPage from "./pages/dashboard/admin/ProjectsPage";
import EditorProjectRequestsPage from "./pages/dashboard/editor/ProjectRequestsPage";
import NewProjectRequestPage from "./pages/dashboard/editor/NewProjectRequestPage";
import EditorTradeRequestsPage from "./pages/dashboard/editor/TradeRequestsPage";
import EditorTradeListingEditorPage from "./pages/dashboard/editor/EditorTradeListingEditorPage";
import EditorProjectAnalysisDetailPage from "./pages/dashboard/editor/EditorProjectAnalysisDetailPage";
import EditorFundRequestsPage from "./pages/dashboard/editor/FundRequestsPage";
import EditFundRequestPage from "./pages/dashboard/editor/EditFundRequestPage";
import EditTradeRequestPage from "./pages/dashboard/editor/EditTradeRequestPage";
import EditProjectRequestPage from "./pages/dashboard/editor/EditProjectRequestPage";
import EditReportRequestPage from "./pages/dashboard/editor/EditReportRequestPage";
import NewReportRequestPage from "./pages/dashboard/editor/NewReportRequestPage";

/* ===================== Buyer Sub-pages ===================== */
import BuyerPurchasesPage from "./pages/dashboard/buyer/PurchasesPage";
import BuyerWishlistPage from "./pages/dashboard/buyer/WishlistPage";
import BuyerRecommendationsPage from "./pages/dashboard/buyer/RecommendationsPage";
import BuyerBudgetTrackerPage from "./pages/dashboard/buyer/BudgetTrackerPage";
import BuyerRequestsPage from "./pages/dashboard/buyer/RequestsPage";
import BuyerFinancePage from "./pages/dashboard/buyer/FinancePage";

/* ===================== Seller Sub-pages ===================== */
import SellerListingsPage from "./pages/dashboard/seller/ListingsPage";
import SellerSalesPendingPage from "./pages/dashboard/seller/SalesPendingPage";
import SellerSalesAnalyticsPage from "./pages/dashboard/seller/SalesAnalyticsPage";
import SellerInventoryPage from "./pages/dashboard/seller/InventoryPage";
import SellerAdvertisementsPage from "./pages/dashboard/seller/AdvertisementsPage";
import SellerCustomerChatsPage from "./pages/dashboard/seller/CustomerChatsPage";
import SellerBidsPage from "./pages/dashboard/seller/BidsPage";
import SellerFinancePage from "./pages/dashboard/seller/FinancePage";
import AddListing from "./pages/dashboard/seller/AddListing.jsx";

/* ===================== Viewer Sub-pages ===================== */
import ViewerBookmarksPage from "./pages/dashboard/viewer/BookmarksPage";
import ViewerBrowsePage from "./pages/dashboard/viewer/BrowsePage";
import ViewerHistoryPage from "./pages/dashboard/viewer/HistoryPage";
import ViewerReportsPage from "./pages/dashboard/viewer/ReportsPage";
/* ===================== Logout ===================== */

import LogoutPage from "./pages/LogoutPage.jsx";

/* ===================== Routes ===================== */

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/onboard" replace />} />

      <Route path="/onboard" element={<OnboardPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<NewPassword />} />
      <Route path="/datasets" element={<DatasetsPage />} />
      <Route path="/datasets/:id" element={<DatasetInfo />} />
      <Route path="/public/trade" element={<TradePage />} />
      <Route path="/public/trade/:id" element={<TradeInfo />} />
      <Route path="/public/subscription" element={<SubscriptionPage />} />
      <Route
        path="/public/budget"
        element={<Navigate to="/public/subscription" replace />}
      />
      <Route path="/public/project" element={<ProjectPage />} />
      <Route path="/public/project/:id" element={<ProjectInfo />} />
      <Route path="/public/funds" element={<FundsPage />} />
      <Route path="/public/funds/:id" element={<FundInfo />} />
      <Route path="/public/reports" element={<ReportPage />} />
      <Route path="/public/reports/:id" element={<ReportInfo />} />
      <Route path="/public/request" element={<RequestPage />} />
      <Route path="/public/request/order-any-data" element={<OrderAnyData />} />

      <Route path="/profile" element={<UserProfile />} />

      <Route path="/dashboard/buyer" element={<BuyerDashboard />} />
      <Route path="/dashboard/buyer/requests" element={<BuyerRequestsPage />} />
      <Route path="/dashboard/buyer/finance" element={<BuyerFinancePage />} />
      <Route
        path="/dashboard/buyer/purchases"
        element={<BuyerPurchasesPage />}
      />
      <Route path="/dashboard/buyer/wishlist" element={<BuyerWishlistPage />} />
      <Route
        path="/dashboard/buyer/recommendations"
        element={<BuyerRecommendationsPage />}
      />
      <Route
        path="/dashboard/buyer/budget"
        element={<BuyerBudgetTrackerPage />}
      />

      <Route path="/dashboard/seller" element={<SellerDashboard />} />
      <Route path="/dashboard/seller/bids" element={<SellerBidsPage />} />
      <Route path="/dashboard/seller/finance" element={<SellerFinancePage />} />
      <Route
        path="/dashboard/seller/listings"
        element={<SellerListingsPage />}
      />
      <Route
        path="/dashboard/seller/pending"
        element={<SellerSalesPendingPage />}
      />
      <Route
        path="/dashboard/seller/analytics"
        element={<SellerSalesAnalyticsPage />}
      />
      <Route
        path="/dashboard/seller/inventory"
        element={<SellerInventoryPage />}
      />
      <Route
        path="/dashboard/seller/ads"
        element={<SellerAdvertisementsPage />}
      />
      <Route
        path="/dashboard/seller/chats"
        element={<SellerCustomerChatsPage />}
      />
      <Route path="/dashboard/seller/add-listing" element={<AddListing />} />

      <Route path="/dashboard/editor" element={<EditorDashboard />} />
      <Route path="/dashboard/editor/reviews" element={<EditorReviewsPage />} />
      <Route
        path="/dashboard/editor/approvals"
        element={<EditorApprovalsPage />}
      />
      <Route
        path="/dashboard/editor/moderation"
        element={<EditorModerationPage />}
      />
      <Route
        path="/dashboard/editor/analytics"
        element={<EditorRevenueAnalyticsPage />}
      />
      <Route
        path="/dashboard/editor/requests"
        element={<EditorRequestsPage role="editor" />}
      />
      <Route
        path="/dashboard/editor/reports"
        element={<EditorReportsExtensionsPage role="editor" />}
      />
      <Route
        path="/dashboard/editor/projects"
        element={<EditorProjectRequestsPage />}
      />
      <Route
        path="/dashboard/editor/trades/catalog/new"
        element={<EditorTradeListingEditorPage />}
      />
      <Route
        path="/dashboard/editor/trades/catalog/:tradeId"
        element={<EditorTradeListingEditorPage />}
      />
      <Route
        path="/dashboard/editor/reports/analysis/:analysisId"
        element={<EditorProjectAnalysisDetailPage />}
      />
      <Route
        path="/dashboard/editor/trades"
        element={<EditorTradeRequestsPage />}
      />
      <Route
        path="/dashboard/editor/trades/:id/edit"
        element={<EditTradeRequestPage />}
      />
      <Route
        path="/dashboard/editor/funds"
        element={<EditorFundRequestsPage />}
      />
      <Route
        path="/dashboard/editor/funds/:id/edit"
        element={<EditFundRequestPage />}
      />
      <Route
        path="/dashboard/editor/projects/:id/edit"
        element={<EditProjectRequestPage />}
      />
      <Route
        path="/dashboard/editor/reports/:id/edit"
        element={<EditReportRequestPage />}
      />
      <Route
        path="/dashboard/editor/trades/new"
        element={<EditorTradeRequestsPage />}
      />
      <Route
        path="/dashboard/editor/funds/new"
        element={<EditorFundRequestsPage />}
      />
      <Route
        path="/dashboard/editor/projects/new"
        element={<NewProjectRequestPage />}
      />
      <Route
        path="/dashboard/editor/reports/new"
        element={<NewReportRequestPage />}
      />
      <Route
        path="/dashboard/editor/settings"
        element={<SettingsPage role="editor" />}
      />

      <Route path="/dashboard/admin" element={<AdminDashboard />} />
      <Route path="/dashboard/admin/users" element={<AdminUsersPage />} />
      <Route
        path="/dashboard/admin/advertisements"
        element={<AdminAdvertisementsPage />}
      />
      <Route
        path="/dashboard/admin/organizations"
        element={<AdminOrganizationsPage role="admin" />}
      />
      <Route path="/dashboard/admin/datasets" element={<AdminDatasetsPage />} />
      <Route
        path="/dashboard/admin/revenue"
        element={<AdminRevenueReportsPage />}
      />
      <Route path="/dashboard/admin/requests" element={<AdminRequestsPage />} />
      <Route
        path="/dashboard/admin/trades"
        element={<AdminTradeRequestsPage role="admin" />}
      />
      <Route
        path="/dashboard/admin/trades/:tradeId"
        element={<AdminTradeDetailPage />}
      />
      <Route
        path="/dashboard/admin/trades/:tradeId/edit"
        element={<AdminTradeDetailPage />}
      />
      <Route
        path="/dashboard/admin/funds"
        element={<AdminFundRequestsPage role="admin" />}
      />
      <Route
        path="/dashboard/admin/funds/:fundId"
        element={<AdminFundDetailPage />}
      />
      <Route
        path="/dashboard/admin/funds/:fundId/edit"
        element={<AdminFundDetailPage />}
      />
      <Route
        path="/dashboard/admin/finance"
        element={<AdminFinanceControlPage role="admin" />}
      />
      <Route path="/dashboard/admin/reports" element={<AdminReportsPage />} />
      <Route
        path="/dashboard/admin/reports/:reportId"
        element={<AdminReportDetailPage />}
      />
      <Route
        path="/dashboard/admin/reports/:reportId/edit"
        element={<AdminReportDetailPage />}
      />
      <Route path="/dashboard/admin/projects" element={<AdminProjectsPage />} />
      <Route
        path="/dashboard/admin/projects/:projectId"
        element={<AdminProjectDetailPage />}
      />
      <Route
        path="/dashboard/admin/projects/:projectId/edit"
        element={<AdminProjectDetailPage />}
      />
      <Route
        path="/dashboard/admin/settings"
        element={<SettingsPage role="admin" />}
      />

      <Route path="/dashboard/viewer" element={<ViewerDashboard />} />
      <Route
        path="/dashboard/viewer/bookmarks"
        element={<ViewerBookmarksPage />}
      />
      <Route path="/dashboard/viewer/browse" element={<ViewerBrowsePage />} />
      <Route path="/dashboard/viewer/history" element={<ViewerHistoryPage />} />
      <Route path="/dashboard/viewer/reports" element={<ViewerReportsPage />} />

      <Route path="/logout" element={<LogoutPage />} />

      <Route
        path="*"
        element={<div style={{ padding: 24 }}>Page not found</div>}
      />
    </Routes>
  );
}

function AppWithTheme() {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <AppRoutes />
    </MuiThemeProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppWithTheme />
      </ThemeProvider>
    </AuthProvider>
  );
}
