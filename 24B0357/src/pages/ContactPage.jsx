import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { sendContactMessage } from "../api";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.subject.trim()) e.subject = "Subject is required";
    if (!form.message.trim()) e.message = "Message is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await sendContactMessage(form);
      setSent(true);
      toast.success("Message sent! We'll respond within 24 hours.");
    } catch {
      toast.error("Failed to send. Please try again or call us directly.");
    } finally {
      setSubmitting(false);
    }
  }

  function Field({ name, label, required = false, as: As = "input", ...rest }) {
    return (
      <div className="form-group">
        <label className="form-label">{label}{required && <span className="required">*</span>}</label>
        <As
          className={`form-control${errors[name] ? " error" : ""}`}
          value={form[name]}
          onChange={e => { setForm(f => ({ ...f, [name]: e.target.value })); if (errors[name]) setErrors(er => ({ ...er, [name]: "" })); }}
          {...rest}
        />
        {errors[name] && <span className="form-error">⚠ {errors[name]}</span>}
      </div>
    );
  }

  return (
    <div>
      {/* Page Hero */}
      <div className="page-hero">
        <div className="container">
          <div className="page-hero-content">
            <div className="breadcrumb">
              <Link to="/">Home</Link>
              <span className="breadcrumb-sep">/</span>
              <span>Contact Us</span>
            </div>
            <h1>Get in Touch</h1>
            <p>We're here to help. Reach us for appointments, inquiries, feedback, or emergency assistance — 24 hours a day.</p>
          </div>
        </div>
      </div>

      <section className="section contact-section" id="emergency">
        <div className="container">
          {/* Emergency Banner */}
          <div style={{ background: "linear-gradient(135deg, #dc2626, #b91c1c)", borderRadius: "var(--radius-xl)", padding: "1.75rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2.5rem", boxShadow: "0 8px 24px rgba(220,38,38,0.25)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
              <div style={{ fontSize: "2.5rem" }}>🚨</div>
              <div>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: "1.125rem" }}>Medical Emergency?</div>
                <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.9rem" }}>Our Emergency Department is open 24 hours, 7 days a week</div>
              </div>
            </div>
            <a href="tel:+911800123456" style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(255,255,255,0.15)", padding: "0.875rem 1.75rem", borderRadius: "var(--radius-md)", color: "#fff", border: "2px solid rgba(255,255,255,0.3)", textDecoration: "none", transition: "all var(--transition-fast)" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
            >
              <span style={{ fontSize: "0.75rem", letterSpacing: "0.1em", opacity: 0.8, textTransform: "uppercase", fontWeight: 700 }}>Emergency Hotline</span>
              <span style={{ fontSize: "1.625rem", fontWeight: 800, letterSpacing: "0.05em" }}>1800-123-456</span>
              <span style={{ fontSize: "0.75rem", opacity: 0.75 }}>Free · Available 24/7</span>
            </a>
          </div>

          <div className="contact-grid">
            {/* Contact Info */}
            <div className="contact-info-card">
              <h2 className="contact-info-title">Hospital Information</h2>
              <p className="contact-info-sub">Reach us through any of the following channels. Our team responds within 24 hours for non-urgent queries.</p>

              {[
                { icon: "📍", label: "Address", value: "12, Medical Colony Road, Sector 7\nNew Delhi, Delhi — 110001" },
                { icon: "📞", label: "General Enquiry", value: "+91-11-4567-8900\n+91-11-4567-8901" },
                { icon: "🚨", label: "Emergency (24/7)", value: "1800-123-456 (Toll Free)" },
                { icon: "✉️", label: "Email", value: "info@healthmatecentral.com" },
                { icon: "🕐", label: "OPD Hours", value: "Mon – Sat: 8:00 AM – 8:00 PM\nSunday: 9:00 AM – 2:00 PM" },
              ].map(d => (
                <div key={d.label} className="contact-detail">
                  <div className="contact-detail-icon">{d.icon}</div>
                  <div>
                    <div className="contact-detail-label">{d.label}</div>
                    <div className="contact-detail-value" style={{ whiteSpace: "pre-line" }}>{d.value}</div>
                  </div>
                </div>
              ))}

              {/* Quick Links */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "1.5rem", marginTop: "1rem" }}>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>Quick Actions</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                  <Link to="/appointments/book" style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "rgba(255,255,255,0.85)", padding: "0.75rem", background: "rgba(255,255,255,0.1)", borderRadius: "var(--radius-sm)", textDecoration: "none", fontSize: "0.9375rem", fontWeight: 600, transition: "all var(--transition-fast)" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                  >
                    📅 Book an Appointment
                  </Link>
                  <Link to="/doctors" style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "rgba(255,255,255,0.85)", padding: "0.75rem", background: "rgba(255,255,255,0.1)", borderRadius: "var(--radius-sm)", textDecoration: "none", fontSize: "0.9375rem", fontWeight: 600, transition: "all var(--transition-fast)" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                  >
                    👨‍⚕️ Find a Doctor
                  </Link>
                  <Link to="/appointments/track" style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "rgba(255,255,255,0.85)", padding: "0.75rem", background: "rgba(255,255,255,0.1)", borderRadius: "var(--radius-sm)", textDecoration: "none", fontSize: "0.9375rem", fontWeight: 600, transition: "all var(--transition-fast)" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                  >
                    🔍 Track My Appointment
                  </Link>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-card">
              {sent ? (
                <div style={{ textAlign: "center", padding: "2rem" }}>
                  <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>✅</div>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", fontWeight: 700, color: "var(--gray-800)", marginBottom: "0.75rem" }}>Message Received!</h3>
                  <p style={{ color: "var(--gray-500)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
                    Thank you for reaching out to HealthMate Central. Our team will respond to your message within 24 hours on business days.
                  </p>
                  <button className="btn btn-outline" onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.375rem", fontWeight: 700, color: "var(--gray-800)", marginBottom: "0.375rem" }}>Send Us a Message</h3>
                  <p style={{ color: "var(--gray-500)", fontSize: "0.9rem", marginBottom: "2rem" }}>Fill out the form and we'll get back to you within 24 hours.</p>

                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <div className="form-grid-2">
                      <Field name="name" label="Full Name" required placeholder="Your full name" />
                      <Field name="email" label="Email Address" required type="email" placeholder="your@email.com" />
                    </div>
                    <div className="form-grid-2">
                      <Field name="phone" label="Phone Number" placeholder="+91 98765 43210" />
                      <Field name="subject" label="Subject" required placeholder="What is this regarding?" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Message<span className="required">*</span></label>
                      <textarea
                        className={`form-control${errors.message ? " error" : ""}`}
                        placeholder="Describe your inquiry in detail..."
                        style={{ minHeight: 150 }}
                        value={form.message}
                        onChange={e => { setForm(f => ({ ...f, message: e.target.value })); if (errors.message) setErrors(er => ({ ...er, message: "" })); }}
                      />
                      {errors.message && <span className="form-error">⚠ {errors.message}</span>}
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg" disabled={submitting} style={{ alignSelf: "flex-start" }}>
                      {submitting ? "Sending..." : "📨 Send Message"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* Map placeholder */}
          <div style={{ marginTop: "3rem", borderRadius: "var(--radius-xl)", overflow: "hidden", height: "320px", background: "linear-gradient(135deg, var(--gray-100), var(--gray-200))", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem", border: "1px solid var(--gray-200)" }}>
            <div style={{ fontSize: "3rem" }}>🗺️</div>
            <div style={{ fontWeight: 700, color: "var(--gray-600)", fontSize: "1.0625rem" }}>Interactive Map</div>
            <p style={{ color: "var(--gray-400)", fontSize: "0.875rem", textAlign: "center" }}>
              12, Medical Colony Road, Sector 7, New Delhi — 110001<br />
              Embed Google Maps here by adding your Maps API key to the frontend .env
            </p>
          </div>

          {/* Departments Contact */}
          <div style={{ marginTop: "3rem" }}>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", fontWeight: 700, color: "var(--gray-800)", marginBottom: "1.5rem", textAlign: "center" }}>Department Direct Lines</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
              {[
                { dept: "❤️ Cardiology", number: "+91-11-4567-8910" },
                { dept: "🧠 Neurology", number: "+91-11-4567-8911" },
                { dept: "🦴 Orthopedics", number: "+91-11-4567-8912" },
                { dept: "👶 Pediatrics", number: "+91-11-4567-8913" },
                { dept: "🎗️ Oncology", number: "+91-11-4567-8914" },
                { dept: "🔬 Gastroenterology", number: "+91-11-4567-8915" },
              ].map(d => (
                <a key={d.dept} href={`tel:${d.number.replace(/[^+\d]/g, "")}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", borderRadius: "var(--radius-md)", padding: "1rem 1.25rem", boxShadow: "var(--shadow-card)", border: "1px solid var(--gray-100)", textDecoration: "none", transition: "all var(--transition-fast)" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "var(--shadow-card)"; }}
                >
                  <span style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--gray-700)" }}>{d.dept}</span>
                  <span style={{ fontSize: "0.875rem", color: "var(--brand-primary)", fontWeight: 600 }}>{d.number}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
