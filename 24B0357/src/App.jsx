import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import DepartmentsPage from "./pages/DepartmentsPage";
import DoctorsPage from "./pages/DoctorsPage";
import DoctorDetailPage from "./pages/DoctorDetailPage";
import AppointmentPage from "./pages/AppointmentPage";
import AppointmentTrackPage from "./pages/AppointmentTrackPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import ContactPage from "./pages/ContactPage";
import "./index.css";

function NotFoundPage() {
  return (
    <div style={{ paddingTop: "calc(var(--nav-height) + 3rem)", minHeight: "70vh", background: "var(--gray-50)" }}>
      <div className="container">
        <div className="empty-state">
          <div style={{ fontSize: "6rem" }}>🏥</div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 700, margin: "1rem 0 0.5rem" }}>Page Not Found</h1>
          <p className="empty-state-text" style={{ marginBottom: "2rem" }}>The page you're looking for doesn't exist or has moved.</p>
          <a href="/" className="btn btn-primary btn-lg">← Back to Home</a>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: "Inter, sans-serif",
            fontSize: "0.9375rem",
            borderRadius: "0.75rem",
            padding: "0.875rem 1.25rem",
          },
          success: { style: { background: "#d1fae5", color: "#065f46", border: "1px solid #a7f3d0" } },
          error: { style: { background: "#fee2e2", color: "#991b1b", border: "1px solid #fca5a5" } },
        }}
      />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/departments" element={<DepartmentsPage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/doctors/:id" element={<DoctorDetailPage />} />
          <Route path="/appointments/book" element={<AppointmentPage />} />
          <Route path="/appointments/track" element={<AppointmentTrackPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
