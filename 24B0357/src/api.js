import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Departments
export const getDepartments = () => api.get("/departments/");
export const getDepartment = (id) => api.get(`/departments/${id}/`);

// Doctors
export const getDoctors = (params = {}) => api.get("/doctors/", { params });
export const getDoctor = (id) => api.get(`/doctors/${id}/`);
export const getAvailableSlots = (doctorId, date) =>
  api.get(`/doctors/${doctorId}/slots/`, { params: { date } });

// Appointments
export const createAppointment = (data) => api.post("/appointments/", data);
export const getAppointment = (bookingRef) =>
  api.get(`/appointments/${bookingRef}/`);
export const cancelAppointment = (bookingRef) =>
  api.patch(`/appointments/${bookingRef}/cancel/`);

// Testimonials
export const getTestimonials = (params = {}) =>
  api.get("/testimonials/", { params });

// Blog
export const getBlogPosts = (params = {}) => api.get("/blog/", { params });
export const getBlogPost = (slug) => api.get(`/blog/${slug}/`);

// Stats
export const getHospitalStats = () => api.get("/stats/");

// Contact
export const sendContactMessage = (data) => api.post("/contact/", data);

export default api;
