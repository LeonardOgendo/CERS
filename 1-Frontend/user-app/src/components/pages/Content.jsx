import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle, FaMapMarkedAlt, FaHistory, FaSearchLocation } from "react-icons/fa";

export default function Content() {
  const navigate = useNavigate();
  const navItems = [
    { title: "Report Emergency", path: "emergency/report", Icon: FaExclamationTriangle, color: "#ff4444" },
    { title: "Track Response Status", path: "emergency/status", Icon: FaSearchLocation, color: "#4285f4" },
    { title: "View Flagged Areas", path: "emergency/flagged-areas", Icon: FaMapMarkedAlt, color: "#ffbb33" },
    { title: "Incident History", path: "emergency/list", Icon: FaHistory, color: "#aa66cc" }
  ];

  return (
    <div style={{ padding: "1rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1rem",
        alignItems: "stretch"
      }}>
        {navItems.map(({ title, path, Icon, color }, index) => (
          <div
            key={index}
            style={{
              background: "white",
              borderRadius: "8px",
              padding: "1rem",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              cursor: "pointer",
              borderLeft: `4px solid ${color}`,
              transition: "all 0.2s ease",
              display: "flex",
              flexDirection: "column",
              height: "100%"
            }}
            onClick={() => navigate(path)}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
            }}
          >
            <div style={{
              color,
              fontSize: "1.25rem",
              marginBottom: "0.75rem",
              display: "flex",
              justifyContent: "center"
            }}>
              <Icon />
            </div>
            <h3 style={{
              color: "#333",
              margin: "0 0 0.5rem 0",
              fontWeight: "600",
              fontSize: "1rem",
              textAlign: "center",
              flexGrow: 1
            }}>
              {title}
            </h3>
            <div style={{
              color: "#666",
              fontSize: "0.75rem",
              textAlign: "center",
              marginTop: "auto"
            }}>
              Click to view
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}