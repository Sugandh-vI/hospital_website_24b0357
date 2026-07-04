import { Link } from "react-router-dom";

const FOOTER_LINKS = {
  "Quick Links": [
    { label: "Home", path: "/" },
    { label: "Our Departments", path: "/departments" },
    { label: "Find a Doctor", path: "/doctors" },
    { label: "Book Appointment", path: "/appointments/book" },
    { label: "Track Appointment", path: "/appointments/track" },
  ],
  "Departments": [
    { label: "Cardiology", path: "/departments" },
    { label: "Neurology", path: "/departments" },
    { label: "Orthopedics", path: "/departments" },
    { label: "Pediatrics", path: "/departments" },
    { label: "Oncology", path: "/departments" },
  ],
  "Information": [
    { label: "Health Blog", path: "/blog" },
    { label: "Contact Us", path: "/contact" },
    { label: "Emergency Care", path: "/contact#emergency" },
  ],
};

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <div className="footer-logo-icon">✚</div>
              <div>
                <div>HealthMate Central</div>
                <div style={{ fontSize: "0.625rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", fontWeight: 400 }}>MULTISPECIALITY HOSPITAL</div>
              </div>
            </Link>
            <p className="footer-tagline">
              Dedicated to exceptional healthcare since 1999. Combining advanced medical technology with compassionate, patient-centered care across 8+ specialties.
            </p>
            <div className="footer-socials">
              {["f", "in", "t", "yt"].map((s) => (
                <a key={s} href="#" className="footer-social-btn">{s}</a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="footer-col-title">{title}</h4>
              <ul className="footer-links">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.path}>→ {l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} HealthMate Central Hospital. All rights reserved.</span>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <a href="#" style={{ color: "rgba(255,255,255,0.4)" }}>Privacy Policy</a>
            <a href="#" style={{ color: "rgba(255,255,255,0.4)" }}>Terms of Service</a>
            <a href="#" style={{ color: "rgba(255,255,255,0.4)" }}>HIPAA Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
