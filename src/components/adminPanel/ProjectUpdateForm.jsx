import React, { useEffect, useState } from "react";

// Enum statusů
const STATUS_OPTIONS = ["PendingApproval", "Approved", "Rejected", "Closed"];

/**
 * Režimy:
 * - MOCK (teď):  <ProjectUpdateForm project={mockProject} />
 * - BACKEND (později): <ProjectUpdateForm projectId={id} apiBaseUrl="/api" />
 */
export default function ProjectUpdateForm({
                                              project,
                                              projectId,
                                              apiBaseUrl = "/api",
                                          }) {
    const [form, setForm] = useState(createInitialForm(project));
    const [loading, setLoading] = useState(!project && !!projectId);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    // když se změní props (project nebo projectId)
    useEffect(() => {
        // mock režim – máme rovnou project → žádný fetch
        if (project) {
            setForm(createInitialForm(project));
            setLoading(false);
            setError("");
            setSuccess("");
            return;
        }

        // pokud není ani project, ani projectId → nic neumíme
        if (!projectId) {
            setError("Chybí data projektu (ani project ani projectId).");
            setLoading(false);
            return;
        }

        // BE režim – budoucnost: načtení z API
        let abort = false;
        (async () => {
            try {
                setLoading(true);
                setError("");
                const res = await fetch(`${apiBaseUrl}/projects/${projectId}`);
                if (!res.ok) throw new Error("Nepodařilo se načíst projekt");
                const data = await res.json();
                if (abort) return;
                setForm(createInitialForm(data));
            } catch (e) {
                if (!abort) setError(e?.message || "Chyba při načítání projektu");
            } finally {
                if (!abort) setLoading(false);
            }
        })();

        return () => {
            abort = true;
        };
    }, [project, projectId, apiBaseUrl]);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "goalAmount" ? Number(value) : value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setSuccess("");
        setError("");

        const payload = {
            _id: project?._id ?? projectId,
            name: form.name,
            description: form.description,
            ownerId: form.ownerId,
            creationDate: form.creationDate,
            lastUpdatedDate: form.lastUpdatedDate,
            goalAmount: form.goalAmount,
            deadLine: form.deadLine
                ? new Date(form.deadLine).toISOString()
                : null,
            status: form.status,
        };

        // MOCK režim – backend neběží → jen log + success
        if (!projectId) {
            console.log("PROJECT UPDATE PAYLOAD (mock, bez backendu):", payload);
            setSuccess("Změny byly lokálně zpracovány (mock). Backend zatím neběží.");
            setSaving(false);
            return;
        }

        // BE režim – budoucnost, až poběží API
        try {
            const res = await fetch(`${apiBaseUrl}/projects/${projectId}`, {
                method: "PUT", // nebo PATCH
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("Nepodařilo se uložit změny");
            setSuccess("Projekt byl úspěšně aktualizován.");
        } catch (e) {
            setError(e?.message || "Chyba při ukládání projektu");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <p style={{ padding: 16 }}>Načítám projekt…</p>;
    }

    if (error && !form.name && !form.description) {
        // když je chyba a nemáme vůbec data
        return (
            <p style={{ padding: 16, color: "#991b1b" }}>
                {error}
            </p>
        );
    }

    return (
        <div
            style={{
                maxWidth: 800,
                margin: "24px auto",
                padding: 16,
            }}
        >
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
                Upravit projekt
            </h2>

            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    border: "1px solid #e5e7eb",
                    borderRadius: 12,
                    padding: 16,
                    background: "#fff",
                }}
            >
                {error && (
                    <div
                        style={{
                            padding: 8,
                            borderRadius: 8,
                            background: "#fee2e2",
                            color: "#991b1b",
                            border: "1px solid #fecaca",
                            fontSize: 14,
                        }}
                    >
                        {error}
                    </div>
                )}

                {success && (
                    <div
                        style={{
                            padding: 8,
                            borderRadius: 8,
                            background: "#dcfce7",
                            color: "#166534",
                            border: "1px solid #bbf7d0",
                            fontSize: 14,
                        }}
                    >
                        {success}
                    </div>
                )}

                {/* NAME */}
                <Field label="Název">
                    <input
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    />
                </Field>

                {/* DESCRIPTION */}
                <Field label="Popis">
          <textarea
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              style={{ ...inputStyle, resize: "vertical" }}
          />
                </Field>

                {/* OWNER */}
                <Field label="Owner ID">
                    <input
                        name="ownerId"
                        type="text"
                        value={form.ownerId}
                        onChange={handleChange}
                        style={inputStyle}
                    />
                </Field>

                {/* GOAL */}
                <Field label="Cílová částka">
                    <input
                        name="goalAmount"
                        type="number"
                        min={0}
                        value={form.goalAmount}
                        onChange={handleChange}
                        style={inputStyle}
                    />
                </Field>

                {/* DEADLINE */}
                <Field label="Deadline">
                    <input
                        name="deadLine"
                        type="datetime-local"
                        value={form.deadLine}
                        onChange={handleChange}
                        style={inputStyle}
                    />
                </Field>

                {/* STATUS */}
                <Field label="Status">
                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        style={inputStyle}
                    >
                        {STATUS_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                </Field>

                {/* READONLY INFO */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: 12,
                        marginTop: 8,
                        fontSize: 12,
                        color: "#6b7280",
                    }}
                >
                    <div>
                        <div>Vytvořeno</div>
                        <div style={{ fontWeight: 600 }}>
                            {form.creationDate || "—"}
                        </div>
                    </div>
                    <div>
                        <div>Naposledy aktualizováno</div>
                        <div style={{ fontWeight: 600 }}>
                            {form.lastUpdatedDate || "—"}
                        </div>
                    </div>
                </div>

                {/* BUTTON */}
                <div
                    style={{
                        marginTop: 12,
                        display: "flex",
                        gap: 8,
                        justifyContent: "flex-end",
                    }}
                >
                    <button
                        type="submit"
                        disabled={saving}
                        style={{
                            padding: "8px 16px",
                            borderRadius: 8,
                            border: "none",
                            background: saving ? "#9ca3af" : "#2563eb",
                            color: "#fff",
                            fontWeight: 600,
                            cursor: saving ? "default" : "pointer",
                        }}
                    >
                        {saving ? "Ukládám…" : projectId ? "Uložit změny" : "Uložit změny (mock)"}
                    </button>
                </div>
            </form>
        </div>
    );
}

/* ---- helpers ---- */

function createInitialForm(p) {
    if (!p) {
        return {
            name: "",
            description: "",
            ownerId: "",
            creationDate: "",
            lastUpdatedDate: "",
            goalAmount: 0,
            deadLine: "",
            status: "PendingApproval",
        };
    }

    return {
        name: p.name || "",
        description: p.description || "",
        ownerId: p.ownerId || "",
        creationDate: p.creationDate || "",
        lastUpdatedDate: p.lastUpdatedDate || "",
        goalAmount: p.goalAmount ?? 0,
        deadLine: p.deadLine ? toLocalDatetimeInputValue(p.deadLine) : "",
        status: p.status || "PendingApproval",
    };
}

const inputStyle = {
    width: "100%",
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 14,
};

function Field({ label, children }) {
    return (
        <label style={{ display: "block", fontSize: 14 }}>
            <div style={{ marginBottom: 4, fontWeight: 600 }}>{label}</div>
            {children}
        </label>
    );
}

// převod ISO → hodnota pro <input type="datetime-local">
function toLocalDatetimeInputValue(isoString) {
    try {
        const d = new Date(isoString);
        const pad = (n) => String(n).padStart(2, "0");
        const yyyy = d.getFullYear();
        const mm = pad(d.getMonth() + 1);
        const dd = pad(d.getDate());
        const hh = pad(d.getHours());
        const mi = pad(d.getMinutes());
        return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
    } catch {
        return "";
    }
}
