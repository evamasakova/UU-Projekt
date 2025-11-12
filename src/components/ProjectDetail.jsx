import React, { useEffect, useMemo, useState } from "react";
import { Calendar, User, Target, Clock, Info } from "lucide-react";

function formatDate(iso) {
    if (!iso) return "—";
    try {
        return new Date(iso).toLocaleString(undefined, {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return iso;
    }
}

function formatNumber(n) {
    if (n === null || n === undefined || Number.isNaN(n)) return "—";
    try {
        return new Intl.NumberFormat("cs-CZ").format(Number(n));
    } catch {
        return String(n);
    }
}

function daysLeft(deadlineIso) {
    if (!deadlineIso) return null;
    const diff = new Date(deadlineIso).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function pickRaised(p) {
    if (!p) return 0;
    return (
        p.raisedAmount ??
        p.contributedAmount ??
        p.currentAmount ??
        0
    );
}

function clamp01(x) {
    if (!isFinite(x)) return 0;
    return Math.max(0, Math.min(1, x));
}

function StatusBadge({ status }) {
    const map = {
        PendingApproval: { bg: "#FEF3C7", color: "#92400E", label: "Čeká na schválení" },
        Active:          { bg: "#DCFCE7", color: "#166534", label: "Aktivní" },
        Completed:       { bg: "#E0E7FF", color: "#3730A3", label: "Dokončeno" },
        Cancelled:       { bg: "#FEE2E2", color: "#991B1B", label: "Zrušeno" },
    };
    const s = map[status] || { bg: "#F3F4F6", color: "#374151", label: status || "Neznámý" };
    return (
        <span style={{
            background: s.bg, color: s.color,
            padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600
        }}>
      {s.label}
    </span>
    );
}

export default function ProjectDetail({ project, projectId, apiBaseUrl = "/api" }) {
    const [data, setData] = useState(project || null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(!project && !!projectId);

    useEffect(() => {
        if (project || !projectId) return;
        let abort = false;
        (async () => {
            try {
                setLoading(true);
                setError("");
                const res = await fetch(`${apiBaseUrl}/projects/${projectId}`);
                if (!res.ok) throw new Error("Nepodařilo se načíst projekt");
                const json = await res.json();
                if (!abort) setData(json);
            } catch (e) {
                if (!abort) setError(e?.message || "Chyba při načítání");
            } finally {
                if (!abort) setLoading(false);
            }
        })();
        return () => { abort = true; };
    }, [project, projectId, apiBaseUrl]);

    const left = useMemo(() => daysLeft(data?.deadLine), [data?.deadLine]);

    const goal = Number(data?.goalAmount ?? 0);
    const raised = Number(pickRaised(data));
    const pct = goal > 0 ? clamp01(raised / goal) : 0;
    const pctText = Math.round(pct * 100);

    let barColor = "#F59E0B";
    if (pct >= 0.8) barColor = "#16A34A";
    if (pct <= 0.25) barColor = "#DC2626";

    return (
        <div style={{ maxWidth: 880, margin: "24px auto", padding: 16 }}>
            <div style={{
                border: "1px solid #E5E7EB",
                borderRadius: 16,
                padding: 20,
                background: "#fff",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                    <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>
                        {loading ? "Načítám…" : (data?.name || "—")}
                    </h2>
                    {!loading && <StatusBadge status={data?.status} />}
                </div>


                {error && (
                    <div style={{
                        marginTop: 12, padding: 12, borderRadius: 10,
                        background: "#FEF2F2", color: "#991B1B", border: "1px solid #FECACA",
                        display: "flex", gap: 8, alignItems: "center", fontSize: 14
                    }}>
                        <Info size={16} /> {error}
                    </div>
                )}

                <p style={{ marginTop: 12, color: "#4B5563", lineHeight: 1.6 }}>
                    {loading ? " " : (data?.description || "Bez popisu.")}
                </p>

                <div style={{
                    marginTop: 16,
                    border: "1px solid #E5E7EB",
                    borderRadius: 12,
                    padding: 14,
                    background: "#F9FAFB"
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <strong style={{ fontSize: 14 }}>
                            Přispěno: {formatNumber(raised)} / {formatNumber(goal)}
                        </strong>
                        <span style={{ fontSize: 12, color: "#6B7280" }}>{pctText}%</span>
                    </div>

                    <div style={{
                        marginTop: 8,
                        width: "100%",
                        height: 10,
                        background: "#E5E7EB",
                        borderRadius: 999,
                        overflow: "hidden",
                    }}>
                        <div
                            style={{
                                width: `${pct * 100}%`,
                                height: "100%",
                                background: barColor,
                                transition: "width 300ms ease",
                            }}
                        />
                    </div>

                    {typeof left === "number" && (
                        <div style={{ marginTop: 8, fontSize: 12, color: left < 0 ? "#991B1B" : "#374151" }}>
                            {left < 0
                                ? `Projekt je ${Math.abs(left)} dnů po termínu.`
                                : `Do deadline zbývá ${left} dnů.`}
                        </div>
                    )}
                </div>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 12, marginTop: 16
                }}>
                    <InfoItem icon={<User size={18} />} label="Vlastník">
                        {loading ? " " : (data?.ownerId || "—")}
                    </InfoItem>

                    <InfoItem icon={<Target size={18} />} label="Cíl">
                        {loading ? " " : (typeof data?.goalAmount === "number" ? formatNumber(data.goalAmount) : "—")}
                    </InfoItem>

                    <InfoItem icon={<Calendar size={18} />} label="Vytvořeno">
                        {loading ? " " : formatDate(data?.creationDate)}
                    </InfoItem>

                    <InfoItem icon={<Calendar size={18} />} label="Aktualizováno">
                        {loading ? " " : formatDate(data?.lastUpdatedDate)}
                    </InfoItem>

                    <InfoItem icon={<Clock size={18} />} label="Deadline">
                        {loading ? " " : formatDate(data?.deadLine)}
                    </InfoItem>
                </div>
            </div>
        </div>
    );
}

function InfoItem({ icon, label, children }) {
    return (
        <div style={{
            border: "1px solid #E5E7EB",
            borderRadius: 12,
            padding: 12,
            background: "#F9FAFB"
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#6B7280", fontSize: 12, fontWeight: 600 }}>
                {icon} {label}
            </div>
            <div style={{ marginTop: 6, fontSize: 14, fontWeight: 600, color: "#111827" }}>{children}</div>
        </div>
    );
}
