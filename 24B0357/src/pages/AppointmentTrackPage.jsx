import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getAppointment, cancelAppointment } from "../api";

export default function AppointmentTrackPage() {
  const [refInput, setRefInput] = useState("");
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [notFound, setNotFound] = useState(false);

  async function handleLookup(e) {
    e.preventDefault();
    const ref = refInput.trim().toUpperCase();
    if (!ref) { toast.error("Please enter a booking reference"); return; }
    setLoading(true);
    setAppointment(null);
    setNotFound(false);
    try {
      const res = await getAppointment(ref);
      setAppointment(res.data);
    } catch (err) {
      if (err.response?.status === 404) setNotFound(true);
      else toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    if (!appointment) return;
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    setCancelling(true);
    try {
      await cancelAppointment(appointment.booking_reference);
      setAppointment(a => ({ ...a, status: "cancelled" }));
      toast.success("Appointment cancelled successfully.");
    } catch (err) {
      toast.error(err.response?.data?.error || "Could not cancel appointment.");
    } finally {
      setCancelling(false);
    }
  }

  const statusClass = {
    pending: "status-pending",
    confirmed: "status-confirmed",
    completed: "status-completed",
    cancelled: "status-cancelled",
  };

  return (
    <div className="lookup-page">
      <div className="container">
        {/* Page header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <span className="section-label">Appointment Tracker</span>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.25rem", fontWeight: 700, color: "var(--gray-900)", marginBottom: "0.75rem" }}>
            Track Your Appointment
          </h1>
          <p style={{ color: "var(--gray-500)", fontSize: "1rem" }}>
            Enter your booking reference number to view your appointment status or cancel if needed.
          </p>
        </div>

        {/* Lookup Form */}
        <div className="lookup-card" style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", gap: "1rem" }}>
            <div style={{ background: "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))", width: 56, height: 56, borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.75rem", flexShrink: 0 }}>
              🔍
            </div>
            <div>
              <h2 style={{ fontWeight: 700, fontSize: "1.125rem", color: "var(--gray-800)" }}>Find Your Appointment</h2>
              <p style={{ fontSize: "0.875rem", color: "var(--gray-500)" }}>Your reference starts with "HMC" followed by 8 characters</p>
            </div>
          </div>

          <form onSubmit={handleLookup} style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <input
              type="text"
              className="form-control"
              style={{ flex: 1, minWidth: "200px", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "monospace", fontSize: "1rem" }}
              placeholder="e.g. HMCAB12CD34"
              value={refInput}
              onChange={e => setRefInput(e.target.value.toUpperCase())}
              maxLength={11}
            />
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flexShrink: 0 }}>
              {loading ? "Searching..." : "Track Appointment"}
            </button>
          </form>

          {notFound && (
            <div style={{ marginTop: "1rem", padding: "1rem", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "var(--radius-md)", color: "var(--error)", fontSize: "0.9rem" }}>
              ⚠️ No appointment found with reference "{refInput}". Double-check your booking reference.
            </div>
          )}
        </div>

        {/* Result */}
        {appointment && (
          <div className="lookup-card">
            {/* Status header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--gray-500)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Booking Reference</div>
                <div style={{ fontFamily: "monospace", fontSize: "1.375rem", fontWeight: 800, color: "var(--brand-primary)", letterSpacing: "0.1em" }}>{appointment.booking_reference}</div>
              </div>
              <div className={`status-pill ${statusClass[appointment.status]}`}>
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </div>
            </div>

            {/* Details */}
            {[
              { label: "Doctor", value: appointment.doctor_name },
              { label: "Specialization", value: appointment.doctor_specialization },
              { label: "Department", value: appointment.doctor_department },
              { label: "Appointment Date", value: appointment.appointment_date ? new Date(appointment.appointment_date + "T12:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "" },
              { label: "Time", value: appointment.appointment_time?.slice(0, 5) },
              { label: "Type", value: appointment.appointment_type?.replace("_", " ") },
              { label: "Patient Name", value: appointment.patient_name },
              { label: "Patient Email", value: appointment.patient_email },
              { label: "Patient Phone", value: appointment.patient_phone },
            ].map(row => (
              <div key={row.label} className="appointment-detail-row">
                <span className="appointment-detail-label">{row.label}</span>
                <span className="appointment-detail-value">{row.value || "—"}</span>
              </div>
            ))}

            {/* Actions */}
            <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
              {!["completed", "cancelled"].includes(appointment.status) && (
                <button
                  className="btn btn-outline"
                  style={{ borderColor: "var(--error)", color: "var(--error)" }}
                  onClick={handleCancel}
                  disabled={cancelling}
                >
                  {cancelling ? "Cancelling..." : "❌ Cancel Appointment"}
                </button>
              )}
              <Link to="/appointments/book" className="btn btn-primary">
                📅 Book New Appointment
              </Link>
            </div>

            {appointment.status === "cancelled" && (
              <div style={{ marginTop: "1rem", padding: "1rem", background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "var(--radius-md)", color: "var(--gray-600)", fontSize: "0.875rem", textAlign: "center" }}>
                This appointment has been cancelled. You're welcome to book a new one.
              </div>
            )}
          </div>
        )}

        {/* Info */}
        <div style={{ marginTop: "2rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
          {[
            { icon: "🔍", title: "Can't find it?", text: "Check your email for the booking confirmation sent when you made the appointment." },
            { icon: "❌", title: "Want to cancel?", text: "You can cancel any pending or confirmed appointment directly from this page." },
            { icon: "📅", title: "Need another?", text: "Use the Book Appointment page to schedule with any of our specialists." },
          ].map(tip => (
            <div key={tip.title} style={{ background: "#fff", borderRadius: "var(--radius-lg)", padding: "1.5rem", boxShadow: "var(--shadow-card)", border: "1px solid var(--gray-100)" }}>
              <div style={{ fontSize: "1.75rem", marginBottom: "0.625rem" }}>{tip.icon}</div>
              <div style={{ fontWeight: 700, marginBottom: "0.375rem", fontSize: "0.9375rem" }}>{tip.title}</div>
              <p style={{ fontSize: "0.8125rem", color: "var(--gray-500)", lineHeight: 1.6 }}>{tip.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
