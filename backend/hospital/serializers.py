from rest_framework import serializers
from .models import (
    Department, Doctor, DoctorSchedule, Appointment,
    Testimonial, BlogPost, ContactMessage
)


class DepartmentSerializer(serializers.ModelSerializer):
    doctor_count = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = ["id", "name", "description", "icon", "image_url", "doctor_count", "created_at"]

    def get_doctor_count(self, obj):
        return obj.doctors.count()


class DoctorScheduleSerializer(serializers.ModelSerializer):
    day_name = serializers.SerializerMethodField()

    class Meta:
        model = DoctorSchedule
        fields = ["id", "day_of_week", "day_name", "start_time", "end_time", "max_appointments"]

    def get_day_name(self, obj):
        return obj.get_day_of_week_display()


class DoctorListSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source="department.name", read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Doctor
        fields = [
            "id", "full_name", "first_name", "last_name", "specialization",
            "qualification", "experience_years", "consultation_fee",
            "availability_status", "photo_url", "rating", "total_reviews",
            "is_featured", "department", "department_name", "gender"
        ]

    def get_full_name(self, obj):
        return obj.full_name


class DoctorDetailSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source="department.name", read_only=True)
    full_name = serializers.SerializerMethodField()
    schedules = DoctorScheduleSerializer(many=True, read_only=True)

    class Meta:
        model = Doctor
        fields = [
            "id", "full_name", "first_name", "last_name", "specialization",
            "qualification", "experience_years", "bio", "gender", "email",
            "phone", "consultation_fee", "availability_status", "photo_url",
            "rating", "total_reviews", "is_featured", "department",
            "department_name", "schedules", "created_at"
        ]

    def get_full_name(self, obj):
        return obj.full_name


class AppointmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = [
            "id", "doctor", "patient_name", "patient_email", "patient_phone",
            "patient_age", "patient_gender", "appointment_date", "appointment_time",
            "appointment_type", "symptoms", "notes", "status", "booking_reference",
            "created_at"
        ]
        read_only_fields = ["status", "booking_reference", "created_at"]

    def validate_appointment_date(self, value):
        from datetime import date
        if value < date.today():
            raise serializers.ValidationError("Appointment date cannot be in the past.")
        return value


class AppointmentSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source="doctor.full_name", read_only=True)
    doctor_specialization = serializers.CharField(source="doctor.specialization", read_only=True)
    doctor_department = serializers.CharField(source="doctor.department.name", read_only=True)

    class Meta:
        model = Appointment
        fields = [
            "id", "doctor", "doctor_name", "doctor_specialization", "doctor_department",
            "patient_name", "patient_email", "patient_phone", "patient_age",
            "patient_gender", "appointment_date", "appointment_time", "appointment_type",
            "symptoms", "notes", "status", "booking_reference", "created_at", "updated_at"
        ]


class TestimonialSerializer(serializers.ModelSerializer):
    doctor_name = serializers.SerializerMethodField()
    department_name = serializers.SerializerMethodField()

    class Meta:
        model = Testimonial
        fields = [
            "id", "patient_name", "patient_photo_url", "rating", "review",
            "department", "department_name", "doctor", "doctor_name",
            "is_featured", "created_at"
        ]

    def get_doctor_name(self, obj):
        return obj.doctor.full_name if obj.doctor else None

    def get_department_name(self, obj):
        return obj.department.name if obj.department else None


class BlogPostSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_photo = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = [
            "id", "title", "slug", "excerpt", "content", "author",
            "author_name", "author_photo", "category", "image_url",
            "is_published", "created_at"
        ]

    def get_author_name(self, obj):
        return obj.author.full_name if obj.author else "Medical Team"

    def get_author_photo(self, obj):
        return obj.author.photo_url if obj.author else None


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["id", "name", "email", "phone", "subject", "message", "created_at"]
        read_only_fields = ["created_at"]
