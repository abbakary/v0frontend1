/**
 * Custom "Request Custom Trade Data" submissions from /public/trade (sessionStorage).
 */

const KEY = "tradeRequests";

function safeParse(raw, fallback) {
  try {
    const p = JSON.parse(raw);
    return Array.isArray(p) ? p : fallback;
  } catch {
    return fallback;
  }
}

function readAll() {
  return safeParse(sessionStorage.getItem(KEY), []);
}

function saveAll(rows) {
  sessionStorage.setItem(KEY, JSON.stringify(rows));
}

const tradeRequestService = {
  getAllRequests(filters = {}) {
    let rows = readAll();
    if (filters.status) {
      rows = rows.filter((r) => String(r.status).toUpperCase() === String(filters.status).toUpperCase());
    }
    if (filters.search) {
      const q = String(filters.search).toLowerCase();
      rows = rows.filter((r) =>
        `${r.title} ${r.description} ${r.userName} ${r.userEmail}`.toLowerCase().includes(q),
      );
    }
    return [...rows].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  },

  getById(id) {
    return readAll().find((r) => String(r.id) === String(id)) || null;
  },

  createRequest(payload) {
    const row = {
      id: `tr_${Date.now()}`,
      ...payload,
      status: payload.status || "PENDING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      editorNotes: payload.editorNotes || "",
    };
    const rows = readAll();
    rows.push(row);
    saveAll(rows);
    return row;
  },

  updateRequest(id, patch) {
    const rows = readAll();
    const idx = rows.findIndex((r) => String(r.id) === String(id));
    if (idx === -1) throw new Error("Trade request not found");
    const next = {
      ...rows[idx],
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    rows[idx] = next;
    saveAll(rows);
    return next;
  },

  setStatus(id, status, { editorNotes = "", reviewedByRole = "editor" } = {}) {
    return this.updateRequest(id, {
      status,
      editorNotes,
      reviewedByRole,
      reviewedAt: new Date().toISOString(),
    });
  },

  deleteRequest(id) {
    saveAll(readAll().filter((r) => String(r.id) !== String(id)));
  },
};

export default tradeRequestService;
