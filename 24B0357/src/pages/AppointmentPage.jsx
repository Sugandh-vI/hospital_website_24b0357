import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getDoctors, getDepartments, getAvailableSlots, createAppointment } from "../api";

/* Generate time slots from 8am to 6pm, 30-min intervals */
const ALL_SLOTS = (() => {
  const slots = [];
  for (let h = 8; h < 18; h++) {
    for (let m of [0, 30]) {
      const hh = h.toString().padStart(2, "0");
      const mm = m.toString().padStart(2, "0");
      slots.push(`${hh}:${mm}`);
    }
  }
  return slots;
})();

/* Min date = today */
const TODAY = new Date().toISOString().split("T")[0];

const STEPS = ["Choose Doctor", "Your Details", "Confirm"];

export default function AppointmentPage() {
  const [step, setStep] = useState(1);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Step 1
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [deptFilter, setDeptFilter] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [apptType, setApptType] = useState("in_person");

  // Step 2
  const [form, setForm] = useState({
    patient_name: "", patient_email: "", patient_phone: "",
    patient_age: "", patient_gender: "", symptoms: "", notes: "",
  });
  const [errors, setErrors] = useState({});

  // Step 3 - Success
  const [booking, setBooking] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([getDoctors(), getDepartments()]).then(([dr, dep]) => {
      const docs = dr.data.results || dr.data;
      const depts = dep.data.results || dep.data;
      setDoctors(docs);
      setDepartments(depts);
      const preselected = searchParams.get("doctor");
      if (preselected) {
        const doc = docs.find(d => d.id === parseInt(preselected));
        if (doc) setSelectedDoctor(doc);
      }
    }).catch(() => {});
  }, []);

  // Fetch booked slots when doctor + date changes
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      setSlotsLoading(true);
      getAvailableSlots(selectedDoctor.id, selectedDate)
        .then(r => setBookedSlots(r.data.booked_slots || []))
        .catch(() => setBookedSlots([]))
        .finally(() => setSlotsLoading(false));
    }
  }, [selectedDoctor, selectedDate]);

  const filteredDoctors = deptFilter
    ? doctors.filter(d => d.department === parseInt(deptFilter))
    : doctors;

  function validateStep2() {
    const errs = {};
    if (!form.patient_name.trim()) errs.patient_name = "Full name is required";
    if (!form.patient_email.trim()) errs.patient_email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.patient_email)) errs.patient_email = "Invalid email";
    if (!form.patient_phone.trim()) errs.patient_phone = "Phone number is required";
    if (!form.patient_age || form.patient_age < 1) errs.patient_age = "Valid age is required";
    if (!form.patient_gender) errs.patient_gender = "Gender is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const payload = {
        doctor: selectedDoctor.id,
        appointment_date: selectedDate,
        appointment_time: selectedTime + ":00",
        appointment_type: apptType,
        ...form,
        patient_age: parseInt(form.patient_age),
      };
      const res = await createAppointment(payload);
      setBooking(res.data);
      setStep(3);
      toast.success("Appointment booked successfully!");
    } catch (err) {
      const msg = err.response?.data?.non_field_errors?.[0] || "Failed to book. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  function InputField({ name, label, type = "text", required = false, ...rest }) {
    return (
      <div className="form-group">
        <label className="form-label">{label}{required && <span className="required">*</span>}</label>
        <input
          type={type}
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
    <div className="appointment-page">
      <div className="container">
        <div className="appointment-container">
          <div style={{ marginBottom: "1.5rem" }}>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 700, color: "var(--gray-900)" }}>Book an Appointment</h1>
            <p style={{ color: "var(--gray-500)", marginTop: "0.375rem" }}>Complete the steps below to schedule your visit</p>
          </div>

          {/* Step Indicator */}
          <div className="step-indicator">
            {STEPS.map((label, i) => (
              <div key={label} className={`step${step > i + 1 ? " done" : ""}${step === i + 1 ? " active" : ""}`}>
                <div className="step-num">
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <div className="step-label">{label}</div>
              </div>
            ))}
          </div>

          {/* ===== STEP 1 ===== */}
          {step === 1 && (
            <div className="appointment-form-card">
              <h2 style={{ fontWeight: 700, marginBottom: "1.5rem", color: "var(--gray-800)", fontSize: "1.25rem" }}>Select Doctor & Schedule</h2>

              {/* Dept filter */}
              <div className="form-group" style={{ marginBottom: "1.25rem" }}>
                <label className="form-label">Filter by Department</label>
                <select className="form-control" value={deptFilter} onChange={e => { setDeptFilter(e.target.value); setSelectedDoctor(null); }}>
                  <option value="">All Departments</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.icon} {d.name}</option>)}
                </select>
              </div>

              {/* Doctor Selection */}
              <div className="form-group" style={{ marginBottom: "1.25rem" }}>
                <label className="form-label">Choose Doctor<span className="required">*</span></label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "0.875rem", maxHeight: "360px", overflowY: "auto", padding: "4px" }}>
                  {filteredDoctors.map(doc => (
                    <button
                      key={doc.id}
                      onClick={() => { setSelectedDoctor(doc); setSelectedTime(""); }}
                      style={{
                        display: "flex", alignItems: "center", gap: "0.875rem",
                        padding: "0.875rem 1rem",
                        border: selectedDoctor?.id === doc.id ? "2px solid var(--brand-primary)" : "1.5px solid var(--gray-200)",
                        borderRadius: "var(--radius-md)",
                        background: selectedDoctor?.id === doc.id ? "rgba(15,76,129,0.04)" : "#fff",
                        cursor: "pointer",
                        textAlign: "left", transition: "all var(--transition-fast)",
                        opacity: doc.availability_status === "on_leave" ? 0.5 : 1,
                      }}
                      disabled={doc.availability_status === "on_leave"}
                    >
                      {doc.photo_url ? (
                        <img src={doc.photo_url} alt="" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--gray-100)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>👨‍⚕️</div>
                      )}
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--gray-800)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{doc.full_name}</div>
                        <div style={{ fontSize: "0.8125rem", color: "var(--gray-500)", marginTop: "2px" }}>{doc.specialization}</div>
                        <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--brand-primary)", marginTop: "2px" }}>₹{doc.consultation_fee}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedDoctor && (
                <>
                  {/* Date + Type */}
                  <div className="form-grid-2" style={{ marginBottom: "1.25rem" }}>
                    <div className="form-group">
                      <label className="form-label">Appointment Date<span className="required">*</span></label>
                      <input type="date" className="form-control" min={TODAY} value={selectedDate} onChange={e => { setSelectedDate(e.target.value); setSelectedTime(""); }} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Appointment Type</label>
                      <select className="form-control" value={apptType} onChange={e => setApptType(e.target.value)}>
                        <option value="in_person">🏥 In Person</option>
                        <option value="video">📹 Video Consultation</option>
                        <option value="phone">📞 Phone Consultation</option>
                      </select>
                    </div>
                  </div>

                  {/* Time Slots */}
                  {selectedDate && (
                    <div className="form-group">
                      <label className="form-label">Select Time Slot<span className="required">*</span></label>
                      {slotsLoading ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--gray-500)", padding: "1rem 0" }}>
                          <div className="loading-spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                          Loading slots...
                        </div>
                      ) : (
                        <div className="time-slots-grid">
                          {ALL_SLOTS.map(slot => {
                            const isBooked = bookedSlots.includes(slot);
                            return (
                              <button
                                key={slot}
                                className={`time-slot${isBooked ? " booked" : ""}${selectedTime === slot ? " selected" : ""}`}
                                disabled={isBooked}
                                onClick={() => setSelectedTime(slot)}
                              >
                                {slot}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2rem" }}>
                <button
                  className="btn btn-primary btn-lg"
                  disabled={!selectedDoctor || !selectedDate || !selectedTime}
                  onClick={() => setStep(2)}
                >
                  Next: Your Details →
                </button>
              </div>
            </div>
          )}

          {/* ===== STEP 2 ===== */}
          {step === 2 && (
            <div className="appointment-form-card">
              {/* Appointment summary */}
              <div style={{ background: "rgba(15,76,129,0.04)", border: "1.5px solid rgba(15,76,129,0.12)", borderRadius: "var(--radius-md)", padding: "1.25rem", marginBottom: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--gray-500)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>Appointment With</div>
                  <div style={{ fontWeight: 700, color: "var(--gray-800)" }}>{selectedDoctor?.full_name}</div>
                  <div style={{ fontSize: "0.875rem", color: "var(--gray-500)" }}>{selectedDoctor?.specialization}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--gray-500)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>Date & Time</div>
                  <div style={{ fontWeight: 700, color: "var(--gray-800)" }}>{new Date(selectedDate + "T12:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</div>
                  <div style={{ fontSize: "0.875rem", color: "var(--gray-500)" }}>{selectedTime} · {apptType.replace("_", " ")}</div>
                </div>
              </div>

              <h2 style={{ fontWeight: 700, marginBottom: "1.5rem", color: "var(--gray-800)", fontSize: "1.25rem" }}>Patient Information</h2>

              <div className="form-grid-2" style={{ marginBottom: "1.25rem" }}>
                <InputField name="patient_name" label="Full Name" required placeholder="Your full name" />
                <InputField name="patient_email" label="Email Address" type="email" required placeholder="your@email.com" />
              </div>
              <div className="form-grid-3" style={{ marginBottom: "1.25rem" }}>
                <InputField name="patient_phone" label="Phone Number" required placeholder="+91 98765 43210" />
                <InputField name="patient_age" label="Age" type="number" required placeholder="25" min="1" max="120" />
                <div className="form-group">
                  <label className="form-label">Gender<span className="required">*</span></label>
                  <select className={`form-control${errors.patient_gender ? " error" : ""}`} value={form.patient_gender} onChange={e => { setForm(f => ({ ...f, patient_gender: e.target.value })); if (errors.patient_gender) setErrors(er => ({ ...er, patient_gender: "" })); }}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.patient_gender && <span className="form-error">⚠ {errors.patient_gender}</span>}
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: "1.25rem" }}>
                <label className="form-label">Symptoms / Reason for Visit</label>
                <textarea
                  className="form-control"
                  placeholder="Briefly describe your symptoms or the reason for this appointment..."
                  value={form.symptoms}
                  onChange={e => setForm(f => ({ ...f, symptoms: e.target.value }))}
                />
              </div>
              <div className="form-group" style={{ marginBottom: "2rem" }}>
                <label className="form-label">Additional Notes</label>
                <textarea
                  className="form-control"
                  style={{ minHeight: 80 }}
                  placeholder="Any allergies, previous conditions, or other notes for the doctor..."
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => { if (validateStep2()) handleSubmit(); }}
                  disabled={submitting}
                >
                  {submitting ? "Booking..." : "✅ Confirm Appointment"}
                </button>
              </div>
            </div>
          )}

          {/* ===== STEP 3 - SUCCESS ===== */}
          {step === 3 && booking && (
            <div className="appointment-form-card">
              <div className="booking-success">
                <div className="booking-success-icon">✓</div>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.875rem", fontWeight: 700, color: "var(--gray-900)", marginBottom: "0.75rem" }}>
                  Appointment Confirmed!
                </h2>
                <p style={{ color: "var(--gray-500)", fontSize: "1rem", marginBottom: "1.5rem" }}>
                  Your appointment has been booked successfully. Please save your booking reference.
                </p>

                <div className="booking-ref">
                  <div>
                    <div className="booking-ref-label">Booking Reference</div>
                    <div className="booking-ref-code">{booking.booking_reference}</div>
                  </div>
                  <button
                    onClick={() => { navigator.clipboard.writeText(booking.booking_reference); toast.success("Copied!"); }}
                    style={{ padding: "0.5rem", background: "var(--gray-100)", border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer", fontSize: "1rem" }}
                    title="Copy to clipboard"
                  >
                    📋
                  </button>
                </div>

                <div style={{ background: "var(--gray-50)", borderRadius: "var(--radius-md)", padding: "1.5rem", margin: "1.5rem 0", textAlign: "left" }}>
                  {[
                    { label: "Doctor", value: booking.appointment?.doctor_name },
                    { label: "Department", value: booking.appointment?.doctor_department },
                    { label: "Date", value: booking.appointment?.appointment_date ? new Date(booking.appointment.appointment_date + "T12:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "" },
                    { label: "Time", value: booking.appointment?.appointment_time?.slice(0, 5) },
                    { label: "Type", value: booking.appointment?.appointment_type?.replace("_", " ") },
                  ].map(r => (
                    <div key={r.label} className="appointment-detail-row">
                      <span className="appointment-detail-label">{r.label}</span>
                      <span className="appointment-detail-value">{r.value}</span>
                    </div>
                  ))}
                </div>

                <p style={{ fontSize: "0.875rem", color: "var(--gray-500)", marginBottom: "2rem" }}>
                  A confirmation email has been sent to <strong>{booking.appointment?.patient_email}</strong>. You can track or cancel your appointment using the booking reference above.
                </p>

                <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                  <Link to="/appointments/track" className="btn btn-secondary">Track Appointment</Link>
                  <Link to="/" className="btn btn-outline">Back to Home</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
