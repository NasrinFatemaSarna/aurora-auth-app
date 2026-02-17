import React from "react";

export default function MessageBanner({ type = "error", message, onClose }) {
  if (!message) return null;
  return (
    <div className={`banner banner--${type}`}>
      <div className="bannerText">{message}</div>
      {onClose ? (
        <button className="bannerClose" onClick={onClose} aria-label="Close message">
          ✕
        </button>
      ) : null}
    </div>
  );
}
