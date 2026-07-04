import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getDepartments, getDoctors, getTestimonials,
  getBlogPosts, getHospitalStats
} from "../api";

/* -------- animated counter hook -------- */
function useCountUp(target, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          let start = 0;
          const step = target / (duration / 16);
          const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(start));
          }, 16);
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);
  return { count, ref };
}

/* -------- Star rating -------- */
function Stars({ rating }) {
  return (
    <div className="testimonial-stars">
      {[1,2,3,4,5].map(n => (
        <span key={n} className={n <= rating ? "star-filled" : ""} style={{ color: n <= rating ? "#f59e0b" : "#e2e8f0", fontSize: "1rem" }}>★</span>
      ))}
    </div>
  );
}

/* -------- Stat Counter -------- */
function StatCounter({ value, suffix = "", label, icon, iconClass }) {
  const { count, ref } = useCountUp(value);
  return (
    <div className="stat-item" ref={ref}>
      <div className={`stat-icon ${iconClass}`}>{icon}</div>
      <div className="stat-number">{count}{suffix}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function HomePage() {
  const [departments, setDepartments] = useState([]);
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [stats, setStats] = useState({
    total_doctors: 120, total_departments: 8,
    total_appointments_served: 50000, years_of_excellence: 25
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      getDepartments(),
      getDoctors({ featured: "true" }),
      getTestimonials({ featured: "true" }),
      getBlogPosts(),
      getHospitalStats(),
    ]).then(([depts, docs, tests, blogs, statsRes]) => {
      setDepartments(depts.data.results || depts.data);
      setFeaturedDoctors((docs.data.results || docs.data).slice(0, 6));
      setTestimonials((tests.data.results || tests.data).slice(0, 6));
      setBlogPosts((blogs.data.results || blogs.data).slice(0, 3));
      setStats(statsRes.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* ========== HERO ========== */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="container">
          <div className="hero-content">
            {/* Left */}
            <div>
              <div className="hero-badge">
                <span className="hero-badge-dot" />
                Accredited by NABH & JCI
              </div>
              <h1 className="hero-title">
                Your Health,<br />
                Our <span className="highlight">Commitment</span>
              </h1>
              <p className="hero-description">
                HealthMate Central is a premier multispeciality hospital delivering world-class medical care with compassion. From routine checkups to complex surgeries — we're with you every step of the way.
              </p>
              <div className="hero-actions">
                <button className="btn btn-accent btn-lg" onClick={() => navigate("/appointments/book")}>
                  📅 Book Appointment
                </button>
                <button className="btn btn-outline-white btn-lg" onClick={() => navigate("/doctors")}>
                  Find a Doctor
                </button>
              </div>
              <div className="hero-stats">
                {[
                  { n: "25+", label: "Years of Excellence" },
                  { n: "120+", label: "Specialist Doctors" },
                  { n: "50K+", label: "Happy Patients" },
                  { n: "8+", label: "Specialties" },
                ].map(s => (
                  <div key={s.label} className="hero-stat">
                    <div className="hero-stat-number">{s.n}</div>
                    <div className="hero-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Info Cards */}
            <div className="hero-image-panel">
              <div style={{ position: "relative" }}>
                <div className="hero-emergency-badge">🚨 24/7 Emergency</div>
                <div className="hero-card-grid">
                  {[
                    { icon: "❤️", title: "Advanced Cardiac Care", sub: "State-of-art cath lab" },
                    { icon: "🧠", title: "Neuroscience Center", sub: "Stroke ready hospital" },
                    { icon: "🦴", title: "Ortho & Spine", sub: "Robotic surgery available" },
                    { icon: "👶", title: "Child Health", sub: "NICU level III" },
                  ].map(c => (
                    <div key={c.title} className="hero-info-card">
                      <div className="hero-info-card-icon">{c.icon}</div>
                      <div className="hero-info-card-title">{c.title}</div>
                      <div className="hero-info-card-sub">{c.sub}</div>
                    </div>
                  ))}
                  <div className="hero-info-card featured">
                    <div style={{ fontSize: "2.5rem" }}>🏆</div>
                    <div>
                      <div className="hero-info-card-title">25 Years of Excellence</div>
                      <div className="hero-info-card-sub">Trusted by 50,000+ patients across the region</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== STATS BAR ========== */}
      <div className="container">
        <div className="stats-bar">
          <StatCounter value={stats.total_doctors} suffix="+" label="Expert Doctors" icon="👨‍⚕️" iconClass="stat-icon-blue" />
          <StatCounter value={stats.total_departments} suffix="" label="Specialties" icon="🏥" iconClass="stat-icon-teal" />
          <StatCounter value={stats.total_appointments_served || 50000} suffix="+" label="Patients Served" icon="❤️" iconClass="stat-icon-orange" />
          <StatCounter value={stats.years_of_excellence || 25} suffix=" yrs" label="Years of Excellence" icon="🏆" iconClass="stat-icon-green" />
        </div>
      </div>

      {/* ========== DEPARTMENTS ========== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Our Specialties</span>
            <h2 className="section-title">World-Class Departments</h2>
            <p className="section-subtitle">
              Comprehensive care across 8+ medical specialties — each with dedicated experts, cutting-edge equipment, and a commitment to your well-being.
            </p>
          </div>

          {loading ? (
            <div className="dept-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} style={{ height: "220px", borderRadius: "var(--radius-xl)" }} className="skeleton" />
              ))}
            </div>
          ) : (
            <div className="dept-grid">
              {departments.slice(0, 8).map(dept => (
                <Link to={`/departments`} state={{ filter: dept.id }} key={dept.id} className="dept-card">
                  <div className="dept-card-icon">{dept.icon}</div>
                  <div className="dept-card-name">{dept.name}</div>
                  <p className="dept-card-desc">{dept.description}</p>
                  <div className="dept-card-count">
                    👨‍⚕️ {dept.doctor_count} Specialists →
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center" style={{ marginTop: "2.5rem" }}>
            <Link to="/departments" className="btn btn-outline btn-lg">
              View All Departments →
            </Link>
          </div>
        </div>
      </section>

      {/* ========== WHY CHOOSE US ========== */}
      <section className="section section-bg-gray">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Why HealthMate</span>
            <h2 className="section-title">Healthcare You Can Trust</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
            {[
              { icon: "🏅", title: "NABH & JCI Accredited", desc: "Meeting the highest standards of hospital quality and patient safety internationally." },
              { icon: "⚡", title: "24/7 Emergency Care", desc: "Round-the-clock emergency services with rapid response teams and trauma facilities." },
              { icon: "🔬", title: "Advanced Diagnostics", desc: "State-of-the-art labs, MRI, CT scan, and digital imaging for accurate, fast results." },
              { icon: "🤝", title: "Patient-First Approach", desc: "Every care decision is made with your health, comfort, and dignity as the top priority." },
              { icon: "💊", title: "Evidence-Based Medicine", desc: "All treatments follow the latest clinical guidelines and peer-reviewed research." },
              { icon: "🌐", title: "Multilingual Staff", desc: "Our team speaks Hindi, English, and multiple regional languages to serve all patients." },
            ].map(f => (
              <div key={f.title} style={{
                background: "#fff",
                borderRadius: "var(--radius-xl)",
                padding: "2rem",
                boxShadow: "var(--shadow-card)",
                border: "1px solid var(--gray-100)",
                transition: "all var(--transition-base)",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "var(--shadow-xl)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "var(--shadow-card)"; }}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: "1.0625rem", color: "var(--gray-900)", marginBottom: "0.5rem" }}>{f.title}</div>
                <p style={{ fontSize: "0.875rem", color: "var(--gray-500)", lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FEATURED DOCTORS ========== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Our Experts</span>
            <h2 className="section-title">Meet Our Leading Physicians</h2>
            <p className="section-subtitle">
              Our team of over 120 specialists brings together decades of experience, international training, and genuine dedication to healing.
            </p>
          </div>

          {loading ? (
            <div className="doctor-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ height: "380px", borderRadius: "var(--radius-xl)" }} className="skeleton" />
              ))}
            </div>
          ) : (
            <div className="doctor-grid">
              {featuredDoctors.map(doc => (
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
                        {doc.rating} <span style={{ color: "var(--gray-400)", fontWeight: 400 }}>({doc.total_reviews})</span>
                      </div>
                      <span>{doc.experience_years} yrs exp</span>
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

          <div className="text-center" style={{ marginTop: "2.5rem" }}>
            <Link to="/doctors" className="btn btn-outline btn-lg">See All Doctors →</Link>
          </div>
        </div>
      </section>

      {/* ========== APPOINTMENT LOOKUP (Extra Feature) ========== */}
      <section className="section-sm">
        <div className="container">
          <div className="feature-highlight">
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "2.5rem", alignItems: "center" }}>
              <div>
                <span className="section-label">Track Your Visit</span>
                <h2 className="section-title" style={{ fontSize: "1.875rem", marginBottom: "0.75rem" }}>
                  Appointment Status Tracker
                </h2>
                <p style={{ color: "var(--gray-600)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                  Already booked? Enter your booking reference number to instantly view your appointment status, doctor details, and — if needed — cancel before the appointment day.
                </p>
                <Link to="/appointments/track" className="btn btn-secondary">
                  Track My Appointment →
                </Link>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {[
                  { icon: "🔍", title: "Instant Lookup", desc: "Find your appointment instantly with your booking reference" },
                  { icon: "✅", title: "Real-time Status", desc: "See if your appointment is pending, confirmed, or completed" },
                  { icon: "❌", title: "Easy Cancellation", desc: "Cancel from the comfort of home, no phone calls needed" },
                ].map(f => (
                  <div key={f.title} style={{
                    display: "flex", gap: "1rem", alignItems: "flex-start",
                    background: "#fff", padding: "1.25rem", borderRadius: "var(--radius-md)",
                    boxShadow: "var(--shadow-sm)", border: "1px solid var(--gray-100)"
                  }}>
                    <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>{f.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: "0.25rem", fontSize: "0.9375rem" }}>{f.title}</div>
                      <div style={{ fontSize: "0.8125rem", color: "var(--gray-500)" }}>{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section className="section section-bg-gray">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Patient Stories</span>
            <h2 className="section-title">Lives We've Touched</h2>
            <p className="section-subtitle">Real stories from real patients about their journey to better health with HealthMate Central.</p>
          </div>

          <div className="testimonial-grid">
            {(testimonials.length ? testimonials : PLACEHOLDER_TESTIMONIALS).map((t, i) => (
              <div key={t.id || i} className="testimonial-card">
                <div className="testimonial-quote">"</div>
                <Stars rating={t.rating} />
                <p className="testimonial-text">"{t.review}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-author-photo">
                    {t.patient_name?.[0]}
                  </div>
                  <div>
                    <div className="testimonial-author-name">{t.patient_name}</div>
                    <div className="testimonial-author-dept">{t.department_name || t.doctor_name || "Patient"}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== BLOG ========== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Health Insights</span>
            <h2 className="section-title">Advice from Our Experts</h2>
            <p className="section-subtitle">Stay informed with the latest health tips and medical insights from our specialist doctors.</p>
          </div>

          <div className="blog-grid">
            {(blogPosts.length ? blogPosts : PLACEHOLDER_BLOGS).map((post, i) => (
              <Link to={`/blog/${post.slug}`} key={post.id || i} className="blog-card" style={{ textDecoration: "none", color: "inherit" }}>
                {post.image_url && (
                  <img src={post.image_url} alt={post.title} className="blog-card-img" loading="lazy" />
                )}
                <div className="blog-card-body">
                  <div className="blog-category">{post.category}</div>
                  <div className="blog-title">{post.title}</div>
                  <p className="blog-excerpt">{post.excerpt}</p>
                  <div className="blog-author">
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--gray-200)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.875rem", color: "var(--brand-primary)", flexShrink: 0 }}>
                      {post.author_name?.[3] || "Dr"}
                    </div>
                    <div>
                      <div className="blog-author-name">{post.author_name || "Medical Team"}</div>
                      <div className="blog-date">{post.created_at ? new Date(post.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : ""}</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center" style={{ marginTop: "2.5rem" }}>
            <Link to="/blog" className="btn btn-outline btn-lg">Read More Articles →</Link>
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Take Control of Your Health?</h2>
            <p className="cta-text">
              Don't wait. Book an appointment with one of our specialists today — same-day slots often available for urgent concerns.
            </p>
            <div className="cta-actions">
              <button className="btn btn-accent btn-lg" onClick={() => navigate("/appointments/book")}>
                📅 Book Appointment
              </button>
              <a href="tel:+911800123456" className="btn btn-outline-white btn-lg">
                📞 Call: 1800-123-456
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const PLACEHOLDER_TESTIMONIALS = [
  { patient_name: "Anjali V.", rating: 5, review: "Dr. Sharma saved my father's life! The entire team was incredibly professional and compassionate. We are forever grateful.", department_name: "Cardiology" },
  { patient_name: "Suresh P.", rating: 5, review: "After suffering a stroke, I was terrified. Dr. Mehta and his team acted swiftly and I made a near-complete recovery.", department_name: "Neurology" },
  { patient_name: "Rekha D.", rating: 5, review: "My knee replacement with Dr. Singh was the best decision. Now at 3 months post-surgery I'm walking without pain!", department_name: "Orthopedics" },
  { patient_name: "Manish K.", rating: 5, review: "My daughter was diagnosed with leukemia at age 8. Dr. Gupta was a pillar of strength. She is now in remission.", department_name: "Oncology" },
  { patient_name: "Fatima S.", rating: 5, review: "Dr. Sunita Rao has been our family pediatrician for 5 years. My toddler actually looks forward to doctor visits!", department_name: "Pediatrics" },
  { patient_name: "Rohit A.", rating: 4, review: "Dr. Khan diagnosed my stubborn skin condition correctly when three other doctors couldn't. Very satisfied.", department_name: "Dermatology" },
];

const PLACEHOLDER_BLOGS = [
  { slug: "#", title: "10 Warning Signs of a Heart Attack You Should Never Ignore", excerpt: "Heart attacks don't always look like the dramatic chest-clutching scenes from movies. Learn the subtle warning signs.", category: "Heart Health", author_name: "Dr. Rajesh Sharma", image_url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80" },
  { slug: "#", title: "Understanding Stroke: Act FAST and Save a Life", excerpt: "Every minute counts during a stroke. The FAST acronym can help you recognize symptoms and get help immediately.", category: "Brain Health", author_name: "Dr. Arjun Mehta", image_url: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80" },
  { slug: "#", title: "Childhood Vaccination: What Every Parent Needs to Know", excerpt: "Vaccines protect children from serious diseases. A clear, updated guide to the recommended vaccination schedule.", category: "Child Health", author_name: "Dr. Sunita Rao", image_url: "https://images.unsplash.com/photo-1581595219315-a187dd40c322?w=800&q=80" },
];
