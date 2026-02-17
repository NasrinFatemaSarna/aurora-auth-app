import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Navbar() {
  const { user, authLoading } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await signOut(auth);
      navigate("/auth", { replace: true });
    } catch (e) {
      // Keep UI simple; Home has full messaging too.
      console.error(e);
    }
  }

  return (
    <header className="nav">
      <div className="navInner">
        <Link to="/" className="brand">
          <span className="brandMark">✦</span>
          <span className="brandText">AuroraAuth</span>
        </Link>

        <div className="navRight">
          {!authLoading && user ? (
            <div className="navUser">
              <div className="userChip">
                {user.photoURL ? (
                  <img className="userAvatar" src={user.photoURL} alt="User avatar" />
                ) : (
                  <div className="userAvatarFallback">{(user.email || "U")[0].toUpperCase()}</div>
                )}
                <div className="userMeta">
                  <div className="userEmail">{user.email}</div>
                  <div className="userSmall">Signed in</div>
                </div>
              </div>

              <button className="btn btnGhost" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <Link className="btn btnGhost" to="/auth">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
