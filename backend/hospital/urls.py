from django.urls import path
from . import views

urlpatterns = [
    # Stats
    path("stats/", views.hospital_stats, name="hospital-stats"),

    # Departments
    path("departments/", views.DepartmentListView.as_view(), name="department-list"),
    path("departments/<int:pk>/", views.DepartmentDetailView.as_view(), name="department-detail"),

    # Doctors
    path("doctors/", views.DoctorListView.as_view(), name="doctor-list"),
    path("doctors/<int:pk>/", views.DoctorDetailView.as_view(), name="doctor-detail"),
    path("doctors/<int:doctor_id>/slots/", views.available_slots, name="available-slots"),

    # Appointments
    path("appointments/", views.AppointmentCreateView.as_view(), name="appointment-create"),
    path("appointments/<str:booking_reference>/", views.AppointmentLookupView.as_view(), name="appointment-lookup"),
    path("appointments/<str:booking_reference>/cancel/", views.AppointmentCancelView.as_view(), name="appointment-cancel"),

    # Testimonials
    path("testimonials/", views.TestimonialListView.as_view(), name="testimonial-list"),

    # Blog
    path("blog/", views.BlogPostListView.as_view(), name="blog-list"),
    path("blog/<slug:slug>/", views.BlogPostDetailView.as_view(), name="blog-detail"),

    # Contact
    path("contact/", views.ContactMessageCreateView.as_view(), name="contact-create"),
]
