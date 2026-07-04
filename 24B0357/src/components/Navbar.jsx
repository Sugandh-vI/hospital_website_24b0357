import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { path: "/", label: "Home" },
  { path: "/departments", label: "Departments" },
  { path: "/doctors", label: "Our Doctors" },
  { path: "/appointments/book", label: "Book Appointment" },
  { path: "/blog", label: "Health Blog" },
  { path: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <div className="container">
          <div className="navbar-inner">
            <Link to="/" className="navbar-logo" onClick={() => setMobileOpen(false)}>
              <div className="navbar-logo-icon">✚</div>
              <div>
                <span>HealthMate Central</span>
                <small>Multispeciality Hospital</small>
              </div>
            </Link>

            <ul className="nav-links">
              {NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => isActive ? "active" : ""}
                    end={item.path === "/"}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="navbar-actions">
              <a href="tel:+911800123456" className="nav-emergency">
                🚨 Emergency
              </a>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate("/appointments/book")}
              >
                Book Now
              </button>
              <button
                className="hamburger"
                onClick={() => setMobileOpen((o) => !o)}
                aria-label="Toggle menu"
              >
                <span style={mobileOpen ? { transform: "rotate(45deg) translate(5px, 5px)" } : {}} />
                <span style={mobileOpen ? { opacity: 0 } : {}} />
                <span style={mobileOpen ? { transform: "rotate(-45deg) translate(5px, -5px)" } : {}} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu${mobileOpen ? " open" : ""}`}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            end={item.path === "/"}
          >
            {item.label}
          </NavLink>
        ))}
        <div className="mobile-menu-divider" />
        <a
          href="tel:+911800123456"
          style={{ color: "#f87171" }}
          onClick={() => setMobileOpen(false)}
        >
          🚨 Emergency: 1800-123-456
        </a>
        <button
          className="btn btn-accent btn-lg"
          style={{ marginTop: "1rem" }}
          onClick={() => { navigate("/appointments/book"); setMobileOpen(false); }}
        >
          Book Appointment
        </button>
      </div>
    </>
  );
}
