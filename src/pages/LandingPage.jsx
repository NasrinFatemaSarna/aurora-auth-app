import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LandingPage() {
  const { user, authLoading } = useAuth();

  return (
    <main className="page">
      <div className="container">
        <div className="hero">
          <div>
            <h1 className="h1">Secure sign-in for your React app.</h1>
            <p className="p">
              AuroraAuth provides Email/Password login + Google/GitHub OAuth, persistent sessions, and protected routes—
              powered by Firebase Authentication.
            </p>

            <div className="row">
              {authLoading ? (
                <span className="muted">Checking session…</span>
              ) : user ? (
                <Link className="btn btnPrimary" to="/home">
                  Continue to Home
                </Link>
              ) : (
                <>
                  <Link className="btn btnPrimary" to="/auth">
                    Sign in
                  </Link>
                  <Link className="btn btnGhost" to="/auth">
                    Create account
                  </Link>
                </>
              )}
            </div>

            <div className="miniList">
              <div className="miniItem">✓ Social login via Google & GitHub</div>
              <div className="miniItem">✓ Protected routes & session persistence</div>
              <div className="miniItem">✓ No custom backend required</div>
            </div>
          </div>

          <div className="heroCard">
            <div className="heroCardTitle">Quick demo flow</div>
            <ol className="steps">
              <li>Go to Auth</li>
              <li>Register or Sign in</li>
              <li>Land on Home</li>
              <li>Refresh to test persistence</li>
            </ol>
          </div>
        </div>
      </div>
    </main>
  );
}
