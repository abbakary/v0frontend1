/**
 * Demo payloads for Editor dashboard routes while backend list endpoints are empty.
 * Wired only when `role === "editor"` from dashboard pages.
 */

export function getMockEditorProjectRecords() {
  const day = 86400000;
  const now = Date.now();
  return [
    {
      id: "editor-demo-proj-1",
      title: "Regional grid demand & renewables telemetry",
      description:
        "Buyer needs cleaned hourly consumption joined with wind/solar generation across four ISO regions for forecasting workshops.",
      category_name: "Natural Resources and Energy",
      owner_name: "Eva Martinez",
      budget_min: 5200,
      budget_max: 9800,
      status: "IN_PROGRESS",
      created_at: new Date(now - day * 18).toISOString(),
      deadline: new Date(now + day * 52).toISOString(),
      priority_level: "High",
      data_type: "Parquet / CSV",
      collaborators_count: 5,
      bids_count: 4,
      region: "Western EU",
      country: "Germany",
      bids: [
        {
          id: "eb1",
          collaboratorName: "Fatima Al-Hassan",
          price: 7600,
          status: "ACCEPTED",
          proposal:
            "Deliver unified pipelines from ENTSO-E style schemas plus QA dashboards.",
          deliveryTime: "7 weeks",
        },
        {
          id: "eb2",
          collaboratorName: "James Okonkwo",
          price: 8100,
          status: "REJECTED",
          proposal: "Alternative ingestion via DuckDB + Polars with anomaly flags.",
          deliveryTime: "6 weeks",
        },
      ],
    },
    {
      id: "editor-demo-proj-2",
      title: "Retail cohort benchmarks (anonymized POS)",
      description:
        "Seeking transaction-level aggregates by cohort with seasonality features for benchmarking merchants.",
      category_name: "Trade and Industry",
      owner_name: "Jane Buyer",
      budget_min: 2800,
      budget_max: 6400,
      status: "BIDDING",
      created_at: new Date(now - day * 9).toISOString(),
      deadline: new Date(now + day * 30).toISOString(),
      priority_level: "Medium",
      data_type: "CSV",
      collaborators_count: 2,
      bids_count: 2,
      region: "LATAM",
      country: "Mexico",
      bids: [
        {
          id: "eb3",
          collaboratorName: "Marcus Webb",
          price: 5100,
          status: "PENDING",
          proposal: "Synthetic + masked POS blends with merchant clustering.",
          deliveryTime: "5 weeks",
        },
      ],
    },
    {
      id: "editor-demo-proj-3",
      title: "Healthcare NLP corpus — clinical notes (de-ID)",
      description:
        "Multilingual clinical narratives with entity labels for downstream summarization models.",
      category_name: "Social Services",
      owner_name: "Alice Chen",
      budget_min: 12000,
      budget_max: 22000,
      status: "PENDING",
      created_at: new Date(now - day * 4).toISOString(),
      deadline: new Date(now + day * 90).toISOString(),
      priority_level: "High",
      data_type: "JSONL",
      collaborators_count: 0,
      bids_count: 0,
      region: "North America",
      country: "United States",
      bids: [],
    },
    {
      id: "editor-demo-proj-4",
      title: "Urban mobility OD matrices",
      description:
        "Origin–destination flows derived from anonymized mobile traces aligned to census tracts.",
      category_name: "Urban Development and Housing",
      owner_name: "Dan Brown",
      budget_min: 4100,
      budget_max: 7800,
      status: "COMPLETED",
      created_at: new Date(now - day * 120).toISOString(),
      deadline: new Date(now - day * 14).toISOString(),
      priority_level: "Low",
      data_type: "GeoPackage",
      collaborators_count: 3,
      bids_count: 1,
      region: "APAC",
      country: "Singapore",
      bids: [
        {
          id: "eb4",
          collaboratorName: "Liam Chen",
          price: 6200,
          status: "ACCEPTED",
          proposal: "Delivered OD layers + validation notebook.",
          deliveryTime: "9 weeks",
        },
      ],
    },
    {
      id: "editor-demo-proj-5",
      title: "Carbon credit MRV dataset bundle",
      description:
        "Satellite-derived biomass estimates with audit-grade lineage for voluntary carbon markets.",
      category_name: "Agriculture and Environment",
      owner_name: "Tom Viewer",
      budget_min: 9000,
      budget_max: 15000,
      status: "ACCEPTED",
      created_at: new Date(now - day * 22).toISOString(),
      deadline: new Date(now + day * 75).toISOString(),
      priority_level: "Medium",
      data_type: "Raster + tabular",
      collaborators_count: 4,
      bids_count: 3,
      region: "Africa",
      country: "Kenya",
      bids: [
        {
          id: "eb5",
          collaboratorName: "Sofia Reyes",
          price: 11800,
          status: "ACCEPTED",
          proposal: "Fusion of Sentinel-2 stacks with field plots.",
          deliveryTime: "10 weeks",
        },
      ],
    },
  ];
}

export function getMockEditorTradeSubscriptions() {
  const day = 86400000;
  const now = Date.now();
  return [
    {
      id: "editor-demo-sub-1",
      status: "pending",
      amount: 299,
      notes: "",
      created_at: new Date(now - day * 2).toISOString(),
      updated_at: new Date(now - day * 1).toISOString(),
      start_date: null,
      end_date: null,
      user: {
        full_name: "Alice Chen",
        email: "alice@example.com",
        created_at: new Date(now - day * 400).toISOString(),
        role: "buyer",
      },
      plan: {
        name: "Trade Pro",
        description: "Higher limits, priority routing, and advanced analytics.",
      },
    },
    {
      id: "editor-demo-sub-2",
      status: "active",
      amount: 599,
      notes: "Auto-approved pilot cohort.",
      created_at: new Date(now - day * 45).toISOString(),
      updated_at: new Date(now - day * 5).toISOString(),
      start_date: new Date(now - day * 40).toISOString(),
      end_date: new Date(now + day * 325).toISOString(),
      user: {
        full_name: "Marcus Webb",
        email: "marcus@example.com",
        created_at: new Date(now - day * 200).toISOString(),
        role: "seller",
      },
      plan: {
        name: "Trade Enterprise",
        description: "Dedicated support, SLA-backed ingestion windows.",
      },
    },
    {
      id: "editor-demo-sub-3",
      status: "pending",
      amount: 149,
      notes: "",
      created_at: new Date(now - day * 1).toISOString(),
      updated_at: new Date(now - day * 1).toISOString(),
      start_date: null,
      end_date: null,
      user: {
        full_name: "Eva Martinez",
        email: "eva@example.com",
        created_at: new Date(now - day * 90).toISOString(),
        role: "buyer",
      },
      plan: {
        name: "Trade Starter",
        description: "Core marketplace access with standard dispute tooling.",
      },
    },
    {
      id: "editor-demo-sub-4",
      status: "cancelled",
      amount: 299,
      notes: "Card verification failed.",
      created_at: new Date(now - day * 80).toISOString(),
      updated_at: new Date(now - day * 78).toISOString(),
      start_date: null,
      end_date: null,
      user: {
        full_name: "Bob Wilson",
        email: "bob@example.com",
        created_at: new Date(now - day * 500).toISOString(),
        role: "seller",
      },
      plan: {
        name: "Trade Pro",
        description: "Higher limits, priority routing, and advanced analytics.",
      },
    },
  ];
}
