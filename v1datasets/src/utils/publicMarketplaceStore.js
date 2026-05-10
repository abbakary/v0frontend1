/**
 * Local catalog for public Trade + Reports marketplaces when APIs return no rows.
 * Editors mutate this store so /public/trade and /public/reports stay in sync for demos.
 */

const TRADE_KEY = "dali-public-trade-catalog";
const REPORT_KEY = "dali-public-reports-catalog";

function safeParse(value, fallback) {
  try {
    const p = JSON.parse(value);
    return p ?? fallback;
  } catch {
    return fallback;
  }
}

function readTrades() {
  return safeParse(localStorage.getItem(TRADE_KEY), null);
}

function writeTrades(list) {
  localStorage.setItem(TRADE_KEY, JSON.stringify(list));
}

function readReports() {
  return safeParse(localStorage.getItem(REPORT_KEY), null);
}

function writeReports(list) {
  localStorage.setItem(REPORT_KEY, JSON.stringify(list));
}

/** Matches TradePage TradeCard / TradeInfo field usage */
export function seedTradeCatalog() {
  const now = Date.now();
  const iso = (dayOffset) => new Date(now + dayOffset * 86400000).toISOString();
  return [
    {
      id: "pub-trade-coffee-q1-2024",
      title: "Coffee Export Q1 2024",
      description:
        "Quarterly robusta and arabica export flows with FOB pricing bands and port-level volumes.",
      category_name: "Agriculture",
      region: "East",
      country: "Tanzania",
      partner: "Germany",
      type: "Export",
      value: 12400000,
      currency: "USD",
      growth: 4.5,
      volume: "12,400 tonnes",
      transport: "Sea",
      start_date: "2024-01-01",
      end_date: "2024-03-31",
      status: "Completed",
      tags: ["#coffee", "#agriculture", "#export"],
      updated_at: iso(-25),
      sector: "Agriculture",
    },
    {
      id: "pub-trade-broadcasting-2024",
      title: "Broadcasting Equipment Import 2024",
      description:
        "HS-coded imports of transmitters and studio equipment with supplier concentration metrics.",
      category_name: "Media",
      region: "East",
      country: "Tanzania",
      partner: "China",
      type: "Import",
      value: 850000,
      currency: "USD",
      growth: 0,
      volume: "—",
      transport: "Air",
      start_date: "2024-01-01",
      end_date: "2024-12-31",
      status: "Completed",
      tags: ["#broadcast", "#electronics", "#import"],
      updated_at: iso(-18),
      sector: "Media",
    },
    {
      id: "pub-trade-tea-h1-2024",
      title: "Tea Export H1 2024",
      description:
        "Bulk and packaged tea shipments with auction clearing prices and blending grades.",
      category_name: "Agriculture",
      region: "East",
      country: "Kenya",
      partner: "United Kingdom",
      type: "Export",
      value: 34500000,
      currency: "USD",
      growth: 6.2,
      volume: "28,000 tonnes",
      transport: "Sea",
      start_date: "2024-01-01",
      end_date: "2024-06-30",
      status: "Completed",
      tags: ["#tea", "#export", "#commodities"],
      updated_at: iso(-30),
      sector: "Agriculture",
    },
    {
      id: "pub-trade-printing-ke-jp",
      title: "Printing Equipment Import 2024",
      description:
        "Industrial presses and finishing equipment with duty classifications.",
      category_name: "Manufacturing",
      region: "East",
      country: "Kenya",
      partner: "Japan",
      type: "Import",
      value: 1200000,
      currency: "USD",
      growth: 0,
      volume: "—",
      transport: "Sea",
      start_date: "2024-01-01",
      end_date: "2024-12-31",
      status: "Completed",
      tags: ["#printing", "#machinery"],
      updated_at: iso(-12),
      sector: "Manufacturing",
    },
    {
      id: "pub-trade-platinum-q2-2024",
      title: "Platinum Export Q2 2024",
      description:
        "Refined platinum group metals exports with assay and vault routing.",
      category_name: "Mining",
      region: "South",
      country: "South Africa",
      partner: "United States",
      type: "Export",
      value: 98000000,
      currency: "USD",
      growth: 2.1,
      volume: "4,200 kg",
      transport: "Air",
      start_date: "2024-04-01",
      end_date: "2024-06-30",
      status: "Completed",
      tags: ["#pgm", "#mining", "#export"],
      updated_at: iso(-40),
      sector: "Mining",
    },
    {
      id: "pub-trade-crude-ng-in",
      title: "Crude Oil Export March 2024",
      description:
        "Monthly liftings with blend assays, freight differentials, and destination breakdown.",
      category_name: "Energy",
      region: "West",
      country: "Nigeria",
      partner: "India",
      type: "Export",
      value: 320000000,
      currency: "USD",
      growth: -1.3,
      volume: "2,100,000 barrels",
      transport: "Sea",
      start_date: "2024-03-01",
      end_date: "2024-03-31",
      status: "Completed",
      tags: ["#oil", "#energy", "#export"],
      updated_at: iso(-55),
      sector: "Energy",
    },
  ];
}

export function seedReportCatalog() {
  const thumb =
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80";
  const iso = (s) => new Date(s).toISOString();
  return [
    {
      id: "pub-report-climate-q2-2024",
      title: "Q2 2024 Global Climate Impact Report",
      summary:
        "Comprehensive climate impact analysis with risk assessment for export-dependent zones.",
      description:
        "Detailed modeling of exposure pathways for trade corridors and agricultural exporters.",
      category_name: "Environment",
      report_type: "research",
      country: "Tanzania",
      region: "East Africa",
      thumbnail: thumb,
      total_downloads: 2800,
      total_views: 12000,
      owner_user_name: "Dali Research",
      updated_at: iso("2026-04-28"),
      license_type: "Commercial License",
      file_format: "PDF",
      pricing: [
        {
          price: null,
          currency: "USD",
          license_type: "Commercial License",
          is_active: true,
        },
      ],
      resources: [{ resource_type: "PDF", file_size_human: "4.2 MB" }],
      tags: ["climate", "risk"],
    },
    {
      id: "pub-report-ai-outlook-2024",
      title: "AI and ML Industry Outlook 2024",
      summary:
        "Annual benchmark report on AI adoption, performance, and investment trends.",
      description:
        "Survey-backed benchmarks across enterprises and public-sector deployments.",
      category_name: "Technology",
      report_type: "industry",
      country: "Kenya",
      region: "East Africa",
      thumbnail: thumb,
      total_downloads: 4600,
      total_views: 18500,
      owner_user_name: "Dali Research",
      updated_at: iso("2026-04-28"),
      license_type: "Enterprise License",
      file_format: "PDF",
      pricing: [
        {
          price: null,
          currency: "USD",
          license_type: "Enterprise License",
          is_active: true,
        },
      ],
      resources: [{ resource_type: "PDF", file_size_human: "6.8 MB" }],
      tags: ["ai", "ml"],
    },
    {
      id: "pub-report-healthcare-outcomes",
      title: "Global Healthcare Outcomes Annual Report",
      summary:
        "Meta-analysis of healthcare outcomes across 50 systems, showing reduction in avoidable admissions.",
      description:
        "Policy-ready synthesis with cohort comparisons and financing implications.",
      category_name: "Health",
      report_type: "research",
      country: "Rwanda",
      region: "East Africa",
      thumbnail: thumb,
      total_downloads: 2000,
      total_views: 9800,
      owner_user_name: "Dali Research",
      updated_at: iso("2028-04-28"),
      license_type: "Commercial License",
      file_format: "PDF",
      pricing: [
        {
          price: null,
          currency: "USD",
          license_type: "Commercial License",
          is_active: true,
        },
      ],
      resources: [{ resource_type: "PDF", file_size_human: "5.1 MB" }],
      tags: ["health", "policy"],
    },
    {
      id: "pub-report-finance-vol-h1",
      title: "Financial Markets Volatility Report H1 2024",
      summary:
        "Cross-asset volatility regimes with emphasis on frontier and emerging market spillovers.",
      description: "Includes scenario shocks and correlation breakdown tables.",
      category_name: "Finance",
      report_type: "market",
      country: "Uganda",
      region: "East Africa",
      thumbnail: thumb,
      total_downloads: 3200,
      total_views: 14000,
      owner_user_name: "Dali Research",
      updated_at: iso("2026-05-15"),
      license_type: "Commercial License",
      file_format: "PDF",
      pricing: [
        {
          price: null,
          currency: "USD",
          license_type: "Commercial License",
          is_active: true,
        },
      ],
      resources: [{ resource_type: "PDF", file_size_human: "3.6 MB" }],
      tags: ["finance", "volatility"],
    },
    {
      id: "pub-report-urban-mobility",
      title: "Urban Mobility and Smart Cities Report 2024",
      summary:
        "Modal split trends, congestion pricing pilots, and micromobility adoption curves.",
      description: "City-level dashboards suitable for municipal procurement.",
      category_name: "Urban",
      report_type: "industry",
      country: "Ghana",
      region: "West Africa",
      thumbnail: thumb,
      total_downloads: 2100,
      total_views: 8900,
      owner_user_name: "Dali Research",
      updated_at: iso("2026-03-20"),
      license_type: "Enterprise License",
      file_format: "PDF",
      pricing: [
        {
          price: null,
          currency: "USD",
          license_type: "Enterprise License",
          is_active: true,
        },
      ],
      resources: [{ resource_type: "PDF", file_size_human: "7.2 MB" }],
      tags: ["cities", "mobility"],
    },
    {
      id: "pub-report-renewables-transition",
      title: "Renewable Energy Transition Report 2024",
      summary:
        "Grid integration costs, PPA structures, and battery storage deployment pipelines.",
      description: "Includes country readiness scoring methodology.",
      category_name: "Energy",
      report_type: "policy",
      country: "Nigeria",
      region: "West Africa",
      thumbnail: thumb,
      total_downloads: 2600,
      total_views: 10200,
      owner_user_name: "Dali Research",
      updated_at: iso("2026-06-01"),
      license_type: "Commercial License",
      file_format: "PDF",
      pricing: [
        {
          price: null,
          currency: "USD",
          license_type: "Commercial License",
          is_active: true,
        },
      ],
      resources: [{ resource_type: "PDF", file_size_human: "5.9 MB" }],
      tags: ["energy", "renewables"],
    },
  ];
}

function ensureTradeSeed() {
  let rows = readTrades();
  if (!Array.isArray(rows) || rows.length === 0) {
    rows = seedTradeCatalog();
    writeTrades(rows);
  }
  return rows;
}

function ensureReportSeed() {
  let rows = readReports();
  if (!Array.isArray(rows) || rows.length === 0) {
    rows = seedReportCatalog();
    writeReports(rows);
  }
  return rows;
}

function matchesTradeFilters(row, q) {
  const search = (q.search || "").trim().toLowerCase();
  if (search) {
    const blob = `${row.title} ${row.category_name} ${row.country} ${row.partner} ${(row.tags || []).join(" ")}`.toLowerCase();
    if (!blob.includes(search)) return false;
  }
  if (q.region && q.region !== "All Regions" && row.region !== q.region) return false;
  if (q.country && row.country !== q.country) return false;
  if (q.category_name && q.category_name !== "All Categories" && row.category_name !== q.category_name)
    return false;
  if (q.type && q.type !== "All" && row.type !== q.type) return false;
  if (q.status && q.status !== "All" && row.status !== q.status) return false;
  return true;
}

function sortTrades(rows, sortBy, sortOrder) {
  const dir = sortOrder === "asc" ? 1 : -1;
  const arr = [...rows];
  arr.sort((a, b) => {
    switch (sortBy) {
      case "title":
        return dir * String(a.title || "").localeCompare(String(b.title || ""));
      case "value":
        return dir * ((Number(a.value) || 0) - (Number(b.value) || 0));
      case "growth":
        return dir * ((Number(a.growth) || 0) - (Number(b.growth) || 0));
      case "end_date":
        return dir * (new Date(a.end_date || 0) - new Date(b.end_date || 0));
      case "updated_at":
      default:
        return dir * (new Date(a.updated_at || 0) - new Date(b.updated_at || 0));
    }
  });
  return arr;
}

export const publicMarketplaceStore = {
  /** @returns {{ data: object[], total: number, total_pages: number, page: number, page_size: number }} */
  queryPublicTrades(params) {
    const page = Math.max(1, Number(params.page) || 1);
    const pageSize = Math.max(1, Number(params.page_size) || 12);
    const sortBy = params.sort_by || "created_at";
    const sortOrder = params.sort_order || "desc";

    let rows = ensureTradeSeed();
    rows = rows.filter((r) =>
      matchesTradeFilters(r, {
        search: params.search,
        region: params.region,
        country: params.country,
        category_name: params.category_name,
        type: params.type,
        status: params.status,
      }),
    );

    const sortKey =
      sortBy === "created_at" || sortBy === "updated_at" ? "updated_at" : sortBy;
    rows = sortTrades(rows, sortKey, sortOrder);

    const total = rows.length;
    const total_pages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const data = rows.slice(start, start + pageSize);

    return {
      data,
      total,
      total_pages,
      page,
      page_size: pageSize,
      has_next: page < total_pages,
      has_prev: page > 1,
    };
  },

  getTradeById(id) {
    if (id == null) return null;
    const rows = ensureTradeSeed();
    return rows.find((r) => String(r.id) === String(id)) || null;
  },

  upsertTrade(row) {
    const rows = ensureTradeSeed();
    const idx = rows.findIndex((r) => String(r.id) === String(row.id));
    const next = {
      ...row,
      updated_at: new Date().toISOString(),
    };
    if (idx === -1) rows.push(next);
    else rows[idx] = { ...rows[idx], ...next };
    writeTrades(rows);
    return next;
  },

  deleteTrade(id) {
    const rows = ensureTradeSeed().filter((r) => String(r.id) !== String(id));
    writeTrades(rows);
  },

  listAllTrades() {
    return ensureTradeSeed();
  },

  queryPublicReports(params) {
    const page = Math.max(1, Number(params.page) || 1);
    const pageSize = Math.max(1, Number(params.page_size) || 12);
    const sortOrder = params.sort_order || "desc";
    const dir = sortOrder === "asc" ? 1 : -1;

    let rows = ensureReportSeed();
    const search = (params.search || "").trim().toLowerCase();
    if (search) {
      rows = rows.filter((r) => {
        const blob = `${r.title} ${r.summary} ${r.category_name} ${r.owner_user_name}`.toLowerCase();
        return blob.includes(search);
      });
    }
    if (params.region) {
      rows = rows.filter((r) => (r.region || "").includes(params.region));
    }
    if (params.country) {
      rows = rows.filter((r) => r.country === params.country);
    }
    if (params.category_name && params.category_name !== "All") {
      rows = rows.filter((r) => r.category_name === params.category_name);
    }
    if (params.report_type && params.report_type !== "all types") {
      rows = rows.filter(
        (r) => String(r.report_type || "").toLowerCase() === params.report_type,
      );
    }

    const sortBy = params.sort_by || "created_at";
    rows = [...rows].sort((a, b) => {
      let va;
      let vb;
      switch (sortBy) {
        case "title":
          return dir * String(a.title || "").localeCompare(String(b.title || ""));
        case "total_views":
          va = Number(a.total_views) || 0;
          vb = Number(b.total_views) || 0;
          break;
        case "total_downloads":
          va = Number(a.total_downloads) || 0;
          vb = Number(b.total_downloads) || 0;
          break;
        default:
          va = new Date(a.updated_at || 0).getTime();
          vb = new Date(b.updated_at || 0).getTime();
      }
      return dir * (va - vb);
    });

    const total = rows.length;
    const total_pages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const data = rows.slice(start, start + pageSize);

    return {
      data,
      total,
      total_pages,
      page,
      page_size: pageSize,
      has_next: page < total_pages,
      has_prev: page > 1,
    };
  },

  getReportById(id) {
    if (id == null) return null;
    const rows = ensureReportSeed();
    return rows.find((r) => String(r.id) === String(id)) || null;
  },

  upsertReport(row) {
    const rows = ensureReportSeed();
    const idx = rows.findIndex((r) => String(r.id) === String(row.id));
    const next = {
      ...row,
      updated_at: new Date().toISOString(),
    };
    if (idx === -1) rows.push(next);
    else rows[idx] = { ...rows[idx], ...next };
    writeReports(rows);
    return next;
  },

  deleteReport(id) {
    const rows = ensureReportSeed().filter((r) => String(r.id) !== String(id));
    writeReports(rows);
  },

  listAllReports() {
    return ensureReportSeed();
  },
};

export default publicMarketplaceStore;
