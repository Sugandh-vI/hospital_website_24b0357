import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBlogPosts } from "../api";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    getBlogPosts({ search, category })
      .then(r => setPosts(r.data.results || r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, category]);

  const categories = [...new Set(posts.map(p => p.category))];

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <div className="page-hero-content">
            <div className="breadcrumb">
              <Link to="/">Home</Link>
              <span className="breadcrumb-sep">/</span>
              <span>Health Blog</span>
            </div>
            <h1>Health & Wellness Blog</h1>
            <p>Expert medical insights, health tips, and disease awareness articles from our specialist doctors.</p>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Filter */}
          <div className="filter-bar" style={{ marginBottom: "2rem" }}>
            <div className="form-group" style={{ flex: 2 }}>
              <label className="form-label">Search Articles</label>
              <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input type="text" className="form-control" placeholder="Search health topics..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-control" value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading-center"><div className="loading-spinner" /></div>
          ) : posts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <div className="empty-state-title">No articles found</div>
              <p className="empty-state-text">Try a different search term or browse all categories.</p>
            </div>
          ) : (
            <div className="blog-grid">
              {posts.map(post => (
                <Link to={`/blog/${post.slug}`} key={post.id} className="blog-card" style={{ textDecoration: "none", color: "inherit" }}>
                  {post.image_url && <img src={post.image_url} alt={post.title} className="blog-card-img" loading="lazy" />}
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
                        <div className="blog-date">{new Date(post.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
