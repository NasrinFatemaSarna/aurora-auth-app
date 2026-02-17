import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

export default function ProtectedRoute({ children }) {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="gate">
        <div className="gateCard">
          <Spinner />
          <div className="gateTitle">Checking your session…</div>
          <div className="gateSub">Please wait a moment.</div>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  return children;
}
