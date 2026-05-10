import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Plus, Search, Edit, Trash2, FileText, TrendingUp, Calendar, User, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useThemeColors } from '../../../utils/useThemeColors';

const ACCENT = "#61C5C3";
const PRIMARY = "#FF8C00";

const mockRequests = [
  {
    id: "REQ-001",
    title: "Partnership Request - Global Trade Initiative",
    description: "Request for strategic partnership in international trade facilitation",
    type: "Partnership",
    requester: "Global Trade Corp",
    email: "contact@globaltrade.com",
    submittedDate: "2025-04-01",
    priority: "high",
    status: "pending_review",
    category: "Business Development",
    assignedTo: "John Smith",
    estimatedValue: 2500000,
  },
  {
    id: "REQ-002",
    title: "Data Access Request - Market Analysis",
    description: "Request for access to trade data for market research purposes",
    type: "Data Access",
    requester: "Market Research Institute",
    email: "research@mri.org",
    submittedDate: "2025-04-02",
    priority: "medium",
    status: "under_review",
    category: "Data Services",
    assignedTo: "Sarah Johnson",
    estimatedValue: 150000,
  },
  {
    id: "REQ-003",
    title: "Technical Support Request - API Integration",
    description: "Request for technical assistance with API integration",
    type: "Technical Support",
    requester: "Tech Solutions Ltd",
    email: "support@techsolutions.com",
    submittedDate: "2025-04-03",
    priority: "low",
    status: "approved",
    category: "Technical",
    assignedTo: "Mike Chen",
    estimatedValue: 25000,
  },
  {
    id: "REQ-004",
    title: "Export License Application",
    description: "Application for export license for agricultural products",
    type: "License Application",
    requester: "Farmers Cooperative",
    email: "info@farmerscoop.org",
    submittedDate: "2025-04-04",
    priority: "high",
    status: "rejected",
    category: "Regulatory",
    assignedTo: "Legal Team",
    estimatedValue: 500000,
  },
];

function StatusBadge({ status }) {
  const statusMap = {
    pending_review: { bg: "#fef9c3", text: "#854d0e", label: "Pending Review" },
    under_review: { bg: "#dbeafe", text: "#1d4ed8", label: "Under Review" },
    approved: { bg: "#dcfce7", text: "#15803d", label: "Approved" },
    rejected: { bg: "#fee2e2", text: "#991b1b", label: "Rejected" },
    completed: { bg: "#f3f4f6", text: "#374151", label: "Completed" },
  };
  
  const config = statusMap[status] || {
    bg: "#f3f4f6",
    text: "#374151",
    label: status,
  };

  return (
    <span
      style={{
        padding: "4px 12px",
        borderRadius: "6px",
        fontSize: "0.75rem",
        fontWeight: 700,
        backgroundColor: config.bg,
        color: config.text,
      }}
    >
      {config.label}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const priorityMap = {
    high: { bg: "#fee2e2", text: "#991b1b", label: "High" },
    medium: { bg: "#fef9c3", text: "#854d0e", label: "Medium" },
    low: { bg: "#dcfce7", text: "#15803d", label: "Low" },
  };
  
  const config = priorityMap[priority] || {
    bg: "#f3f4f6",
    text: "#374151",
    label: priority,
  };

  return (
    <span
      style={{
        padding: "4px 8px",
        borderRadius: "4px",
        fontSize: "0.7rem",
        fontWeight: 600,
        backgroundColor: config.bg,
        color: config.text,
      }}
    >
      {config.label}
    </span>
  );
}

export default function RequestsPage({ role }) {
  const colors = useThemeColors();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRequests(mockRequests);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requester.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || request.status === selectedStatus;
    const matchesPriority = selectedPriority === "all" || request.priority === selectedPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalRequests = requests.length;
  const pendingRequests = requests.filter(r => r.status === 'pending_review').length;
  const highPriorityRequests = requests.filter(r => r.priority === 'high').length;
  const totalEstimatedValue = requests.reduce((sum, r) => sum + r.estimatedValue, 0);

  if (loading) {
    return (
      <DashboardLayout role={role}>
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          height: "60vh" 
        }}>
          <div>Loading requests...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role={role}>
      <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: "32px" 
        }}>
          <div>
            <h1 style={{ 
              fontSize: "28px", 
              fontWeight: 700, 
              color: colors.text,
              margin: "0 0 8px 0" 
            }}>
              Requests
            </h1>
            <p style={{ 
              color: colors.textMuted, 
              margin: 0,
              fontSize: "14px" 
            }}>
              Manage and review incoming requests
            </p>
          </div>
          <button
            style={{
              backgroundColor: ACCENT,
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Plus size={18} />
            New Request
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
          gap: "20px", 
          marginBottom: "32px" 
        }}>
          <div style={{
            backgroundColor: colors.bgPanel,
            border: `1px solid ${colors.border}`,
            borderRadius: "12px",
            padding: "20px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "8px",
                backgroundColor: `${ACCENT}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: ACCENT,
              }}>
                <FileText size={24} />
              </div>
              <div>
                <div style={{ fontSize: "24px", fontWeight: 700, color: colors.text }}>
                  {totalRequests}
                </div>
                <div style={{ fontSize: "12px", color: colors.textMuted }}>
                  Total Requests
                </div>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: colors.bgPanel,
            border: `1px solid ${colors.border}`,
            borderRadius: "12px",
            padding: "20px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "8px",
                backgroundColor: `${PRIMARY}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: PRIMARY,
              }}>
                <Clock size={24} />
              </div>
              <div>
                <div style={{ fontSize: "24px", fontWeight: 700, color: colors.text }}>
                  {pendingRequests}
                </div>
                <div style={{ fontSize: "12px", color: colors.textMuted }}>
                  Pending Review
                </div>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: colors.bgPanel,
            border: `1px solid ${colors.border}`,
            borderRadius: "12px",
            padding: "20px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "8px",
                backgroundColor: `${ACCENT}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: ACCENT,
              }}>
                <AlertCircle size={24} />
              </div>
              <div>
                <div style={{ fontSize: "24px", fontWeight: 700, color: colors.text }}>
                  {highPriorityRequests}
                </div>
                <div style={{ fontSize: "12px", color: colors.textMuted }}>
                  High Priority
                </div>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: colors.bgPanel,
            border: `1px solid ${colors.border}`,
            borderRadius: "12px",
            padding: "20px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "8px",
                backgroundColor: `${PRIMARY}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: PRIMARY,
              }}>
                <TrendingUp size={24} />
              </div>
              <div>
                <div style={{ fontSize: "24px", fontWeight: 700, color: colors.text }}>
                  ${(totalEstimatedValue / 1000000).toFixed(1)}M
                </div>
                <div style={{ fontSize: "12px", color: colors.textMuted }}>
                  Total Value
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ 
          display: "flex", 
          gap: "16px", 
          marginBottom: "24px",
          flexWrap: "wrap" 
        }}>
          <div style={{ flex: 1, minWidth: "300px" }}>
            <div style={{ position: "relative" }}>
              <Search 
                size={18} 
                style={{ 
                  position: "absolute", 
                  left: "12px", 
                  top: "50%", 
                  transform: "translateY(-50%)",
                  color: colors.textMuted 
                }} 
              />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 12px 12px 44px",
                  border: `1px solid ${colors.border}`,
                  borderRadius: "8px",
                  fontSize: "14px",
                  backgroundColor: colors.bgPanel,
                  color: colors.text,
                }}
              />
            </div>
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              padding: "12px 16px",
              border: `1px solid ${colors.border}`,
              borderRadius: "8px",
              fontSize: "14px",
              backgroundColor: colors.bgPanel,
              color: colors.text,
              cursor: "pointer",
            }}
          >
            <option value="all">All Status</option>
            <option value="pending_review">Pending Review</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            style={{
              padding: "12px 16px",
              border: `1px solid ${colors.border}`,
              borderRadius: "8px",
              fontSize: "14px",
              backgroundColor: colors.bgPanel,
              color: colors.text,
              cursor: "pointer",
            }}
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Requests Table */}
        <div style={{
          backgroundColor: colors.bgPanel,
          border: `1px solid ${colors.border}`,
          borderRadius: "12px",
          overflow: "hidden",
        }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <th style={{ 
                    padding: "16px", 
                    textAlign: "left", 
                    fontSize: "12px", 
                    fontWeight: 700, 
                    color: colors.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>
                    Request Details
                  </th>
                  <th style={{ 
                    padding: "16px", 
                    textAlign: "left", 
                    fontSize: "12px", 
                    fontWeight: 700, 
                    color: colors.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>
                    Requester
                  </th>
                  <th style={{ 
                    padding: "16px", 
                    textAlign: "left", 
                    fontSize: "12px", 
                    fontWeight: 700, 
                    color: colors.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>
                    Type
                  </th>
                  <th style={{ 
                    padding: "16px", 
                    textAlign: "left", 
                    fontSize: "12px", 
                    fontWeight: 700, 
                    color: colors.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>
                    Priority
                  </th>
                  <th style={{ 
                    padding: "16px", 
                    textAlign: "left", 
                    fontSize: "12px", 
                    fontWeight: 700, 
                    color: colors.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>
                    Status
                  </th>
                  <th style={{ 
                    padding: "16px", 
                    textAlign: "left", 
                    fontSize: "12px", 
                    fontWeight: 700, 
                    color: colors.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                    <td style={{ padding: "16px" }}>
                      <div>
                        <div style={{ 
                          fontWeight: 600, 
                          color: colors.text,
                          marginBottom: "4px"
                        }}>
                          {request.title}
                        </div>
                        <div style={{ 
                          fontSize: "12px", 
                          color: colors.textMuted,
                          marginBottom: "4px"
                        }}>
                          {request.description}
                        </div>
                        <div style={{ 
                          fontSize: "11px", 
                          color: colors.textMuted,
                          display: "flex",
                          alignItems: "center",
                          gap: "12px"
                        }}>
                          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <Calendar size={12} />
                            {request.submittedDate}
                          </span>
                          <span>Value: ${(request.estimatedValue / 1000).toFixed(0)}K</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <div>
                        <div style={{ fontWeight: 600, color: colors.text, marginBottom: "4px" }}>
                          {request.requester}
                        </div>
                        <div style={{ fontSize: "12px", color: colors.textMuted }}>
                          {request.email}
                        </div>
                        <div style={{ fontSize: "11px", color: colors.textMuted, marginTop: "4px" }}>
                          Assigned to: {request.assignedTo}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <div>
                        <div style={{ fontWeight: 600, color: colors.text, marginBottom: "4px" }}>
                          {request.type}
                        </div>
                        <div style={{ fontSize: "12px", color: colors.textMuted }}>
                          {request.category}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <PriorityBadge priority={request.priority} />
                    </td>
                    <td style={{ padding: "16px" }}>
                      <StatusBadge status={request.status} />
                    </td>
                    <td style={{ padding: "16px" }}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          style={{
                            padding: "6px",
                            border: `1px solid ${colors.border}`,
                            borderRadius: "6px",
                            backgroundColor: "transparent",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: colors.text,
                          }}
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          style={{
                            padding: "6px",
                            border: `1px solid ${colors.border}`,
                            borderRadius: "6px",
                            backgroundColor: "transparent",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#dc2626",
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}