import React, { useEffect, useMemo, useState } from "react";
import "../styles/home.css";
import MessageBanner from "../components/MessageBanner";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function providerLabel(user) {
  const p = user?.providerData?.[0]?.providerId;
  if (!p) return "Unknown";
  if (p === "password") return "Email/Password";
  if (p === "google.com") return "Google";
  if (p === "github.com") return "GitHub";
  return p;
}

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [msg, setMsg] = useState({ type: "", text: "" });
  const [loggingOut, setLoggingOut] = useState(false);

  // ✅ Same theme toggle (shared with AuthPage)
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const details = useMemo(() => {
    return {
      name: user?.displayName || "—",
      email: user?.email || "—",
      provider: providerLabel(user),
      uid: user?.uid || "—",
    };
  }, [user]);

  async function handleLogout() {
    setMsg({ type: "", text: "" });
    setLoggingOut(true);
    try {
      await signOut(auth);
      navigate("/auth", { replace: true });
    } catch (e) {
      setMsg({ type: "error", text: "Logout failed. Please try again." });
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <main className="page">
      <div className="container">
        <div className="homeHeader">
          <div className="homeTitleRow">
            <h2 className="h2">Home</h2>

            {/* 🌙 Theme toggle */}
            <button
              type="button"
              className="themeBtn"
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </button>
          </div>

          <button className="btn btnGhost" onClick={handleLogout} disabled={loggingOut}>
            {loggingOut ? "Signing out…" : "Logout"}
          </button>
        </div>

        <MessageBanner
          type={msg.type || "error"}
          message={msg.text}
          onClose={() => setMsg({ type: "", text: "" })}
        />

        <div className="homeGrid">
          <section className="panel">
            <div className="panelTitle">You’re signed in</div>
            <div className="panelSub">Session is active and persists after refresh.</div>

            <div className="kv">
              <div className="kvRow">
                <div className="kvKey">Display Name</div>
                <div className="kvVal">{details.name}</div>
              </div>
              <div className="kvRow">
                <div className="kvKey">Email</div>
                <div className="kvVal">{details.email}</div>
              </div>
              <div className="kvRow">
                <div className="kvKey">Provider</div>
                <div className="kvVal">{details.provider}</div>
              </div>
              <div className="kvRow">
                <div className="kvKey">UID</div>
                <div className="kvVal mono">{details.uid}</div>
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panelTitle">Quick checks</div>
            <ul className="checkList">
              <li>Refresh this page — you should stay logged in.</li>
              <li>Try Logout — you’ll be redirected to Auth.</li>
              <li>Try Google/GitHub sign-in to see provider changes.</li>
            </ul>

            <button
              className="btn btnPrimary"
              onClick={() =>
                setMsg({ type: "success", text: "Looks good! Refresh to confirm persistence." })
              }
            >
              Run UI check
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}
