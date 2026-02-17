import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import MessageBanner from "../components/MessageBanner";

import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";

function friendlyError(code) {
  const map = {
    "auth/email-already-in-use": "That email is already registered. Try logging in instead.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/invalid-credential": "Invalid email or password.",
    "auth/wrong-password": "Invalid email or password.",
    "auth/user-not-found": "No account found with that email.",
    "auth/popup-closed-by-user": "Popup closed before completing sign-in.",
    "auth/account-exists-with-different-credential":
      "An account already exists with a different sign-in method for this email.",
    "auth/operation-not-allowed":
      "This sign-in method is not enabled in Firebase Authentication settings.",
  };
  return map[code] || "Something went wrong. Please try again.";
}

export default function AuthPage() {
  const [tab, setTab] = useState("login");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPass, setShowPass] = useState(false);

  // 🌙 Dark/Light theme
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const canSubmitRegister = useMemo(
    () => email.trim() && password.length >= 6,
    [email, password]
  );
  const canSubmitLogin = useMemo(
    () => email.trim() && password.trim(),
    [email, password]
  );

  function resetMessages() {
    setError("");
    setSuccess("");
  }

  function switchTab(nextTab) {
    setTab(nextTab);
    setName("");
    setEmail("");
    setPassword("");
    setShowPass(false);
    resetMessages();
  }

  async function handleEmailAuth(e) {
    e.preventDefault();
    resetMessages();

    if (!email.trim()) return setError("Email is required.");
    if (!password.trim()) return setError("Password is required.");
    if (tab === "register" && password.length < 6)
      return setError("Password must be at least 6 characters.");

    setLoading(true);
    try {
      if (tab === "register") {
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        if (name.trim()) {
          await updateProfile(cred.user, { displayName: name.trim() });
        }
        setSuccess("Account created successfully.");
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
        setSuccess("Login successful.");
      }
      setTimeout(() => navigate("/home", { replace: true }), 500);
    } catch (e2) {
      setError(friendlyError(e2.code));
    } finally {
      setLoading(false);
    }
  }

  async function handleProvider(providerName) {
    resetMessages();
    setLoading(true);
    try {
      const provider =
        providerName === "google" ? new GoogleAuthProvider() : new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/home");
    } catch (e) {
      setError(friendlyError(e.code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="authPage">
      <div className="authWrap">
        <div className="authCard">
          <div className="authHeaderRow">
            <div>
              <div className="authTitle">Welcome to AuroraAuth</div>
              <div className="authSub">Sign in or create an account to continue.</div>
            </div>

            {/* 🌙 toggle */}
            <button
              type="button"
              className="themeBtn"
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </button>
          </div>

          <div className="tabs">
            <button
              className={`tab ${tab === "login" ? "tabActive" : ""}`}
              onClick={() => switchTab("login")}
              type="button"
              disabled={loading}
            >
              Login
            </button>
            <button
              className={`tab ${tab === "register" ? "tabActive" : ""}`}
              onClick={() => switchTab("register")}
              type="button"
              disabled={loading}
            >
              Register
            </button>
          </div>

          <div className="socialRow">
            <button className="btn btnSocial" onClick={() => handleProvider("google")} disabled={loading} type="button">
              Continue with Google
            </button>
            <button className="btn btnSocial" onClick={() => handleProvider("github")} disabled={loading} type="button">
              Continue with GitHub
            </button>
          </div>

          <div className="divider">
            <span>or</span>
          </div>

          <MessageBanner type="error" message={error} />
          <MessageBanner type="success" message={success} />

          <form key={tab} onSubmit={handleEmailAuth} className="form" autoComplete="off">
            {tab === "register" && (
              <div className="floatField">
                <input
                  className="floatInput"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder=" "
                  name={`name-${tab}`}
                />
                <label className="floatLabel">Name (optional)</label>
              </div>
            )}

            <div className="floatField">
              <input
                className="floatInput"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                autoComplete="off"
                name={`email-${tab}`}
              />
              <label className="floatLabel">Email</label>
            </div>

            <div className="floatField">
              <input
                className="floatInput"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                type={showPass ? "text" : "password"}
                autoComplete="new-password"
                name={`password-${tab}`}
              />
              <label className="floatLabel">Password</label>

              {/* 👁 show/hide */}
              <button
                type="button"
                className="eyeBtn"
                onClick={() => setShowPass((v) => !v)}
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? "🙈" : "👁"}
              </button>

              {tab === "register" ? (
                <span className={`hint ${password.length >= 6 ? "hintOk" : ""}`}>
                  Must be at least 6 characters.
                </span>
              ) : null}
            </div>

            <button
              className="btn btnPrimary btnFull"
              disabled={loading || (tab === "register" ? !canSubmitRegister : !canSubmitLogin)}
              type="submit"
            >
              {loading ? "Please wait…" : tab === "register" ? "Create account" : "Sign in"}
            </button>
          </form>

          <div className="authFooter">
            {tab === "login" ? (
              <>
                <span className="mutedSmall">New here?</span>{" "}
                <button className="linkBtn" type="button" onClick={() => switchTab("register")} disabled={loading}>
                  Create account
                </button>
              </>
            ) : (
              <>
                <span className="mutedSmall">Already have an account?</span>{" "}
                <button className="linkBtn" type="button" onClick={() => switchTab("login")} disabled={loading}>
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
