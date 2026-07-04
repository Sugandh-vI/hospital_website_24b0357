from django.contrib import admin
from .models import (
    Department, Doctor, DoctorSchedule, Appointment,
    Testimonial, BlogPost, ContactMessage
)


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ["name", "icon", "created_at"]
    search_fields = ["name"]


class DoctorScheduleInline(admin.TabularInline):
    model = DoctorSchedule
    extra = 1


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ["full_name", "department", "specialization", "availability_status", "is_featured", "rating"]
    list_filter = ["department", "availability_status", "is_featured", "gender"]
    search_fields = ["first_name", "last_name", "specialization", "email"]
    list_editable = ["availability_status", "is_featured"]
    inlines = [DoctorScheduleInline]

    def full_name(self, obj):
        return obj.full_name
    full_name.short_description = "Name"


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ["booking_reference", "patient_name", "doctor", "appointment_date", "appointment_time", "status"]
    list_filter = ["status", "appointment_type", "appointment_date"]
    search_fields = ["patient_name", "patient_email", "booking_reference"]
    list_editable = ["status"]
    readonly_fields = ["booking_reference", "created_at", "updated_at"]
    ordering = ["-appointment_date"]


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ["patient_name", "rating", "doctor", "department", "is_featured"]
    list_filter = ["rating", "is_featured"]
    list_editable = ["is_featured"]


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ["title", "author", "category", "is_published", "created_at"]
    list_filter = ["category", "is_published"]
    search_fields = ["title", "content"]
    prepopulated_fields = {"slug": ("title",)}
    list_editable = ["is_published"]


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ["name", "email", "subject", "is_read", "created_at"]
    list_filter = ["is_read"]
    search_fields = ["name", "email", "subject"]
    list_editable = ["is_read"]
    readonly_fields = ["created_at"]
