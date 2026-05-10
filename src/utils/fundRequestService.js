/**
 * Fund Request Service
 * Manages funding requests submitted from the public Funds page.
 * Uses sessionStorage for requests. Ready for backend API integration.
 */

const STORAGE_KEY = "fundRequests";

function safeParseJSON(value, fallback) {
  try {
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function readRequests() {
  return safeParseJSON(sessionStorage.getItem(STORAGE_KEY), []);
}

function saveRequests(requests) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

/** Seeds realistic rows when storage is empty — Editor dashboard UI preview only */
function ensureEditorDemoSeedIfEmpty() {
  const items = readRequests();
  if (items.length > 0) return;
  const iso = (daysAgo = 0) =>
    new Date(Date.now() - daysAgo * 86400000).toISOString();
  const demo = [
    {
      id: "fr_editor_seed_1",
      userId: "demo-u1",
      userName: "Marcus Webb",
      userEmail: "marcus@example.com",
      company: "Northwind Climate",
      title: "Series A diligence — climate risk analytics stack",
      description:
        "Seeking structured guidance on third-party climate datasets, licensing, and model validation for institutional buyers.",
      category: "Agriculture and Environment",
      dataType: "Mixed",
      fundingType: "Venture",
      amount: 750000,
      amountCurrency: "USD",
      timeline: "12–18 months",
      status: "PENDING",
      createdAt: iso(3),
      updatedAt: iso(3),
      reviewNotes: "",
      reviewedByRole: null,
    },
    {
      id: "fr_editor_seed_2",
      userId: "demo-u2",
      userName: "Sofia Reyes",
      userEmail: "sofia@example.com",
      company: "LensForge AI",
      title: "Compute grant for multimodal labeling",
      description:
        "GPU-hours and contracting support for large-scale image+text labeling operations.",
      category: "Computer Science",
      dataType: "Images",
      fundingType: "Grant",
      amount: 180000,
      amountCurrency: "EUR",
      timeline: "6 months",
      status: "APPROVED",
      createdAt: iso(40),
      updatedAt: iso(12),
      reviewNotes: "Approved — aligns with platform ML safety initiative.",
      reviewedByRole: "editor",
      approvedAt: iso(12),
    },
    {
      id: "fr_editor_seed_3",
      userId: "demo-u3",
      userName: "James Okonkwo",
      userEmail: "james@example.com",
      company: "Riverbank Analytics",
      title: "Working capital for regulated finance datasets",
      description:
        "Bridge financing while awaiting enterprise PO from two anchor banks.",
      category: "Finance and Investment",
      dataType: "CSV",
      fundingType: "Debt",
      amount: 420000,
      amountCurrency: "USD",
      timeline: "9 months",
      status: "REJECTED",
      createdAt: iso(25),
      updatedAt: iso(20),
      reviewNotes: "Incomplete KYB documentation.",
      reviewedByRole: "editor",
      rejectedAt: iso(20),
    },
  ];
  saveRequests(demo);
}

export const fundRequestService = {
  getAllRequests: (filters = {}) => {
    let items = readRequests();

    if (filters.status) items = items.filter((r) => r.status === filters.status);
    if (filters.userId) items = items.filter((r) => r.userId === filters.userId);
    if (filters.search) {
      const q = String(filters.search).toLowerCase();
      items = items.filter(
        (r) =>
          String(r.title || "").toLowerCase().includes(q) ||
          String(r.company || "").toLowerCase().includes(q) ||
          String(r.userName || "").toLowerCase().includes(q) ||
          String(r.userEmail || "").toLowerCase().includes(q)
      );
    }

    return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getLatestRequestByUser: (userId) => {
    const items = fundRequestService.getAllRequests({ userId });
    return items[0] || null;
  },

  getRequestById: (id) => {
    return readRequests().find((r) => String(r.id) === String(id)) || null;
  },

  updateRequest: (requestId, patch) => {
    const requests = readRequests();
    const idx = requests.findIndex((r) => String(r.id) === String(requestId));
    if (idx === -1) throw new Error("Request not found");
    const next = {
      ...requests[idx],
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    requests[idx] = next;
    saveRequests(requests);
    return next;
  },

  createRequest: (requestData) => {
    const newRequest = {
      id: `fr_${Date.now()}`,
      ...requestData,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reviewNotes: "",
      reviewedByRole: null,
    };
    const requests = readRequests();
    requests.push(newRequest);
    saveRequests(requests);
    return newRequest;
  },

  cancelRequest: (requestId, { reviewedByRole = null } = {}) => {
    const requests = readRequests();
    const idx = requests.findIndex((r) => r.id === requestId);
    if (idx === -1) throw new Error("Request not found");
    const next = { ...requests[idx], status: "CANCELLED", reviewedByRole, updatedAt: new Date().toISOString() };
    requests[idx] = next;
    saveRequests(requests);
    return next;
  },

  approveRequest: (requestId, { reviewerRole, reviewNotes = "" } = {}) => {
    const requests = readRequests();
    const idx = requests.findIndex((r) => r.id === requestId);
    if (idx === -1) throw new Error("Request not found");
    const next = {
      ...requests[idx],
      status: "APPROVED",
      reviewedByRole: reviewerRole || "admin",
      reviewNotes,
      approvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    requests[idx] = next;
    saveRequests(requests);
    return next;
  },

  ensureEditorDemoSeedIfEmpty,

  rejectRequest: (requestId, { reviewerRole, reviewNotes = "" } = {}) => {
    const requests = readRequests();
    const idx = requests.findIndex((r) => r.id === requestId);
    if (idx === -1) throw new Error("Request not found");
    const next = {
      ...requests[idx],
      status: "REJECTED",
      reviewedByRole: reviewerRole || "admin",
      reviewNotes,
      rejectedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    requests[idx] = next;
    saveRequests(requests);
    return next;
  },
};

export default fundRequestService;

