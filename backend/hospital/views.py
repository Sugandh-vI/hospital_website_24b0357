from rest_framework import generics, status, filters
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q
from .models import (
    Department, Doctor, Appointment, Testimonial, BlogPost, ContactMessage
)
from .serializers import (
    DepartmentSerializer, DoctorListSerializer, DoctorDetailSerializer,
    AppointmentCreateSerializer, AppointmentSerializer,
    TestimonialSerializer, BlogPostSerializer, ContactMessageSerializer
)


# --- Department Views ---

class DepartmentListView(generics.ListAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer


class DepartmentDetailView(generics.RetrieveAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer


# --- Doctor Views ---

class DoctorListView(generics.ListAPIView):
    serializer_class = DoctorListSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["first_name", "last_name", "specialization"]

    def get_queryset(self):
        queryset = Doctor.objects.select_related("department").all()
        department = self.request.query_params.get("department")
        availability = self.request.query_params.get("availability")
        featured = self.request.query_params.get("featured")

        if department:
            queryset = queryset.filter(department__id=department)
        if availability:
            queryset = queryset.filter(availability_status=availability)
        if featured == "true":
            queryset = queryset.filter(is_featured=True)
        return queryset


class DoctorDetailView(generics.RetrieveAPIView):
    queryset = Doctor.objects.select_related("department").prefetch_related("schedules")
    serializer_class = DoctorDetailSerializer


# --- Appointment Views ---

class AppointmentCreateView(generics.CreateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentCreateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        appointment = serializer.save()
        return Response(
            {
                "message": "Appointment booked successfully!",
                "booking_reference": appointment.booking_reference,
                "appointment": AppointmentSerializer(appointment).data,
            },
            status=status.HTTP_201_CREATED,
        )


class AppointmentLookupView(generics.RetrieveAPIView):
    """Allow patients to look up their appointment by booking reference."""
    serializer_class = AppointmentSerializer
    lookup_field = "booking_reference"
    queryset = Appointment.objects.select_related("doctor", "doctor__department")


class AppointmentCancelView(generics.UpdateAPIView):
    """Allow patients to cancel their appointment by booking reference."""
    serializer_class = AppointmentSerializer
    lookup_field = "booking_reference"
    queryset = Appointment.objects.all()

    def update(self, request, *args, **kwargs):
        appointment = self.get_object()
        if appointment.status in ["completed", "cancelled"]:
            return Response(
                {"error": "This appointment cannot be cancelled."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        appointment.status = "cancelled"
        appointment.save()
        return Response(
            {"message": "Appointment cancelled successfully.", "booking_reference": appointment.booking_reference},
            status=status.HTTP_200_OK,
        )


# --- Testimonial Views ---

class TestimonialListView(generics.ListAPIView):
    serializer_class = TestimonialSerializer

    def get_queryset(self):
        queryset = Testimonial.objects.all()
        featured = self.request.query_params.get("featured")
        if featured == "true":
            queryset = queryset.filter(is_featured=True)
        return queryset


# --- Blog Views ---

class BlogPostListView(generics.ListAPIView):
    serializer_class = BlogPostSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["title", "category", "excerpt"]

    def get_queryset(self):
        queryset = BlogPost.objects.filter(is_published=True)
        category = self.request.query_params.get("category")
        if category:
            queryset = queryset.filter(category__icontains=category)
        return queryset


class BlogPostDetailView(generics.RetrieveAPIView):
    queryset = BlogPost.objects.filter(is_published=True)
    serializer_class = BlogPostSerializer
    lookup_field = "slug"


# --- Contact Views ---

class ContactMessageCreateView(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"message": "Your message has been received. We'll get back to you within 24 hours."},
            status=status.HTTP_201_CREATED,
        )


# --- Dashboard / Stats API ---

@api_view(["GET"])
def hospital_stats(request):
    """Public stats for the home page hero section."""
    return Response({
        "total_doctors": Doctor.objects.filter(availability_status="available").count(),
        "total_departments": Department.objects.count(),
        "total_appointments_served": Appointment.objects.filter(status="completed").count(),
        "years_of_excellence": 25,
    })


@api_view(["GET"])
def available_slots(request, doctor_id):
    """Return already-booked slots for a doctor on a given date."""
    from datetime import datetime
    date_str = request.query_params.get("date")
    if not date_str:
        return Response({"error": "Date is required"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        return Response({"error": "Invalid date format"}, status=status.HTTP_400_BAD_REQUEST)

    booked_slots = Appointment.objects.filter(
        doctor_id=doctor_id,
        appointment_date=date,
        status__in=["pending", "confirmed"]
    ).values_list("appointment_time", flat=True)

    return Response({
        "date": date_str,
        "booked_slots": [t.strftime("%H:%M") for t in booked_slots],
    })
