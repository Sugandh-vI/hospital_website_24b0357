import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getDoctor } from "../api";

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function DoctorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDoctor(id)
      .then(r => setDoctor(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ paddingTop: "calc(var(--nav-height) + 2rem)", minHeight: "80vh" }}>
      <div className="loading-center"><div className="loading-spinner" /></div>
    </div>
  );

  if (!doctor) return (
    <div style={{ paddingTop: "calc(var(--nav-height) + 2rem)", minHeight: "80vh" }}>
      <div className="container">
        <div className="empty-state">
          <div className="empty-state-icon">👨‍⚕️</div>
          <div className="empty-state-title">Doctor not found</div>
          <Link to="/doctors" className="btn btn-primary" style={{ marginTop: "1rem" }}>Back to Doctors</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ paddingTop: "var(--nav-height)", background: "var(--gray-50)", minHeight: "100vh" }}>
      {/* Hero Banner */}
      <div style={{ background: "linear-gradient(135deg, var(--brand-primary-dark), var(--brand-primary))", padding: "3rem 0 5rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z'/%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="breadcrumb" style={{ marginBottom: "2rem" }}>
            <Link to="/" style={{ color: "rgba(255,255,255,0.6)" }}>Home</Link>
            <span className="breadcrumb-sep">/</span>
            <Link to="/doctors" style={{ color: "rgba(255,255,255,0.6)" }}>Doctors</Link>
            <span className="breadcrumb-sep">/</span>
            <span style={{ color: "rgba(255,255,255,0.9)" }}>{doctor.full_name}</span>
          </div>
          <div style={{ display: "flex", gap: "2.5rem", alignItems: "flex-start", flexWrap: "wrap" }}>
            {/* Photo */}
            <div style={{ flexShrink: 0 }}>
              {doctor.photo_url ? (
                <img
                  src={doctor.photo_url}
                  alt={doctor.full_name}
                  style={{ width: 160, height: 160, objectFit: "cover", objectPosition: "top", borderRadius: "var(--radius-xl)", border: "4px solid rgba(255,255,255,0.2)", boxShadow: "var(--shadow-xl)" }}
                />
              ) : (
                <div style={{ width: 160, height: 160, borderRadius: "var(--radius-xl)", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "5rem", border: "4px solid rgba(255,255,255,0.2)" }}>👨‍⚕️</div>
              )}
            </div>
            {/* Info */}
            <div style={{ flex: 1 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.15)", padding: "0.35rem 1rem", borderRadius: "999px", fontSize: "0.8125rem", fontWeight: 600, color: "rgba(255,255,255,0.9)", marginBottom: "0.875rem" }}>
                {doctor.department_name}
              </div>
              <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.25rem", fontWeight: 700, color: "#fff", marginBottom: "0.375rem" }}>{doctor.full_name}</h1>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.0625rem", marginBottom: "1.25rem" }}>{doctor.specialization}</p>
              <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
                {[
                  { icon: "★", val: `${doctor.rating} (${doctor.total_reviews} reviews)` },
                  { icon: "🕐", val: `${doctor.experience_years} years experience` },
                  { icon: "💰", val: `₹${doctor.consultation_fee} consultation` },
                ].map(m => (
                  <div key={m.val} style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.85)", fontSize: "0.9rem" }}>
                    <span style={{ color: "#fbbf24" }}>{m.icon}</span>
                    {m.val}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ marginTop: "-2.5rem", paddingBottom: "4rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.5rem", alignItems: "start" }}>
          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Qualifications */}
            <div style={{ background: "#fff", borderRadius: "var(--radius-xl)", padding: "2rem", boxShadow: "var(--shadow-card)", border: "1px solid var(--gray-100)" }}>
              <h3 style={{ fontWeight: 700, marginBottom: "1rem", color: "var(--gray-800)" }}>Qualifications</h3>
              <p style={{ color: "var(--gray-600)", lineHeight: 1.7 }}>{doctor.qualification}</p>
            </div>

            {/* Bio */}
            {doctor.bio && (
              <div style={{ background: "#fff", borderRadius: "var(--radius-xl)", padding: "2rem", boxShadow: "var(--shadow-card)", border: "1px solid var(--gray-100)" }}>
                <h3 style={{ fontWeight: 700, marginBottom: "1rem", color: "var(--gray-800)" }}>About Dr. {doctor.first_name}</h3>
                <p style={{ color: "var(--gray-600)", lineHeight: 1.75 }}>{doctor.bio}</p>
              </div>
            )}

            {/* Schedule */}
            {doctor.schedules && doctor.schedules.length > 0 && (
              <div style={{ background: "#fff", borderRadius: "var(--radius-xl)", padding: "2rem", boxShadow: "var(--shadow-card)", border: "1px solid var(--gray-100)" }}>
                <h3 style={{ fontWeight: 700, marginBottom: "1.25rem", color: "var(--gray-800)" }}>Weekly Schedule</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                  {doctor.schedules.map(s => (
                    <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 1rem", background: "var(--gray-50)", borderRadius: "var(--radius-sm)", fontSize: "0.9375rem" }}>
                      <span style={{ fontWeight: 600, color: "var(--gray-700)" }}>{DAY_NAMES[s.day_of_week]}</span>
                      <span style={{ color: "var(--brand-secondary)", fontWeight: 600 }}>
                        {s.start_time.slice(0,5)} – {s.end_time.slice(0,5)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Booking Card */}
            <div style={{ background: "#fff", borderRadius: "var(--radius-xl)", padding: "2rem", boxShadow: "var(--shadow-xl)", border: "1px solid var(--gray-100)" }}>
              <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--gray-500)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1.25rem" }}>Book a Consultation</div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 0", borderBottom: "1px solid var(--gray-100)", marginBottom: "0.5rem" }}>
                <span style={{ color: "var(--gray-500)", fontSize: "0.875rem" }}>Consultation Fee</span>
                <span style={{ fontWeight: 700, color: "var(--brand-primary)", fontSize: "1.25rem" }}>₹{doctor.consultation_fee}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 0", borderBottom: "1px solid var(--gray-100)", marginBottom: "1.25rem" }}>
                <span style={{ color: "var(--gray-500)", fontSize: "0.875rem" }}>Status</span>
                <div className={`badge ${doctor.availability_status === "available" ? "badge-available" : doctor.availability_status === "busy" ? "badge-busy" : "badge-on-leave"}`}>
                  {doctor.availability_status.replace("_", " ")}
                </div>
              </div>
              <button
                className="btn btn-primary"
                style={{ width: "100%", marginBottom: "0.75rem" }}
                disabled={doctor.availability_status === "on_leave"}
                onClick={() => navigate(`/appointments/book?doctor=${doctor.id}`)}
              >
                📅 Book Appointment
              </button>
              {doctor.availability_status === "on_leave" && (
                <p style={{ fontSize: "0.8125rem", color: "var(--gray-500)", textAlign: "center" }}>This doctor is currently on leave.</p>
              )}
            </div>

            {/* Contact Card */}
            {(doctor.phone || doctor.email) && (
              <div style={{ background: "#fff", borderRadius: "var(--radius-xl)", padding: "1.5rem", boxShadow: "var(--shadow-card)", border: "1px solid var(--gray-100)" }}>
                <div style={{ fontWeight: 700, marginBottom: "1rem", color: "var(--gray-800)" }}>Contact Information</div>
                {doctor.phone && (
                  <div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem", fontSize: "0.9rem" }}>
                    <span>📞</span>
                    <a href={`tel:${doctor.phone}`} style={{ color: "var(--brand-primary)" }}>{doctor.phone}</a>
                  </div>
                )}
                {doctor.email && (
                  <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.9rem" }}>
                    <span>✉️</span>
                    <a href={`mailto:${doctor.email}`} style={{ color: "var(--brand-primary)" }}>{doctor.email}</a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
