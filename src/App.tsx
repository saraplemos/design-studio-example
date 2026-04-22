import { useState, type CSSProperties } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const MAROON = "#8B0000";
const OLIVE  = "#556B2F";
const MONTHLY_CAP = 259;

type ProjectStatus = "Delivered" | "For Review" | "In Progress" | "Brief Received" | "Waiting" | "Project Cancelled";
type DelType = "Creative" | "Adaptation" | "Resize";

interface Project {
  id: string;
  clientRef: string;
  deliverable: string;
  type: DelType;
  qty: number;
  credits: number;
  status: ProjectStatus;
  owner: string;
  brand: string;
  date: string;
  folderLink?: string;
  notes?: string;
}

interface FormDel { id: number; deliverableType: string; type: DelType; qty: number; }

const DEL_TYPES: { label: string; creative: number | null; adaptation: number; resize: number }[] = [
  { label: "Advertising & Digital Ads",         creative: 8,    adaptation: 2, resize: 1 },
  { label: "Special Items (1 page)",             creative: 8,    adaptation: 6, resize: 2 },
  { label: "Hotel Collateral (templates)",       creative: 4,    adaptation: 2, resize: 1 },
  { label: "Promotional Artwork (poster/flyer)", creative: 8,    adaptation: 4, resize: 2 },
  { label: "Social Media Posts (templates)",     creative: 6,    adaptation: 4, resize: 1 },
  { label: "EDM Artwork (templates)",            creative: 6,    adaptation: 3, resize: 2 },
  { label: "Image Retouching",                   creative: 8,    adaptation: 4, resize: 2 },
  { label: "VDO — 1-min Reels Editing",         creative: null, adaptation: 8, resize: 4 },
];

function unitCredit(delLabel: string, type: DelType): number {
  const d = DEL_TYPES.find(x => x.label === delLabel);
  if (!d) return 0;
  if (type === "Creative")   return d.creative ?? 0;
  if (type === "Adaptation") return d.adaptation;
  return d.resize;
}

// Apr 2026 — 16 projects, 228 credits used, 31 remaining
const APR: Project[] = [
  { id: "010426_001", clientRef: "Spring Campaign",     deliverable: "Advertising & Digital Ads",         type: "Creative",   qty: 1, credits: 8,  status: "Delivered",         owner: "Sarah M.",  brand: "Brand A", date: "01/04/26" },
  { id: "020426_002", clientRef: "Social Refresh",      deliverable: "Social Media Posts (templates)",    type: "Creative",   qty: 3, credits: 18, status: "Delivered",         owner: "John S.",   brand: "Brand B", date: "02/04/26" },
  { id: "030426_003", clientRef: "Hotel Template Set",  deliverable: "Hotel Collateral (templates)",      type: "Adaptation", qty: 4, credits: 8,  status: "Delivered",         owner: "Alex T.",   brand: "Brand C", date: "03/04/26" },
  { id: "040426_004", clientRef: "Brand A Flyer",       deliverable: "Promotional Artwork (poster/flyer)",type: "Creative",   qty: 2, credits: 16, status: "Delivered",         owner: "Priya K.",  brand: "Brand A", date: "04/04/26" },
  { id: "050426_005", clientRef: "April EDM",           deliverable: "EDM Artwork (templates)",           type: "Creative",   qty: 3, credits: 18, status: "Delivered",         owner: "Mike R.",   brand: "Brand D", date: "05/04/26" },
  { id: "070426_006", clientRef: "Collateral Pack",     deliverable: "Special Items (1 page)",            type: "Creative",   qty: 2, credits: 16, status: "Delivered",         owner: "Sarah M.",  brand: "Brand B", date: "07/04/26" },
  { id: "080426_007", clientRef: "Digital Ads Pack",    deliverable: "Advertising & Digital Ads",         type: "Adaptation", qty: 5, credits: 10, status: "Project Cancelled", owner: "John S.",   brand: "Brand E", date: "08/04/26" },
  { id: "100426_008", clientRef: "Photo Retouch Batch", deliverable: "Image Retouching",                  type: "Creative",   qty: 2, credits: 16, status: "For Review",        owner: "Alex T.",   brand: "Brand C", date: "10/04/26" },
  { id: "110426_009", clientRef: "Reels Apr",           deliverable: "VDO — 1-min Reels Editing",        type: "Adaptation", qty: 2, credits: 16, status: "For Review",        owner: "Priya K.",  brand: "Brand A", date: "11/04/26" },
  { id: "120426_010", clientRef: "Social Content Apr",  deliverable: "Social Media Posts (templates)",    type: "Creative",   qty: 3, credits: 18, status: "For Review",        owner: "Mike R.",   brand: "Brand B", date: "12/04/26" },
  { id: "140426_011", clientRef: "Brand C Templates",   deliverable: "Hotel Collateral (templates)",      type: "Creative",   qty: 3, credits: 12, status: "In Progress",       owner: "Alex T.",   brand: "Brand C", date: "14/04/26" },
  { id: "150426_012", clientRef: "Brand D Artwork",     deliverable: "Promotional Artwork (poster/flyer)",type: "Adaptation", qty: 4, credits: 16, status: "In Progress",       owner: "Sarah M.",  brand: "Brand D", date: "15/04/26" },
  { id: "160426_013", clientRef: "EDM Campaign Apr",    deliverable: "EDM Artwork (templates)",           type: "Adaptation", qty: 4, credits: 12, status: "In Progress",       owner: "John S.",   brand: "Brand E", date: "16/04/26" },
  { id: "170426_014", clientRef: "Special Collateral",  deliverable: "Special Items (1 page)",            type: "Adaptation", qty: 2, credits: 12, status: "Brief Received",    owner: "Priya K.",  brand: "Brand A", date: "17/04/26" },
  { id: "180426_015", clientRef: "Brand E Ads",         deliverable: "Advertising & Digital Ads",         type: "Creative",   qty: 2, credits: 16, status: "Brief Received",    owner: "Mike R.",   brand: "Brand E", date: "18/04/26" },
  { id: "200426_016", clientRef: "Video Package",       deliverable: "VDO — 1-min Reels Editing",        type: "Resize",     qty: 4, credits: 16, status: "Waiting",           owner: "Sarah M.",  brand: "Brand B", date: "20/04/26" },
];
// 8+18+8+16+18+16+10+16+16+18+12+16+12+12+16+16 = 228 ✓

// Mar 2026 — 11 projects, 186 credits used, 73 remaining
const MAR: Project[] = [
  { id: "010326_001", clientRef: "Mar Campaign A",       deliverable: "Promotional Artwork (poster/flyer)", type: "Creative",   qty: 2, credits: 16, status: "Delivered",         owner: "Priya K.",  brand: "Brand A", date: "01/03/26" },
  { id: "050326_002", clientRef: "Social Mar",           deliverable: "Social Media Posts (templates)",     type: "Creative",   qty: 4, credits: 24, status: "Delivered",         owner: "John S.",   brand: "Brand B", date: "05/03/26" },
  { id: "070326_003", clientRef: "Collateral Templates", deliverable: "Hotel Collateral (templates)",       type: "Creative",   qty: 4, credits: 16, status: "Delivered",         owner: "Alex T.",   brand: "Brand C", date: "07/03/26" },
  { id: "100326_004", clientRef: "March EDM",            deliverable: "EDM Artwork (templates)",            type: "Creative",   qty: 3, credits: 18, status: "Delivered",         owner: "Mike R.",   brand: "Brand D", date: "10/03/26" },
  { id: "120326_005", clientRef: "Brand Launch Ads",     deliverable: "Advertising & Digital Ads",          type: "Creative",   qty: 3, credits: 24, status: "Delivered",         owner: "Sarah M.",  brand: "Brand A", date: "12/03/26" },
  { id: "140326_006", clientRef: "Video Reels Mar",      deliverable: "VDO — 1-min Reels Editing",         type: "Adaptation", qty: 2, credits: 16, status: "Project Cancelled", owner: "John S.",   brand: "Brand E", date: "14/03/26" },
  { id: "170326_007", clientRef: "Special Items Mar",    deliverable: "Special Items (1 page)",             type: "Creative",   qty: 2, credits: 16, status: "For Review",        owner: "Alex T.",   brand: "Brand C", date: "17/03/26" },
  { id: "190326_008", clientRef: "Retouching Mar",       deliverable: "Image Retouching",                   type: "Creative",   qty: 2, credits: 16, status: "For Review",        owner: "Priya K.",  brand: "Brand B", date: "19/03/26" },
  { id: "210326_009", clientRef: "Social Content Mar",   deliverable: "Social Media Posts (templates)",     type: "Adaptation", qty: 6, credits: 24, status: "In Progress",       owner: "Mike R.",   brand: "Brand D", date: "21/03/26" },
  { id: "240326_010", clientRef: "Digital Ads Mar",      deliverable: "Advertising & Digital Ads",          type: "Adaptation", qty: 4, credits: 8,  status: "Brief Received",    owner: "Sarah M.",  brand: "Brand E", date: "24/03/26" },
  { id: "270326_011", clientRef: "Template Pack",        deliverable: "Hotel Collateral (templates)",       type: "Adaptation", qty: 4, credits: 8,  status: "Waiting",           owner: "Alex T.",   brand: "Brand C", date: "27/03/26" },
];
// 16+24+16+18+24+16+16+16+24+8+8 = 186 ✓

const STATUS_STYLE: Record<string, { bg: string; color: string; dot: string; border?: string }> = {
  "Delivered":         { bg: "#E8F5E9", color: "#1B5E20", dot: "#43A047" },
  "For Review":        { bg: "#FFF3E0", color: "#E65100", dot: "#FB8C00" },
  "In Progress":       { bg: "#E3F2FD", color: "#0D47A1", dot: "#1E88E5" },
  "Brief Received":    { bg: "#F3E5F5", color: "#4A148C", dot: "#8E24AA" },
  "Waiting":           { bg: "#F5F5F5", color: "#555555", dot: "#999999" },
  "Project Cancelled": { bg: "#FFF5F5", color: "#C62828", dot: "#E53935", border: "1px solid #E57373" },
};

const STATUS_STAGES = ["Brief Received", "In Progress", "For Review", "Delivered"] as const;

const OWNERS = ["John S.", "Sarah M.", "Alex T.", "Priya K.", "Mike R."];
const BRANDS = ["Brand A", "Brand B", "Brand C", "Brand D", "Brand E"];

const lbl: CSSProperties = {
  display: "block", fontSize: "11px", color: "#888",
  textTransform: "uppercase", letterSpacing: "0.07em",
  fontWeight: 600, marginBottom: "6px",
};
const inp: CSSProperties = {
  width: "100%", padding: "8px 10px", border: "1px solid #e0e0e0",
  borderRadius: "6px", fontSize: "13px", background: "white",
  boxSizing: "border-box", color: "#333",
};

const MONTHLY_HISTORY = [
  { month: "Nov 2025", used: 240 },
  { month: "Dec 2025", used: 268 },
  { month: "Jan 2026", used: 283 },
  { month: "Feb 2026", used: 173 },
  { month: "Mar 2026", used: 186 },
];

function StatusBadge({ status }: { status: string }) {
  const ss = STATUS_STYLE[status] || STATUS_STYLE["Waiting"];
  return (
    <span style={{
      background: ss.bg, color: ss.color, border: ss.border || "1px solid transparent",
      padding: "3px 10px", borderRadius: "20px", fontSize: "11px",
      display: "inline-flex", alignItems: "center", gap: "5px", whiteSpace: "nowrap",
    }}>
      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: ss.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
}

function ProjectTable({ projects, onViewBrief }: { projects: Project[]; onViewBrief: (p: Project) => void }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
        <thead>
          <tr style={{ background: "#fafafa" }}>
            {["Project ID", "Client Ref", "Deliverable", "Type", "Qty", "Credits", "Status", "Owner", "Brand", "Date", ""].map(h => (
              <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "#999", fontWeight: 600, fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #eee", whiteSpace: "nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {projects.length === 0 && (
            <tr><td colSpan={11} style={{ padding: "32px", textAlign: "center", color: "#ccc", fontSize: "13px" }}>No projects this month</td></tr>
          )}
          {projects.map((p, i) => (
            <tr key={p.id} style={{ borderBottom: "1px solid #f5f5f5", background: i % 2 === 0 ? "white" : "#fafafa" }}>
              <td style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: "12px", color: "#555", fontWeight: 600, whiteSpace: "nowrap" }}>{p.id}</td>
              <td style={{ padding: "10px 12px", color: "#555", maxWidth: "130px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.clientRef || "—"}</td>
              <td style={{ padding: "10px 12px", color: "#2a2a2a", maxWidth: "160px" }}>{p.deliverable}</td>
              <td style={{ padding: "10px 12px", color: "#666", whiteSpace: "nowrap" }}>{p.type}</td>
              <td style={{ padding: "10px 12px", color: "#666", textAlign: "center" }}>{p.qty}</td>
              <td style={{ padding: "10px 12px", color: MAROON, fontWeight: 700, textAlign: "center" }}>{p.credits}</td>
              <td style={{ padding: "10px 12px" }}><StatusBadge status={p.status} /></td>
              <td style={{ padding: "10px 12px", color: "#555", whiteSpace: "nowrap" }}>{p.owner}</td>
              <td style={{ padding: "10px 12px", color: "#555", whiteSpace: "nowrap" }}>{p.brand}</td>
              <td style={{ padding: "10px 12px", color: "#aaa", fontSize: "12px", whiteSpace: "nowrap" }}>{p.date}</td>
              <td style={{ padding: "10px 12px" }}>
                <button
                  onClick={() => onViewBrief(p)}
                  style={{ background: "none", border: `1px solid ${MAROON}`, color: MAROON, borderRadius: "5px", padding: "4px 10px", fontSize: "11px", cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  View Brief
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function App() {
  const [view, setView]                   = useState<"dashboard" | "form" | "brief">("dashboard");
  const [selectedBrief, setSelectedBrief] = useState<Project | null>(null);
  const [selectedMonth, setSelectedMonth] = useState("Apr 2026");
  const [monthData, setMonthData]         = useState<Record<string, Project[]>>({
    "Apr 2026": APR,
    "Mar 2026": MAR,
    "May 2026": [],
  });
  const [deliveredOpen, setDeliveredOpen] = useState(false);

  // Form state
  const [formClientRef, setFormClientRef]   = useState("");
  const [folderLink, setFolderLink]         = useState("");
  const [formOwner, setFormOwner]           = useState(OWNERS[0]);
  const [formOwnerText, setFormOwnerText]   = useState("");
  const [formBrand, setFormBrand]           = useState(BRANDS[0]);
  const [formBrandText, setFormBrandText]   = useState("");
  const [formNotes, setFormNotes]           = useState("");
  const [formDels, setFormDels]             = useState<FormDel[]>([
    { id: 1, deliverableType: DEL_TYPES[0].label, type: "Creative", qty: 1 },
  ]);
  const [nextDelId, setNextDelId] = useState(2);

  const currentProjects = monthData[selectedMonth] || [];
  const aprProjects     = monthData["Apr 2026"];
  const aprUsed         = aprProjects.reduce((s, p) => s + p.credits, 0);
  const aprRemaining    = MONTHLY_CAP - aprUsed;

  const pointsUsed      = currentProjects.reduce((s, p) => s + p.credits, 0);
  const pointsRemaining = MONTHLY_CAP - pointsUsed;
  const deliveredCount  = currentProjects.filter(p => p.status === "Delivered").length;
  const activeProjects  = currentProjects.filter(p => p.status !== "Delivered" && p.status !== "Project Cancelled");
  const doneProjects    = currentProjects.filter(p => p.status === "Delivered" || p.status === "Project Cancelled");
  const inProgressCount = activeProjects.length;
  const completionPct   = currentProjects.length > 0 ? Math.round((deliveredCount / currentProjects.length) * 100) : 0;
  const usedPct         = Math.min(Math.round((pointsUsed / MONTHLY_CAP) * 100), 100);

  const statusChartData = (["Delivered", "For Review", "In Progress", "Brief Received", "Waiting"] as ProjectStatus[]).map(s => ({
    name: s, count: currentProjects.filter(p => p.status === s).length,
  }));
  const delivChartData = DEL_TYPES.map(dt => ({
    name: dt.label.length > 22 ? dt.label.slice(0, 21) + "…" : dt.label,
    credits: currentProjects.filter(p => p.deliverable === dt.label).reduce((s, p) => s + p.credits, 0),
  })).filter(d => d.credits > 0).sort((a, b) => b.credits - a.credits);

  const formTotalDels    = formDels.reduce((s, d) => s + d.qty, 0);
  const formTotalCredits = formDels.reduce((s, d) => s + unitCredit(d.deliverableType, d.type) * d.qty, 0);

  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mo = String(today.getMonth() + 1).padStart(2, "0");
  const yy = String(today.getFullYear()).slice(-2);
  const newId = `${dd}${mo}${yy}_${String(aprProjects.length + 1).padStart(3, "0")}`;

  const addFormDel = () => {
    setFormDels(prev => [...prev, { id: nextDelId, deliverableType: DEL_TYPES[0].label, type: "Creative", qty: 1 }]);
    setNextDelId(n => n + 1);
  };
  const removeFormDel = (id: number) => setFormDels(prev => prev.filter(d => d.id !== id));
  const updateFormDel = (id: number, changes: Partial<FormDel>) => {
    setFormDels(prev => prev.map(d => {
      if (d.id !== id) return d;
      const next = { ...d, ...changes };
      if ("deliverableType" in changes && changes.deliverableType === "VDO — 1-min Reels Editing" && next.type === "Creative") next.type = "Adaptation";
      return next;
    }));
  };

  const handleCreate = () => {
    const newProjects: Project[] = formDels.map((d, i) => ({
      id: i === 0 ? newId : `${dd}${mo}${yy}_${String(aprProjects.length + 1 + i).padStart(3, "0")}`,
      clientRef: formClientRef,
      deliverable: d.deliverableType,
      type: d.type,
      qty: d.qty,
      credits: unitCredit(d.deliverableType, d.type) * d.qty,
      status: "Brief Received" as ProjectStatus,
      owner: formOwnerText || formOwner,
      brand: formBrandText || formBrand,
      date: `${dd}/${mo}/${yy}`,
      folderLink: folderLink || undefined,
      notes: formNotes || undefined,
    }));
    setMonthData(prev => ({ ...prev, "Apr 2026": [...newProjects, ...prev["Apr 2026"]] }));
    setSelectedMonth("Apr 2026");
    setView("dashboard");
    setFormClientRef(""); setFolderLink(""); setFormOwnerText(""); setFormBrandText(""); setFormNotes("");
    setFormDels([{ id: 1, deliverableType: DEL_TYPES[0].label, type: "Creative", qty: 1 }]);
    setNextDelId(2);
  };

  const openBrief = (p: Project) => { setSelectedBrief(p); setView("brief"); };
  const backToDash = () => { setView("dashboard"); setSelectedBrief(null); };

  // ─── BRIEF VIEW ───────────────────────────────────────────────
  if (view === "brief" && selectedBrief) {
    const p = selectedBrief;
    const ss = STATUS_STYLE[p.status] || STATUS_STYLE["Waiting"];
    const stageIdx    = (STATUS_STAGES as readonly string[]).indexOf(p.status);
    const isCancelled = p.status === "Project Cancelled";

    return (
      <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", background: "#F4F4F4", minHeight: "100vh" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "2rem 1.5rem" }}>
          <button onClick={backToDash} style={{ background: "none", border: "none", cursor: "pointer", color: "#555", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px", marginBottom: "1.25rem", padding: 0 }}>
            ← Back to Dashboard
          </button>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <div>
              <h2 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: 700, color: "#1a1a1a" }}>Brief Detail</h2>
              <p style={{ margin: 0, fontSize: "13px", color: "#999" }}>
                {p.clientRef ? `${p.clientRef}  ·  ` : ""}{p.id}
              </p>
            </div>
            <span style={{ background: ss.bg, color: ss.color, border: ss.border || "1px solid transparent", padding: "6px 16px", borderRadius: "20px", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: ss.dot }} />
              {p.status}
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {/* Left */}
            <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
              <h3 style={{ margin: "0 0 1rem", fontSize: "15px", fontWeight: 700, color: "#1a1a1a" }}>Project Details</h3>
              {([
                { label: "Internal Project ID", value: p.id,              mono: true  },
                { label: "Client Reference",    value: p.clientRef || "—" },
                { label: "Deliverable",          value: p.deliverable      },
                { label: "Type",                 value: p.type             },
                { label: "Quantity",             value: String(p.qty)      },
                { label: "Credits",              value: String(p.credits), accent: true },
                { label: "Owner",                value: p.owner            },
                { label: "Brand",                value: p.brand            },
                { label: "Date",                 value: p.date             },
              ] as { label: string; value: string; mono?: boolean; accent?: boolean }[]).map(row => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f5f5f5", padding: "9px 0" }}>
                  <span style={{ fontSize: "12px", color: "#888" }}>{row.label}</span>
                  <span style={{ fontSize: "13px", color: row.accent ? MAROON : "#2a2a2a", fontWeight: row.accent ? 700 : 500, fontFamily: row.mono ? "monospace" : "inherit" }}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Right */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
                <h3 style={{ margin: "0 0 1.25rem", fontSize: "15px", fontWeight: 700, color: "#1a1a1a" }}>Status Timeline</h3>
                {STATUS_STAGES.map((stage, i) => {
                  const completed = !isCancelled && stageIdx > i;
                  const current   = !isCancelled && stageIdx === i;
                  return (
                    <div key={stage} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                        <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: completed ? MAROON : current ? "white" : "#f0f0f0", border: current ? `2px solid ${MAROON}` : completed ? "none" : "2px solid #e0e0e0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: completed ? "white" : current ? MAROON : "#ccc" }}>
                          {completed ? "✓" : i + 1}
                        </div>
                        {i < STATUS_STAGES.length - 1 && (
                          <div style={{ width: "2px", height: "20px", background: completed ? MAROON : "#e8e8e8", margin: "2px 0" }} />
                        )}
                      </div>
                      <div style={{ paddingTop: "3px", paddingBottom: i < STATUS_STAGES.length - 1 ? "18px" : "0" }}>
                        <div style={{ fontSize: "13px", fontWeight: current ? 700 : 500, color: completed || current ? "#1a1a1a" : "#bbb" }}>{stage}</div>
                        {current && <div style={{ fontSize: "11px", color: MAROON, marginTop: "1px" }}>Current stage</div>}
                      </div>
                    </div>
                  );
                })}
                {isCancelled && (
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "4px" }}>
                    <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "#FFF5F5", border: "2px solid #E53935", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ color: "#E53935", fontSize: "13px", fontWeight: 700 }}>✕</span>
                    </div>
                    <span style={{ fontSize: "13px", color: "#C62828", fontWeight: 700 }}>Project Cancelled</span>
                  </div>
                )}
              </div>

              <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ ...lbl, marginBottom: "4px" }}>Project Folder</div>
                  {p.folderLink
                    ? <a href={p.folderLink} target="_blank" rel="noreferrer" style={{ fontSize: "13px", color: OLIVE, wordBreak: "break-all" }}>{p.folderLink}</a>
                    : <span style={{ fontSize: "13px", color: "#ccc" }}>No folder link provided</span>}
                </div>
                <div>
                  <div style={{ ...lbl, marginBottom: "4px" }}>Notes</div>
                  {p.notes
                    ? <p style={{ margin: 0, fontSize: "13px", color: "#555", lineHeight: 1.6 }}>{p.notes}</p>
                    : <span style={{ fontSize: "13px", color: "#ccc" }}>No notes</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── FORM VIEW ────────────────────────────────────────────────
  if (view === "form") {
    return (
      <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", background: "#F4F4F4", minHeight: "100vh" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1.5rem" }}>
          <button onClick={backToDash} style={{ background: "none", border: "none", cursor: "pointer", color: "#555", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px", marginBottom: "1.25rem", padding: 0 }}>
            ← Back to Dashboard
          </button>
          <h2 style={{ margin: "0 0 1.5rem", fontSize: "20px", color: "#1a1a1a", fontWeight: 700 }}>New Project Request</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: "24px", alignItems: "start" }}>
            {/* Left */}
            <div style={{ background: "white", borderRadius: "12px", padding: "2rem", boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
              <h3 style={{ margin: "0 0 1.5rem", fontSize: "16px", color: "#1a1a1a", fontWeight: 700 }}>Project Details</h3>

              <div style={{ marginBottom: "16px" }}>
                <label style={lbl}>Client Reference</label>
                <input value={formClientRef} onChange={e => setFormClientRef(e.target.value)} placeholder="e.g. Spring Campaign, Brand Refresh…" style={inp} />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={lbl}>Internal Project ID</label>
                <input value={newId} readOnly style={{ ...inp, background: "#f5f5f5", color: "#888", fontFamily: "monospace" }} />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={lbl}>Project Folder Link</label>
                <input value={folderLink} onChange={e => setFolderLink(e.target.value)} placeholder="Paste Google Drive or folder link" style={inp} />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={lbl}>Booking Month</label>
                <select style={inp}>
                  <option>Apr 2026 ({aprRemaining} credits remaining)</option>
                  <option>May 2026 (259 credits remaining)</option>
                  <option>Jun 2026 (259 credits remaining)</option>
                </select>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={lbl}>Owner</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <select value={formOwner} onChange={e => setFormOwner(e.target.value)} style={{ ...inp, width: "auto", flexShrink: 0 }}>
                    {OWNERS.map(o => <option key={o}>{o}</option>)}
                  </select>
                  <input value={formOwnerText} onChange={e => setFormOwnerText(e.target.value)} placeholder="or type name…" style={{ ...inp, flex: 1 }} />
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={lbl}>Brand <span style={{ color: "#bbb", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(Optional)</span></label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <select value={formBrand} onChange={e => setFormBrand(e.target.value)} style={{ ...inp, width: "auto", flexShrink: 0 }}>
                    {BRANDS.map(b => <option key={b}>{b}</option>)}
                  </select>
                  <input value={formBrandText} onChange={e => setFormBrandText(e.target.value)} placeholder="or type brand…" style={{ ...inp, flex: 1 }} />
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <label style={{ ...lbl, marginBottom: 0 }}>Deliverables</label>
                  <button onClick={addFormDel} style={{ background: OLIVE, color: "white", border: "none", borderRadius: "6px", padding: "6px 14px", fontSize: "12px", cursor: "pointer", fontWeight: 600 }}>+ Add Deliverable</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 130px 70px 28px", gap: "8px", marginBottom: "6px" }}>
                  {["Deliverable", "Type", "Qty", ""].map(h => (
                    <span key={h} style={{ fontSize: "10px", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{h}</span>
                  ))}
                </div>
                {formDels.map(d => {
                  const dt = DEL_TYPES.find(x => x.label === d.deliverableType)!;
                  const typeOpts: DelType[] = dt.creative !== null ? ["Creative", "Adaptation", "Resize"] : ["Adaptation", "Resize"];
                  return (
                    <div key={d.id} style={{ display: "grid", gridTemplateColumns: "1fr 130px 70px 28px", gap: "8px", marginBottom: "8px", alignItems: "center" }}>
                      <select value={d.deliverableType} onChange={e => updateFormDel(d.id, { deliverableType: e.target.value })} style={inp}>
                        {DEL_TYPES.map(x => <option key={x.label}>{x.label}</option>)}
                      </select>
                      <select value={d.type} onChange={e => updateFormDel(d.id, { type: e.target.value as DelType })} style={inp}>
                        {typeOpts.map(t => <option key={t}>{t}</option>)}
                      </select>
                      <input type="number" min={1} value={d.qty} onChange={e => updateFormDel(d.id, { qty: Math.max(1, parseInt(e.target.value) || 1) })} style={{ ...inp, textAlign: "center" }} />
                      {formDels.length > 1
                        ? <button onClick={() => removeFormDel(d.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", fontSize: "20px", padding: 0, lineHeight: 1 }}>×</button>
                        : <span />}
                    </div>
                  );
                })}
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={lbl}>Notes <span style={{ color: "#bbb", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(Optional)</span></label>
                <textarea value={formNotes} onChange={e => setFormNotes(e.target.value)} rows={3} placeholder="Any additional context, references, or requirements…" style={{ ...inp, resize: "vertical" }} />
              </div>

              <button onClick={handleCreate} style={{ width: "100%", background: OLIVE, color: "white", border: "none", borderRadius: "8px", padding: "13px", fontSize: "15px", cursor: "pointer", fontWeight: 700 }}>
                Create Project Request
              </button>
            </div>

            {/* Right */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
                <h3 style={{ margin: "0 0 1.25rem", fontSize: "16px", color: "#1a1a1a", fontWeight: 700 }}>Request Summary</h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f0f0f0", paddingBottom: "12px", marginBottom: "12px" }}>
                  <span style={{ fontSize: "13px", color: "#777" }}>Total Deliverables</span>
                  <span style={{ fontSize: "18px", fontWeight: 700, color: "#1a1a1a" }}>{formTotalDels}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f0f0f0", paddingBottom: "12px", marginBottom: "10px" }}>
                  <span style={{ fontSize: "13px", color: "#777" }}>Total Credits</span>
                  <span style={{ fontSize: "18px", fontWeight: 700, color: MAROON }}>{formTotalCredits}</span>
                </div>
                <p style={{ fontSize: "11px", color: "#aaa", margin: "0 0 16px", lineHeight: 1.6 }}>Final number of credits to be calculated once full brief submitted</p>
                <div style={{ background: "#FEF3E2", border: "1px solid #F6AD55", borderRadius: "8px", padding: "12px 14px", marginBottom: "16px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#C05621" }}>Apr 2026 Remaining: {aprRemaining} credits</span>
                </div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#555", marginBottom: "8px" }}>Next Steps</div>
                <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "12px", color: "#777", lineHeight: 1.8 }}>
                  <li>Request logged with status "Brief Received"</li>
                  <li>Production team will review within 24 hours</li>
                  <li>Credits confirmed once full brief is submitted</li>
                  <li>Track progress on the main dashboard</li>
                </ul>
              </div>
              <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#555", marginBottom: "10px" }}>Credit Reference</div>
                {DEL_TYPES.map(dt => (
                  <div key={dt.label} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f5f5f5", padding: "5px 0", fontSize: "11px" }}>
                    <span style={{ color: "#666", paddingRight: "8px" }}>{dt.label}</span>
                    <span style={{ color: "#444", fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }}>
                      {dt.creative !== null ? `C:${dt.creative} ` : ""}A:{dt.adaptation} R:{dt.resize}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── DASHBOARD VIEW ───────────────────────────────────────────
  const summaryRows = [
    ...MONTHLY_HISTORY,
    { month: "Apr 2026", used: aprUsed },
  ];

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", background: "#F4F4F4", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ background: "white", borderBottom: "1px solid #e8e8e8", padding: "14px 2rem" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ border: "1.5px dashed #d0d0d0", borderRadius: "6px", padding: "6px 14px", color: "#bbb", fontSize: "11px", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>EXAMPLE CLIENT LOGO</div>
            <div style={{ width: "1px", height: "30px", background: "#e8e8e8" }} />
            <div>
              <h1 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.2 }}>Content Points System</h1>
              <p style={{ margin: "3px 0 0", fontSize: "12px", color: "#999" }}>Project Progress & Monthly Points Usage</p>
            </div>
            <div style={{ width: "1px", height: "30px", background: "#e8e8e8" }} />
            <div style={{ border: "1.5px dashed #d0d0d0", borderRadius: "6px", padding: "6px 14px", color: "#bbb", fontSize: "11px", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>AGENCY LOGO</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} style={{ border: "1px solid #ddd", borderRadius: "6px", padding: "7px 10px", fontSize: "13px", background: "white", color: "#333", cursor: "pointer" }}>
              <option>Apr 2026</option>
              <option>Mar 2026</option>
              <option>May 2026</option>
            </select>
            <button onClick={() => setView("form")} style={{ background: OLIVE, color: "white", border: "none", borderRadius: "6px", padding: "8px 16px", fontSize: "13px", cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap" }}>
              + New Project Request
            </button>
            <button style={{ background: "white", color: "#555", border: "1px solid #ddd", borderRadius: "6px", padding: "8px 14px", fontSize: "13px", cursor: "pointer" }}>Refresh</button>
            <button style={{ background: OLIVE, color: "white", border: "none", borderRadius: "6px", padding: "8px 14px", fontSize: "13px", cursor: "pointer" }}>Export CSV</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "1.5rem 2rem" }}>

        {/* Metric cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px", marginBottom: "1.25rem" }}>
          {[
            { label: "Total Projects Briefed", value: currentProjects.length, sub: selectedMonth },
            { label: "In Progress",            value: inProgressCount,        sub: "Live projects" },
            { label: "Delivered Projects",     value: deliveredCount,         sub: `${completionPct}% completion` },
            { label: "Points Used",            value: pointsUsed,             sub: `${usedPct}% of monthly points` },
            { label: "Points Remaining",       value: pointsRemaining,        sub: "Available this month" },
          ].map((card, i) => (
            <div key={i} style={{ background: MAROON, borderRadius: "10px", padding: "1.25rem", color: "white" }}>
              <p style={{ margin: "0 0 10px", fontSize: "10px", color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600, lineHeight: 1.3 }}>{card.label}</p>
              <p style={{ margin: "0 0 5px", fontSize: "38px", fontWeight: 700, lineHeight: 1 }}>{card.value}</p>
              <p style={{ margin: 0, fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Monthly Points Usage */}
        <div style={{ background: "white", borderRadius: "10px", padding: "1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", marginBottom: "1.25rem" }}>
          <h3 style={{ margin: "0 0 14px", fontSize: "15px", fontWeight: 700, color: "#1a1a1a" }}>Monthly Points Usage</h3>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px", color: "#555" }}>
            <span>Monthly Points Used: <strong style={{ color: "#1a1a1a" }}>{pointsUsed}</strong></span>
            <span>Budget: <strong style={{ color: "#1a1a1a" }}>259</strong></span>
          </div>
          <div style={{ background: "#eeeeee", borderRadius: "6px", height: "14px", overflow: "hidden", marginBottom: "6px" }}>
            <div style={{ background: MAROON, width: `${usedPct}%`, height: "100%", borderRadius: "6px", transition: "width 0.4s ease" }} />
          </div>
          <p style={{ margin: "0 0 16px", fontSize: "12px", color: "#888" }}>{usedPct}% of monthly points used</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            {[
              { label: "Cap",       value: MONTHLY_CAP,     color: MAROON },
              { label: "Used",      value: pointsUsed,      color: "#555" },
              { label: "Remaining", value: pointsRemaining, color: MAROON },
            ].map(item => (
              <div key={item.label} style={{ textAlign: "center", padding: "14px", background: "#f9f9f9", borderRadius: "8px" }}>
                <p style={{ margin: "0 0 4px", fontSize: "10px", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>{item.label}</p>
                <p style={{ margin: 0, fontSize: "26px", fontWeight: 700, color: item.color }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "1.25rem" }}>
          <div style={{ background: "white", borderRadius: "10px", padding: "1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <h3 style={{ margin: "0 0 14px", fontSize: "15px", fontWeight: 700, color: "#1a1a1a" }}>Status Overview</h3>
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={statusChartData} margin={{ top: 4, right: 4, left: -24, bottom: 48 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#888" }} angle={-30} textAnchor="end" interval={0} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#aaa" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: "6px", border: "1px solid #eee" }} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                <Bar dataKey="count" name="Projects" fill={MAROON} radius={[4, 4, 0, 0]} maxBarSize={44} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ background: "white", borderRadius: "10px", padding: "1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <h3 style={{ margin: "0 0 14px", fontSize: "15px", fontWeight: 700, color: "#1a1a1a" }}>Deliverables Breakdown</h3>
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={delivChartData} margin={{ top: 4, right: 4, left: -24, bottom: 48 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#888" }} angle={-30} textAnchor="end" interval={0} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#aaa" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: "6px", border: "1px solid #eee" }} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                <Bar dataKey="credits" name="Credits" fill={MAROON} radius={[4, 4, 0, 0]} maxBarSize={44} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Projects */}
        <div style={{ background: "white", borderRadius: "10px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", overflow: "hidden", marginBottom: "1.25rem" }}>
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f0f0f0" }}>
            <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#1a1a1a" }}>Active Projects — {selectedMonth}</h3>
          </div>
          <ProjectTable projects={activeProjects} onViewBrief={openBrief} />
        </div>

        {/* Delivered & Cancelled (collapsible) */}
        <div style={{ background: "white", borderRadius: "10px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", overflow: "hidden", marginBottom: "1.25rem" }}>
          <button
            onClick={() => setDeliveredOpen(o => !o)}
            style={{ width: "100%", padding: "1.25rem 1.5rem", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: deliveredOpen ? "1px solid #f0f0f0" : "none" }}
          >
            <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#1a1a1a" }}>
              Delivered & Cancelled Projects — {selectedMonth}
              <span style={{ marginLeft: "10px", fontSize: "12px", fontWeight: 400, color: "#aaa" }}>({doneProjects.length})</span>
            </h3>
            <span style={{ fontSize: "18px", color: "#aaa", lineHeight: 1 }}>{deliveredOpen ? "▲" : "▼"}</span>
          </button>
          {deliveredOpen && <ProjectTable projects={doneProjects} onViewBrief={openBrief} />}
        </div>

        {/* Monthly Summary */}
        <div style={{ background: "white", borderRadius: "10px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", overflow: "hidden" }}>
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f0f0f0" }}>
            <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#1a1a1a" }}>Monthly Summary</h3>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "#fafafa" }}>
                {["Month", "Credit Cap", "Used", "Remaining"].map(h => (
                  <th key={h} style={{ padding: "10px 20px", textAlign: "left", color: "#999", fontWeight: 600, fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #eee" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {summaryRows.map((row, i) => {
                const rem = row.used <= MONTHLY_CAP ? MONTHLY_CAP - row.used : MONTHLY_CAP - row.used;
                const isApr = row.month === "Apr 2026";
                return (
                  <tr key={row.month} style={{ borderBottom: "1px solid #f5f5f5", background: isApr ? "#FAFAF8" : i % 2 === 0 ? "white" : "#fafafa", fontWeight: isApr ? 600 : 400 }}>
                    <td style={{ padding: "11px 20px", color: "#2a2a2a" }}>{row.month}{isApr && <span style={{ marginLeft: "8px", fontSize: "10px", background: MAROON, color: "white", padding: "2px 6px", borderRadius: "4px" }}>Current</span>}</td>
                    <td style={{ padding: "11px 20px", color: "#555" }}>{MONTHLY_CAP}</td>
                    <td style={{ padding: "11px 20px", color: "#555" }}>{row.used}</td>
                    <td style={{ padding: "11px 20px", fontWeight: 700, color: rem >= 0 ? "#2E7D32" : "#C62828" }}>{rem >= 0 ? rem : rem}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
