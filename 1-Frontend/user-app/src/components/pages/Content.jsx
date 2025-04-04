import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle, FaMapMarkedAlt, FaHistory, FaSearchLocation } from "react-icons/fa";

export default function Content() {
  const navigate = useNavigate();
  const navItems = [
    { title: "Report Emergency", path: "emergency/report", Icon: FaExclamationTriangle, color: "#ff4444" },
    { title: "Track Response Status", path: "emergency/status", Icon: FaSearchLocation, color: "#008080" },
    { title: "View Flagged Areas", path: "emergency/flagged-areas", Icon: FaMapMarkedAlt, color: "#FF8C00" },
    { title: "Incident History", path: "emergency/list", Icon: FaHistory, color: "#4169E1" }
  ];

  return (
    
    <div className="mt-2">
      <div className="cards-container d-flex">
        {navItems.map(({ title, path, Icon, color }, index) => (
          <div
            key={index}
            className="cards col-3"
            style={{
              borderLeft: `3px solid ${color}`
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
