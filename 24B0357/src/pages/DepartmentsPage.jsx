import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getDepartments, getDoctors } from "../api";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    Promise.all([getDepartments(), getDoctors()])
      .then(([dRes, drRes]) => {
        const depts = dRes.data.results || dRes.data;
        const docs = drRes.data.results || drRes.data;
        setDepartments(depts);
        setDoctors(docs);
        // Check for filter from homepage
        if (location.state?.filter) {
          setSelected(location.state.filter);
        } else {
          setSelected(depts[0]?.id || null);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeDept = departments.find(d => d.id === selected);
  const deptDoctors = doctors.filter(d => d.department === selected);

  return (
    <div>
      {/* Page Hero */}
      <div className="page-hero">
        <div className="container">
          <div className="page-hero-content">
            <div className="breadcrumb">
              <Link to="/">Home</Link>
              <span className="breadcrumb-sep">/</span>
              <span>Departments</span>
            </div>
            <h1>Our Medical Departments</h1>
            <p>Expert care across 8+ specialties — each with dedicated teams, advanced equipment, and patient-first focus.</p>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {loading ? (
            <div className="loading-center"><div className="loading-spinner" /></div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "2rem", alignItems: "start" }}>
              {/* Sidebar */}
              <div style={{ position: "sticky", top: "calc(var(--nav-height) + 1rem)" }}>
                <div style={{ background: "#fff", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-card)", border: "1px solid var(--gray-100)", overflow: "hidden" }}>
                  <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--gray-100)", fontWeight: 700, color: "var(--gray-700)", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    All Specialties
                  </div>
                  {departments.map(dept => (
                    <button
                      key={dept.id}
                      onClick={() => setSelected(dept.id)}
                      style={{
                        width: "100%", textAlign: "left", padding: "1rem 1.5rem",
                        display: "flex", alignItems: "center", gap: "0.875rem",
                        background: selected === dept.id ? "rgba(15, 76, 129, 0.06)" : "transparent",
                        borderLeft: selected === dept.id ? "3px solid var(--brand-primary)" : "3px solid transparent",
                        fontWeight: selected === dept.id ? 600 : 400,
                        color: selected === dept.id ? "var(--brand-primary)" : "var(--gray-600)",
                        transition: "all var(--transition-fast)",
                        borderTop: "none", borderRight: "none", borderBottom: "1px solid var(--gray-100)",
                        cursor: "pointer", fontSize: "0.9375rem",
                      }}
                    >
                      <span style={{ fontSize: "1.375rem" }}>{dept.icon}</span>
                      <span>{dept.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Content */}
              <div>
                {activeDept && (
                  <>
                    {/* Dept Header */}
                    <div style={{ background: "linear-gradient(135deg, var(--brand-primary-dark), var(--brand-primary))", borderRadius: "var(--radius-xl)", padding: "2.5rem", color: "#fff", marginBottom: "2rem" }}>
                      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{activeDept.icon}</div>
                      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 700, marginBottom: "0.75rem" }}>{activeDept.name}</h2>
                      <p style={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.75, fontSize: "1rem", maxWidth: "600px", marginBottom: "1.5rem" }}>{activeDept.description}</p>
                      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                        <span style={{ background: "rgba(255,255,255,0.15)", padding: "0.4rem 1rem", borderRadius: "999px", fontSize: "0.875rem", fontWeight: 600 }}>
                          👨‍⚕️ {activeDept.doctor_count} Specialists
                        </span>
                        <span style={{ background: "rgba(255,255,255,0.15)", padding: "0.4rem 1rem", borderRadius: "999px", fontSize: "0.875rem", fontWeight: 600 }}>
                          ✅ NABH Accredited
                        </span>
                        <span style={{ background: "rgba(255,255,255,0.15)", padding: "0.4rem 1rem", borderRadius: "999px", fontSize: "0.875rem", fontWeight: 600 }}>
                          🕐 Mon – Sat
                        </span>
                      </div>
                    </div>

                    {/* Doctors in this dept */}
                    <div>
                      <h3 style={{ fontWeight: 700, fontSize: "1.25rem", color: "var(--gray-800)", marginBottom: "1.5rem" }}>
                        Doctors in {activeDept.name}
                      </h3>
                      {deptDoctors.length === 0 ? (
                        <div className="empty-state">
                          <div className="empty-state-icon">👨‍⚕️</div>
                          <div className="empty-state-title">No doctors listed yet</div>
                          <p className="empty-state-text">Doctors for this department will appear once the database is seeded.</p>
                        </div>
                      ) : (
                        <div className="doctor-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))" }}>
                          {deptDoctors.map(doc => (
                            <div key={doc.id} className="doctor-card">
                              {doc.photo_url ? (
                                <img src={doc.photo_url} alt={doc.full_name} className="doctor-card-photo" loading="lazy" />
                              ) : (
                                <div className="doctor-card-photo-placeholder">👨‍⚕️</div>
                              )}
                              <div className="doctor-card-body">
                                <div className="doctor-card-dept">{doc.specialization}</div>
                                <div className="doctor-card-name">{doc.full_name}</div>
                                <div className="doctor-card-spec">{doc.qualification}</div>
                                <div className="doctor-card-meta">
                                  <div className="doctor-rating">
                                    <span className="star-filled">★</span>
                                    {doc.rating}
                                    <span style={{ color: "var(--gray-400)", fontWeight: 400 }}>({doc.total_reviews})</span>
                                  </div>
                                  <div className={`badge ${doc.availability_status === "available" ? "badge-available" : doc.availability_status === "busy" ? "badge-busy" : "badge-on-leave"}`}>
                                    {doc.availability_status}
                                  </div>
                                </div>
                                <div className="doctor-card-actions">
                                  <Link to={`/doctors/${doc.id}`} className="btn btn-outline btn-sm">Profile</Link>
                                  <Link to={`/appointments/book?doctor=${doc.id}`} className="btn btn-primary btn-sm">Book</Link>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
