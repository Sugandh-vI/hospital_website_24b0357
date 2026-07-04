import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getBlogPost } from "../api";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogPost(slug)
      .then(r => setPost(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div style={{ paddingTop: "calc(var(--nav-height) + 2rem)", minHeight: "80vh" }}>
      <div className="loading-center"><div className="loading-spinner" /></div>
    </div>
  );

  if (!post) return (
    <div style={{ paddingTop: "calc(var(--nav-height) + 2rem)", minHeight: "80vh" }}>
      <div className="container"><div className="empty-state">
        <div className="empty-state-icon">📝</div>
        <div className="empty-state-title">Article not found</div>
        <Link to="/blog" className="btn btn-primary" style={{ marginTop: "1rem" }}>Back to Blog</Link>
      </div></div>
    </div>
  );

  return (
    <div style={{ paddingTop: "var(--nav-height)", background: "#fff", minHeight: "100vh" }}>
      {/* Article Hero */}
      <div style={{
        background: "linear-gradient(135deg, var(--brand-primary-dark), var(--brand-primary))",
        padding: "3.5rem 0",
        position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='20' cy='20' r='6'/%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="container" style={{ position: "relative", zIndex: 1, maxWidth: "800px" }}>
          <div className="breadcrumb" style={{ marginBottom: "1.5rem" }}>
            <Link to="/" style={{ color: "rgba(255,255,255,0.6)" }}>Home</Link>
            <span className="breadcrumb-sep">/</span>
            <Link to="/blog" style={{ color: "rgba(255,255,255,0.6)" }}>Blog</Link>
            <span className="breadcrumb-sep">/</span>
            <span style={{ color: "rgba(255,255,255,0.9)" }}>{post.category}</span>
          </div>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", padding: "0.35rem 1rem", borderRadius: "999px", fontSize: "0.8125rem", fontWeight: 700, color: "#fff", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {post.category}
          </div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: "1.25rem" }}>
            {post.title}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", color: "rgba(255,255,255,0.75)", fontSize: "0.875rem", flexWrap: "wrap" }}>
            <span>👨‍⚕️ {post.author_name || "Medical Team"}</span>
            <span>·</span>
            <span>📅 {new Date(post.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
          </div>
        </div>
      </div>

      {/* Cover image */}
      {post.image_url && (
        <div className="container" style={{ maxWidth: "800px" }}>
          <img
            src={post.image_url}
            alt={post.title}
            style={{ width: "100%", height: "380px", objectFit: "cover", borderRadius: "var(--radius-xl)", marginTop: "-2rem", boxShadow: "var(--shadow-xl)", display: "block" }}
          />
        </div>
      )}

      {/* Article Content */}
      <div className="container" style={{ maxWidth: "800px", padding: "3rem 1.5rem" }}>
        <div style={{
          fontSize: "1.0625rem", lineHeight: 1.85, color: "var(--gray-700)",
          fontStyle: "italic", borderLeft: "4px solid var(--brand-secondary)",
          paddingLeft: "1.25rem", marginBottom: "2rem", color: "var(--gray-600)"
        }}>
          {post.excerpt}
        </div>

        <div style={{ fontSize: "1.0625rem", lineHeight: 1.85, color: "var(--gray-700)" }}>
          {post.content && post.content !== "..." ? post.content.split("\n\n").map((p, i) => (
            <p key={i} style={{ marginBottom: "1.5rem" }}>{p}</p>
          )) : (
            <div>
              <p style={{ marginBottom: "1.5rem" }}>
                This comprehensive guide from our specialist team covers everything you need to know about this important health topic. As healthcare professionals committed to public awareness, we believe informed patients make better decisions about their health.
              </p>
              <p style={{ marginBottom: "1.5rem" }}>
                Modern medicine has made tremendous advances in understanding and treating many conditions that were once considered untreatable. Regular screenings, lifestyle modifications, and timely medical intervention can dramatically improve outcomes for most patients.
              </p>
              <p style={{ marginBottom: "1.5rem" }}>
                Our team of specialists at HealthMate Central Hospital is available to discuss any concerns you may have. Don't hesitate to schedule a consultation if you have questions about your health or the health of your loved ones.
              </p>
              <p style={{ marginBottom: "1.5rem" }}>
                Early detection and proactive health management remain the most powerful tools we have. We encourage all our readers to prioritize regular health checkups and maintain open communication with their healthcare providers.
              </p>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div style={{ background: "var(--gray-50)", border: "1px solid var(--gray-200)", borderRadius: "var(--radius-md)", padding: "1.25rem", marginTop: "2rem", fontSize: "0.8125rem", color: "var(--gray-500)" }}>
          <strong>Medical Disclaimer:</strong> This article is for informational purposes only and should not be considered medical advice. Always consult with a qualified healthcare professional for medical guidance specific to your condition.
        </div>

        {/* CTA */}
        <div style={{ background: "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))", borderRadius: "var(--radius-xl)", padding: "2rem", marginTop: "2.5rem", textAlign: "center", color: "#fff" }}>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.375rem", fontWeight: 700, marginBottom: "0.625rem" }}>Have Concerns About Your Health?</h3>
          <p style={{ opacity: 0.85, marginBottom: "1.25rem", fontSize: "0.9375rem" }}>Our specialists are here to help. Book a consultation today.</p>
          <Link to="/appointments/book" className="btn" style={{ background: "#fff", color: "var(--brand-primary)", fontWeight: 700 }}>
            Book a Consultation
          </Link>
        </div>
      </div>
    </div>
  );
}
