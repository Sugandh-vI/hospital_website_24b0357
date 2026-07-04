import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getDoctors, getDepartments } from "../api";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [availFilter, setAvailFilter] = useState("");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    getDepartments().then(r => setDepartments(r.data.results || r.data)).catch(() => {});
    const deptId = searchParams.get("department");
    if (deptId) setDeptFilter(deptId);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (deptFilter) params.department = deptFilter;
    if (availFilter) params.availability = availFilter;

    getDoctors(params)
      .then(r => setDoctors(r.data.results || r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, deptFilter, availFilter]);

  return (
    <div>
      {/* Page Hero */}
      <div className="page-hero">
        <div className="container">
          <div className="page-hero-content">
            <div className="breadcrumb">
              <Link to="/">Home</Link>
              <span className="breadcrumb-sep">/</span>
              <span>Our Doctors</span>
            </div>
            <h1>Find the Right Doctor</h1>
            <p>Browse our team of 120+ specialists across all departments. Filter by specialty or search by name.</p>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Filter Bar */}
          <div className="filter-bar">
            <div className="form-group" style={{ flex: 2 }}>
              <label className="form-label">Search Doctors</label>
              <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name or specialization..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <select
                className="form-control"
                value={deptFilter}
                onChange={e => setDeptFilter(e.target.value)}
              >
                <option value="">All Departments</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Availability</label>
              <select
                className="form-control"
                value={availFilter}
                onChange={e => setAvailFilter(e.target.value)}
              >
                <option value="">Any Status</option>
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="on_leave">On Leave</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: "0 0 auto" }}>
              <label className="form-label" style={{ visibility: "hidden" }}>Reset</label>
              <button
                className="btn btn-outline"
                onClick={() => { setSearch(""); setDeptFilter(""); setAvailFilter(""); }}
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Results count */}
          {!loading && (
            <div style={{ marginBottom: "1.5rem", color: "var(--gray-500)", fontSize: "0.9375rem" }}>
              Showing <strong style={{ color: "var(--gray-800)" }}>{doctors.length}</strong> doctor{doctors.length !== 1 ? "s" : ""}
            </div>
          )}

          {loading ? (
            <div className="loading-center"><div className="loading-spinner" /></div>
          ) : doctors.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <div className="empty-state-title">No doctors found</div>
              <p className="empty-state-text">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="doctor-grid">
              {doctors.map(doc => (
                <div key={doc.id} className="doctor-card">
                  {doc.photo_url ? (
                    <img src={doc.photo_url} alt={doc.full_name} className="doctor-card-photo" loading="lazy" />
                  ) : (
                    <div className="doctor-card-photo-placeholder">👨‍⚕️</div>
                  )}
                  <div className="doctor-card-body">
                    <div className="doctor-card-dept">{doc.department_name}</div>
                    <div className="doctor-card-name">{doc.full_name}</div>
                    <div className="doctor-card-spec">{doc.specialization}</div>
                    <div className="doctor-card-meta">
                      <div className="doctor-rating">
                        <span className="star-filled">★</span>
                        {doc.rating}
                        <span style={{ color: "var(--gray-400)", fontWeight: 400 }}>({doc.total_reviews})</span>
                      </div>
                      <div className={`badge ${doc.availability_status === "available" ? "badge-available" : doc.availability_status === "busy" ? "badge-busy" : "badge-on-leave"}`}>
                        {doc.availability_status.replace("_", " ")}
                      </div>
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "var(--gray-500)", marginBottom: "1rem" }}>
                      💰 ₹{doc.consultation_fee} · {doc.experience_years} yrs exp
                    </div>
                    <div className="doctor-card-actions">
                      <Link to={`/doctors/${doc.id}`} className="btn btn-outline btn-sm">View Profile</Link>
                      <Link to={`/appointments/book?doctor=${doc.id}`} className="btn btn-primary btn-sm">Book Now</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
