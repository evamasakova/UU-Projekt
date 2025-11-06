import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

export default function RegisterForm({ onRegistered }) {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await register(form);
      // если бэкенд сразу не логинит, можно вернуть на логин
      if (!res?.token && onRegistered) onRegistered();
      else navigate("/dashboard", { replace: true });
    } catch (e) {
      setErr(e?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={submit}>
      <label className="auth-label">
        Name
        <input
          type="text"
          className="auth-input"
          placeholder="Your name"
          value={form.name}
          onChange={(e) => setForm(s => ({ ...s, name: e.target.value }))}
          required
        />
      </label>

      <label className="auth-label">
        Email
        <input
          type="email"
          className="auth-input"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm(s => ({ ...s, email: e.target.value }))}
          required
        />
      </label>

      <label className="auth-label">
        Password
        <input
          type="password"
          className="auth-input"
          placeholder="Min. 6 characters"
          value={form.password}
          onChange={(e) => setForm(s => ({ ...s, password: e.target.value }))}
          required
          minLength={6}
        />
      </label>

      {err && <div className="auth-error">{err}</div>}

      <button className="auth-button" type="submit" disabled={loading}>
        {loading ? "Registering…" : "Register"}
      </button>
    </form>
  );
}
