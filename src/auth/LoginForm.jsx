import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (e) {
      setErr(e?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={submit}>
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
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm(s => ({ ...s, password: e.target.value }))}
          required
        />
      </label>

      {err && <div className="auth-error">{err}</div>}

      <button className="auth-button" type="submit" disabled={loading}>
        {loading ? "Signing in…" : "Login"}
      </button>
    </form>
  );
}
