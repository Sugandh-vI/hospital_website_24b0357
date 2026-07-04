from django.db import models
from django.contrib.auth.models import User


class Department(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    icon = models.CharField(max_length=100, default="🏥")
    image_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Doctor(models.Model):
    GENDER_CHOICES = [("M", "Male"), ("F", "Female"), ("O", "Other")]
    AVAILABILITY_CHOICES = [
        ("available", "Available"),
        ("busy", "Busy"),
        ("on_leave", "On Leave"),
    ]

    department = models.ForeignKey(
        Department, on_delete=models.SET_NULL, null=True, related_name="doctors"
    )
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    specialization = models.CharField(max_length=200)
    qualification = models.CharField(max_length=300)
    experience_years = models.PositiveIntegerField(default=0)
    bio = models.TextField(blank=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, default="M")
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    consultation_fee = models.DecimalField(max_digits=8, decimal_places=2, default=500.00)
    availability_status = models.CharField(
        max_length=20, choices=AVAILABILITY_CHOICES, default="available"
    )
    photo_url = models.URLField(blank=True, null=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=4.5)
    total_reviews = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-is_featured", "last_name"]

    def __str__(self):
        return f"Dr. {self.first_name} {self.last_name}"

    @property
    def full_name(self):
        return f"Dr. {self.first_name} {self.last_name}"


class DoctorSchedule(models.Model):
    DAY_CHOICES = [
        (0, "Monday"),
        (1, "Tuesday"),
        (2, "Wednesday"),
        (3, "Thursday"),
        (4, "Friday"),
        (5, "Saturday"),
        (6, "Sunday"),
    ]

    doctor = models.ForeignKey(
        Doctor, on_delete=models.CASCADE, related_name="schedules"
    )
    day_of_week = models.IntegerField(choices=DAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()
    max_appointments = models.PositiveIntegerField(default=10)

    class Meta:
        unique_together = ["doctor", "day_of_week"]
        ordering = ["day_of_week", "start_time"]

    def __str__(self):
        return f"{self.doctor} - {self.get_day_of_week_display()}"


class Appointment(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    TYPE_CHOICES = [
        ("in_person", "In Person"),
        ("video", "Video Consultation"),
        ("phone", "Phone Consultation"),
    ]

    doctor = models.ForeignKey(
        Doctor, on_delete=models.CASCADE, related_name="appointments"
    )
    patient_name = models.CharField(max_length=200)
    patient_email = models.EmailField()
    patient_phone = models.CharField(max_length=20)
    patient_age = models.PositiveIntegerField()
    patient_gender = models.CharField(max_length=10)
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    appointment_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default="in_person")
    symptoms = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    booking_reference = models.CharField(max_length=20, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.patient_name} - {self.doctor} ({self.appointment_date})"

    def save(self, *args, **kwargs):
        if not self.booking_reference:
            import random
            import string
            self.booking_reference = "HMC" + "".join(
                random.choices(string.ascii_uppercase + string.digits, k=8)
            )
        super().save(*args, **kwargs)


class Testimonial(models.Model):
    patient_name = models.CharField(max_length=200)
    patient_photo_url = models.URLField(blank=True, null=True)
    rating = models.PositiveIntegerField(default=5)
    review = models.TextField()
    department = models.ForeignKey(
        Department, on_delete=models.SET_NULL, null=True, blank=True
    )
    doctor = models.ForeignKey(
        Doctor, on_delete=models.SET_NULL, null=True, blank=True
    )
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-is_featured", "-created_at"]

    def __str__(self):
        return f"{self.patient_name} - {self.rating}★"


class BlogPost(models.Model):
    title = models.CharField(max_length=300)
    slug = models.SlugField(unique=True)
    excerpt = models.TextField()
    content = models.TextField()
    author = models.ForeignKey(
        Doctor, on_delete=models.SET_NULL, null=True, related_name="blog_posts"
    )
    category = models.CharField(max_length=100, default="Health Tips")
    image_url = models.URLField(blank=True, null=True)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class ContactMessage(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    subject = models.CharField(max_length=300)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} - {self.subject}"
