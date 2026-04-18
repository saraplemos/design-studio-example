import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const ACCENT = "#C41230";

const contentTypes = [
  { label: "Instagram Carousel", points: 4 },
  { label: "Facebook Video Copy", points: 3 },
  { label: "Blog Post (600w)", points: 6 },
  { label: "Email Campaign", points: 5 },
  { label: "Social Story Set (x5)", points: 2 },
  { label: "Press Release", points: 8 },
  { label: "Caption Set (x10)", points: 3 },
  { label: "Ad Copy Variants", points: 4 },
];

const properties = [
  "Property / Brand 1",
  "Property / Brand 2",
  "Property / Brand 3",
  "Property / Brand 4",
  "Property / Brand 5",
];

const statusStyle = (s: string) => {
  const map: Record<string, { bg: string; color: string; dot: string }> = {
    Delivered:        { bg: "#E8F5E9", color: "#1B5E20", dot: "#43A047" },
    "In Review":      { bg: "#FFF8E1", color: "#E65100", dot: "#FB8C00" },
    "In Production":  { bg: "#E3F2FD", color: "#0D47A1", dot: "#1E88E5" },
    Submitted:        { bg: "#F3E5F5", color: "#4A148C", dot: "#8E24AA" },
  };
  return map[s] || { bg: "#F5F5F5", color: "#555", dot: "#999" };
};

const emptyChart = [
  { month: "Month 1", used: 0 },
  { month: "Month 2", used: 0 },
  { month: "Month 3", used: 0 },
  { month: "Month 4", used: 0 },
  { month: "Month 5", used: 0 },
  { month: "This month", used: 0 },
];

export default function App() {
  const [requests, setRequests] = useState<any[]>([]);
  const [balance, setBalance] = useState(50);
  const [usedThisMonth, setUsedThisMonth] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: contentTypes[0].label, property: properties[0], notes: "", urgency: "standard" });
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [reqCounter, setReqCounter] = useState(1);

  const selectedType = contentTypes.find(t => t.label === form.type) || contentTypes[0];
  const pointCost = selectedType.points;

  const showToast = (msg: string, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = () => {
    if (balance < pointCost) { showToast("Insufficient points balance.", "error"); return; }
    const newId = `REQ-${String(reqCounter).padStart(3, "0")}`;
    const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    setRequests(prev => [{ id: newId, type: form.type, property: form.property, status: "Submitted", points: pointCost, urgency: form.urgency, date: today }, ...prev]);
    setBalance(prev => prev - pointCost);
    setUsedThisMonth(prev => prev + pointCost);
    setReqCounter(prev => prev + 1);
    setForm({ type: contentTypes[0].label, property: properties[0], notes: "", urgency: "standard" });
    setShowForm(false);
    showToast(`${newId} submitted — ${pointCost} points deducted.`);
  };

  const filtered = activeTab === "all" ? requests : requests.filter(r => r.status === activeTab);
  const chartData = [...emptyChart.slice(0, 5), { month: "This month", used: usedThisMonth }];
  const activeCount = requests.filter(r => r.status !== "Delivered").length;
  const deliveredCount = requests.filter(r => r.status === "Delivered").length;

  return (
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", background: "#F7F5F2", minHeight: "100vh" }}>

      {toast && (
        <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 1000, background: toast.type === "error" ? "#B71C1C" : "#1B5E20", color: "white", padding: "12px 20px", borderRadius: "10px", fontSize: "13px", fontFamily: "system-ui", boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
          {toast.msg}
        </div>
      )}

      <header style={{ background: "#1a1a1a", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ border: "1.5px dashed rgba(255,255,255,0.35)", borderRadius: "6px", padding: "5px 14px", color: "rgba(255,255,255,0.45)", fontSize: "12px", fontFamily: "system-ui", letterSpacing: "0.06em" }}>
            YOUR LOGO HERE
          </div>
          <div style={{ width: "1px", height: "22px", background: "rgba(255,255,255,0.15)" }} />
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", letterSpacing: "0.15em", fontFamily: "system-ui", textTransform: "uppercase" }}>Content Points Dashboard</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "6px", padding: "5px 14px", color: "rgba(255,255,255,0.5)", fontSize: "11px", fontFamily: "system-ui", letterSpacing: "0.05em" }}>LIVE DEMO</div>
          <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.5)", fontSize: "12px", fontFamily: "system-ui" }}>YOU</div>
        </div>
      </header>

      <div style={{ background: "#FFF8E1", borderBottom: "1px solid #FFE082", padding: "10px 2rem", display: "flex", alignItems: "center", gap: "10px", fontFamily: "system-ui", fontSize: "13px", color: "#5D4037" }}>
        <span style={{ fontWeight: "bold", color: "#E65100" }}>Interactive Demo:</span>
        <span>Use the form below to submit your first content request and see exactly how the system works.</span>
        <span style={{ marginLeft: "auto", color: "#999", fontSize: "11px" }}>Points reset on each session</span>
      </div>

      <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "2rem 1.5rem" }}>

        <div style={{ marginBottom: "1.75rem" }}>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "normal", color: "#1a1a1a" }}>Content Production Dashboard</h1>
          <p style={{ margin: "5px 0 0", color: "#999", fontSize: "13px", fontFamily: "system-ui" }}>Monthly points allocation: 50 points · Spend on any content type below</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "1.75rem" }}>
          {[
            { label: "Points Balance", value: balance, sub: "available to spend", accent: ACCENT },
            { label: "Used This Month", value: usedThisMonth, sub: "of 50 allocated", accent: "#B8860B" },
            { label: "Active Requests", value: activeCount, sub: activeCount === 0 ? "submit one below" : "in progress", accent: "#1565C0" },
            { label: "Delivered", value: deliveredCount, sub: deliveredCount === 0 ? "pending first request" : "completed", accent: "#2E7D32" },
          ].map((card, i) => (
            <div key={i} style={{ background: "white", borderRadius: "12px", padding: "1.1rem 1.25rem", borderTop: `3px solid ${card.accent}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <p style={{ margin: "0 0 6px", fontSize: "11px", color: "#aaa", fontFamily: "system-ui", textTransform: "uppercase", letterSpacing: "0.08em" }}>{card.label}</p>
              <p style={{ margin: "0 0 3px", fontSize: "34px", color: card.accent, lineHeight: "1" }}>{card.value}</p>
              <p style={{ margin: 0, fontSize: "12px", color: "#ccc", fontFamily: "system-ui" }}>{card.sub}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.7fr", gap: "20px" }}>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: showForm ? "1.25rem" : "1rem" }}>
                <h2 style={{ margin: 0, fontSize: "15px", fontWeight: "normal", color: "#1a1a1a" }}>Submit a Request</h2>
                <button onClick={() => setShowForm(!showForm)} style={{ background: showForm ? "#f0f0f0" : ACCENT, color: showForm ? "#555" : "white", border: "none", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", cursor: "pointer", fontFamily: "system-ui" }}>
                  {showForm ? "Cancel" : "+ New Request"}
                </button>
              </div>

              {showForm ? (
                <div>
                  <div style={{ marginBottom: "12px" }}>
                    <label style={{ display: "block", fontSize: "11px", color: "#aaa", fontFamily: "system-ui", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "5px" }}>Content Type</label>
                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={{ width: "100%", padding: "9px 10px", border: "1px solid #e8e8e8", borderRadius: "8px", fontSize: "13px", fontFamily: "system-ui", background: "#fafafa" }}>
                      {contentTypes.map(t => <option key={t.label}>{t.label} — {t.points} pts</option>)}
                    </select>
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    <label style={{ display: "block", fontSize: "11px", color: "#aaa", fontFamily: "system-ui", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "5px" }}>Property / Brand</label>
                    <select value={form.property} onChange={e => setForm({ ...form, property: e.target.value })} style={{ width: "100%", padding: "9px 10px", border: "1px solid #e8e8e8", borderRadius: "8px", fontSize: "13px", fontFamily: "system-ui", background: "#fafafa" }}>
                      {properties.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    <label style={{ display: "block", fontSize: "11px", color: "#aaa", fontFamily: "system-ui", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "5px" }}>Urgency</label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {[{ val: "standard", label: "Standard (3 days)" }, { val: "priority", label: "Priority (24 hrs)" }].map(u => (
                        <button key={u.val} onClick={() => setForm({ ...form, urgency: u.val })} style={{ flex: 1, padding: "8px", cursor: "pointer", border: `1px solid ${form.urgency === u.val ? ACCENT : "#e8e8e8"}`, borderRadius: "8px", background: form.urgency === u.val ? "#FFF0F2" : "white", color: form.urgency === u.val ? ACCENT : "#888", fontSize: "12px", fontFamily: "system-ui" }}>
                          {u.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "11px", color: "#aaa", fontFamily: "system-ui", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "5px" }}>Brief / Notes</label>
                    <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} placeholder="Key messages, tone, references, deadline..." style={{ width: "100%", padding: "9px 10px", border: "1px solid #e8e8e8", borderRadius: "8px", fontSize: "13px", fontFamily: "system-ui", resize: "vertical", boxSizing: "border-box", background: "#fafafa" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid #f5f5f5" }}>
                    <div style={{ fontFamily: "system-ui", fontSize: "13px", color: "#888" }}>
                      Cost: <span style={{ color: ACCENT, fontWeight: "bold", fontSize: "15px" }}>{pointCost} pts</span>
                      {balance < pointCost && <span style={{ color: "#c0392b", fontSize: "11px", marginLeft: "8px" }}>Insufficient balance</span>}
                    </div>
                    <button onClick={handleSubmit} disabled={balance < pointCost} style={{ background: balance >= pointCost ? ACCENT : "#ddd", color: balance >= pointCost ? "white" : "#aaa", border: "none", borderRadius: "8px", padding: "10px 22px", fontSize: "13px", cursor: balance >= pointCost ? "pointer" : "not-allowed", fontFamily: "system-ui" }}>
                      Submit Request
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p style={{ margin: "0 0 12px", fontSize: "13px", color: "#999", fontFamily: "system-ui", lineHeight: 1.5 }}>Choose a content type and submit a brief. Your team receives it instantly and production begins.</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {contentTypes.slice(0, 4).map(t => (
                      <button key={t.label} onClick={() => { setForm({ ...form, type: t.label }); setShowForm(true); }} style={{ background: "#faf9f8", border: "1px solid #ede8e0", borderRadius: "8px", padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", fontSize: "12px", fontFamily: "system-ui", color: "#555" }}>
                        <span>{t.label}</span>
                        <span style={{ color: ACCENT, fontWeight: "bold", marginLeft: "6px" }}>{t.points}pt</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <h2 style={{ margin: "0 0 1.25rem", fontSize: "15px", fontWeight: "normal", color: "#1a1a1a" }}>Points Usage Over Time</h2>
              {usedThisMonth === 0 ? (
                <div style={{ height: "150px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#ccc", fontFamily: "system-ui", fontSize: "13px", gap: "8px" }}>
                  <div style={{ fontSize: "28px" }}>📊</div>
                  <span>Usage will appear here as you submit requests</span>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={chartData} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
                    <XAxis dataKey="month" tick={{ fontSize: 10, fontFamily: "system-ui", fill: "#bbb" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fontFamily: "system-ui", fill: "#bbb" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ fontFamily: "system-ui", fontSize: 12, borderRadius: "8px", border: "1px solid #eee" }} formatter={(v: any) => [`${v} points`, "Used"]} />
                    <Bar dataKey="used" radius={[4, 4, 0, 0]} maxBarSize={32}>
                      {chartData.map((_: any, i: number) => <Cell key={i} fill={i === chartData.length - 1 ? ACCENT : "#EDCDD2"} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontFamily: "system-ui", fontSize: "11px", color: "#ccc" }}>
                <span>Monthly allocation: 50 pts</span>
                {usedThisMonth > 0 && <span style={{ color: ACCENT }}>{50 - usedThisMonth} pts remaining</span>}
              </div>
            </div>
          </div>

          <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ margin: 0, fontSize: "15px", fontWeight: "normal", color: "#1a1a1a" }}>Requests</h2>
              <div style={{ display: "flex", gap: "6px", fontFamily: "system-ui" }}>
                {["all", "Submitted", "In Production", "Delivered"].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "5px 11px", borderRadius: "20px", cursor: "pointer", border: `1px solid ${activeTab === tab ? ACCENT : "#e8e8e8"}`, background: activeTab === tab ? "#FFF0F2" : "white", color: activeTab === tab ? ACCENT : "#999", fontSize: "11px" }}>
                    {tab === "all" ? "All" : tab}
                  </button>
                ))}
              </div>
            </div>

            {requests.length === 0 ? (
              <div style={{ padding: "60px 20px", textAlign: "center", color: "#ccc", fontFamily: "system-ui" }}>
                <div style={{ fontSize: "40px", marginBottom: "16px" }}>📋</div>
                <p style={{ margin: "0 0 8px", fontSize: "15px", color: "#bbb" }}>No requests yet</p>
                <p style={{ margin: 0, fontSize: "13px", color: "#ddd", lineHeight: 1.6 }}>Submit your first content request using the form on the left. It will appear here with a live status tracker.</p>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "system-ui", fontSize: "13px" }}>
                <thead>
                  <tr>
                    {["Ref", "Content Type", "Property", "Date", "Status", "Pts"].map(h => (
                      <th key={h} style={{ padding: "6px 10px", textAlign: "left", color: "#ccc", fontWeight: "normal", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid #f5f5f5" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((req: any) => {
                    const sc = statusStyle(req.status);
                    return (
                      <tr key={req.id} style={{ borderBottom: "1px solid #f9f9f9" }}>
                        <td style={{ padding: "10px", color: "#ccc", fontSize: "11px", fontWeight: "bold" }}>{req.id}</td>
                        <td style={{ padding: "10px", color: "#2a2a2a" }}>{req.type}</td>
                        <td style={{ padding: "10px", color: "#777", fontSize: "12px" }}>{req.property}</td>
                        <td style={{ padding: "10px", color: "#bbb", fontSize: "11px" }}>{req.date}</td>
                        <td style={{ padding: "10px" }}>
                          <span style={{ background: sc.bg, color: sc.color, padding: "3px 10px", borderRadius: "20px", fontSize: "11px", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: sc.dot, flexShrink: 0 }} />
                            {req.status}
                          </span>
                        </td>
                        <td style={{ padding: "10px", color: ACCENT, fontWeight: "bold", textAlign: "center" }}>{req.points}</td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr><td colSpan={6} style={{ padding: "32px", textAlign: "center", color: "#ccc", fontSize: "13px" }}>No requests in this category</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", marginTop: "20px" }}>
          <h2 style={{ margin: "0 0 0.5rem", fontSize: "15px", fontWeight: "normal", color: "#1a1a1a" }}>How Points Work</h2>
          <p style={{ margin: "0 0 1rem", fontSize: "13px", color: "#999", fontFamily: "system-ui", lineHeight: 1.6 }}>Each content type has a fixed point cost. Your monthly allocation covers a mix of formats. Unused points roll over. Priority requests are delivered in 24 hours.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", fontFamily: "system-ui" }}>
            {contentTypes.map(t => (
              <div key={t.label} style={{ padding: "12px 14px", background: "#faf9f8", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #f0ece6" }}>
                <span style={{ fontSize: "12px", color: "#666" }}>{t.label}</span>
                <span style={{ fontWeight: "bold", color: ACCENT, fontSize: "14px", marginLeft: "8px", flexShrink: 0 }}>{t.points}pt</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}