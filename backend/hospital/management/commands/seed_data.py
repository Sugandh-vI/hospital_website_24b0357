"""
Management command to seed the database with realistic hospital data.
Run: python manage.py seed_data
"""

from django.core.management.base import BaseCommand
from hospital.models import Department, Doctor, DoctorSchedule, Testimonial, BlogPost
from datetime import time
from django.utils.text import slugify


class Command(BaseCommand):
    help = "Seeds the database with sample hospital data"

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING("Seeding database..."))
        self._create_departments()
        self._create_doctors()
        self._create_testimonials()
        self._create_blog_posts()
        self.stdout.write(self.style.SUCCESS("Database seeded successfully!"))

    def _create_departments(self):
        departments_data = [
            {
                "name": "Cardiology",
                "description": "Comprehensive heart care including diagnostics, interventional procedures, and cardiac rehabilitation. Our team treats coronary artery disease, heart failure, arrhythmias, and more.",
                "icon": "❤️",
                "image_url": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80",
            },
            {
                "name": "Neurology",
                "description": "Expert care for disorders of the brain, spinal cord, and nervous system. We specialize in stroke care, epilepsy, multiple sclerosis, Parkinson's disease, and headache management.",
                "icon": "🧠",
                "image_url": "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80",
            },
            {
                "name": "Orthopedics",
                "description": "Advanced treatment for bone, joint, and musculoskeletal conditions. From sports injuries to joint replacements, our orthopedic team restores mobility and quality of life.",
                "icon": "🦴",
                "image_url": "https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80",
            },
            {
                "name": "Pediatrics",
                "description": "Specialized healthcare for infants, children, and adolescents. Our child-friendly environment and expert pediatricians ensure the best care for your little ones.",
                "icon": "👶",
                "image_url": "https://images.unsplash.com/photo-1581595219315-a187dd40c322?w=800&q=80",
            },
            {
                "name": "Oncology",
                "description": "Comprehensive cancer care with cutting-edge treatments including chemotherapy, immunotherapy, and targeted therapy. Our multidisciplinary team supports patients through every stage.",
                "icon": "🎗️",
                "image_url": "https://images.unsplash.com/photo-1631217872822-7e41e8d3de8a?w=800&q=80",
            },
            {
                "name": "Emergency Medicine",
                "description": "24/7 emergency care with rapid response teams. Our ER handles trauma, acute illnesses, and life-threatening emergencies with state-of-the-art equipment and experienced physicians.",
                "icon": "🚨",
                "image_url": "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80",
            },
            {
                "name": "Gastroenterology",
                "description": "Expert diagnosis and treatment of digestive system disorders including GERD, IBS, Crohn's disease, liver conditions, and colorectal issues.",
                "icon": "🔬",
                "image_url": "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&q=80",
            },
            {
                "name": "Dermatology",
                "description": "Comprehensive skin care for medical and cosmetic conditions. We treat acne, eczema, psoriasis, skin cancers, and offer various aesthetic procedures.",
                "icon": "🌿",
                "image_url": "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80",
            },
        ]

        for dept_data in departments_data:
            dept, created = Department.objects.get_or_create(
                name=dept_data["name"],
                defaults=dept_data
            )
            if created:
                self.stdout.write(f"  ✓ Created department: {dept.name}")

    def _create_doctors(self):
        doctors_data = [
            # Cardiology
            {
                "department_name": "Cardiology",
                "first_name": "Rajesh",
                "last_name": "Sharma",
                "specialization": "Interventional Cardiology",
                "qualification": "MBBS, MD (Cardiology), DM (Interventional Cardiology), FACC",
                "experience_years": 18,
                "bio": "Dr. Rajesh Sharma is a nationally recognized interventional cardiologist with over 18 years of experience performing complex cardiac procedures. He has performed over 5,000 angioplasties and is a pioneer in minimally invasive heart valve procedures in the region.",
                "gender": "M",
                "email": "rajesh.sharma@healthmate.com",
                "phone": "+91-98765-43210",
                "consultation_fee": 1500.00,
                "availability_status": "available",
                "photo_url": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
                "rating": 4.9,
                "total_reviews": 342,
                "is_featured": True,
            },
            {
                "department_name": "Cardiology",
                "first_name": "Priya",
                "last_name": "Nair",
                "specialization": "Electrophysiology & Heart Rhythm",
                "qualification": "MBBS, MD (Internal Medicine), DM (Cardiology), Fellowship in EP",
                "experience_years": 12,
                "bio": "Dr. Priya Nair specializes in cardiac electrophysiology, treating complex arrhythmias including atrial fibrillation. She is trained in advanced ablation techniques and is one of the few female electrophysiologists in the city.",
                "gender": "F",
                "email": "priya.nair@healthmate.com",
                "phone": "+91-98765-43211",
                "consultation_fee": 1200.00,
                "availability_status": "available",
                "photo_url": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
                "rating": 4.8,
                "total_reviews": 218,
                "is_featured": True,
            },
            # Neurology
            {
                "department_name": "Neurology",
                "first_name": "Arjun",
                "last_name": "Mehta",
                "specialization": "Stroke Neurology & Neuro-Critical Care",
                "qualification": "MBBS, MD (Neurology), DM (Neurology), Fellowship in Stroke",
                "experience_years": 15,
                "bio": "Dr. Arjun Mehta leads our stroke program and is instrumental in implementing the 'clot-busting' thrombolysis protocol that has significantly improved stroke outcomes at HealthMate Central. He trained at leading institutions in India and the USA.",
                "gender": "M",
                "email": "arjun.mehta@healthmate.com",
                "phone": "+91-98765-43212",
                "consultation_fee": 1400.00,
                "availability_status": "available",
                "photo_url": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&q=80",
                "rating": 4.9,
                "total_reviews": 287,
                "is_featured": True,
            },
            {
                "department_name": "Neurology",
                "first_name": "Deepa",
                "last_name": "Krishnan",
                "specialization": "Epilepsy & Movement Disorders",
                "qualification": "MBBS, MD (Neurology), DM (Neurology)",
                "experience_years": 10,
                "bio": "Dr. Deepa Krishnan has expertise in managing epilepsy, Parkinson's disease, and other movement disorders. She focuses on comprehensive patient education and developing personalized treatment plans.",
                "gender": "F",
                "email": "deepa.krishnan@healthmate.com",
                "phone": "+91-98765-43213",
                "consultation_fee": 1100.00,
                "availability_status": "available",
                "photo_url": "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80",
                "rating": 4.7,
                "total_reviews": 194,
                "is_featured": False,
            },
            # Orthopedics
            {
                "department_name": "Orthopedics",
                "first_name": "Vikram",
                "last_name": "Singh",
                "specialization": "Joint Replacement & Sports Medicine",
                "qualification": "MBBS, MS (Orthopedics), Fellowship in Joint Replacement (Germany)",
                "experience_years": 20,
                "bio": "Dr. Vikram Singh is our head of orthopedics with over 20 years of surgical experience. He has performed more than 3,000 joint replacement surgeries and has a special interest in sports medicine, treating both professional athletes and recreational enthusiasts.",
                "gender": "M",
                "email": "vikram.singh@healthmate.com",
                "phone": "+91-98765-43214",
                "consultation_fee": 1500.00,
                "availability_status": "available",
                "photo_url": "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&q=80",
                "rating": 4.8,
                "total_reviews": 412,
                "is_featured": True,
            },
            {
                "department_name": "Orthopedics",
                "first_name": "Anita",
                "last_name": "Patel",
                "specialization": "Spine Surgery & Minimally Invasive Orthopedics",
                "qualification": "MBBS, MS (Orthopedics), Fellowship in Spine Surgery (UK)",
                "experience_years": 14,
                "bio": "Dr. Anita Patel is a leading spine surgeon who uses the latest minimally invasive techniques to treat back pain, disc herniation, and spinal deformities. Her patients benefit from faster recovery and fewer complications.",
                "gender": "F",
                "email": "anita.patel@healthmate.com",
                "phone": "+91-98765-43215",
                "consultation_fee": 1300.00,
                "availability_status": "available",
                "photo_url": "https://images.unsplash.com/photo-1607990283143-e81e7a2c9349?w=400&q=80",
                "rating": 4.8,
                "total_reviews": 256,
                "is_featured": False,
            },
            # Pediatrics
            {
                "department_name": "Pediatrics",
                "first_name": "Sunita",
                "last_name": "Rao",
                "specialization": "General Pediatrics & Neonatology",
                "qualification": "MBBS, MD (Pediatrics), Fellowship in Neonatology",
                "experience_years": 16,
                "bio": "Dr. Sunita Rao is a warm and caring pediatrician who has dedicated her career to child health. She leads our neonatal intensive care unit and has a special interest in newborn care, developmental pediatrics, and childhood immunization.",
                "gender": "F",
                "email": "sunita.rao@healthmate.com",
                "phone": "+91-98765-43216",
                "consultation_fee": 800.00,
                "availability_status": "available",
                "photo_url": "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&q=80",
                "rating": 4.9,
                "total_reviews": 523,
                "is_featured": True,
            },
            # Oncology
            {
                "department_name": "Oncology",
                "first_name": "Rajan",
                "last_name": "Gupta",
                "specialization": "Medical Oncology & Immunotherapy",
                "qualification": "MBBS, MD (Internal Medicine), DM (Medical Oncology), ESMO Member",
                "experience_years": 17,
                "bio": "Dr. Rajan Gupta is a compassionate oncologist who stays at the forefront of cancer treatment advances. He specializes in personalized cancer therapy, immunotherapy, and targeted treatment approaches for solid tumors.",
                "gender": "M",
                "email": "rajan.gupta@healthmate.com",
                "phone": "+91-98765-43217",
                "consultation_fee": 2000.00,
                "availability_status": "available",
                "photo_url": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80",
                "rating": 4.9,
                "total_reviews": 198,
                "is_featured": True,
            },
            # Emergency
            {
                "department_name": "Emergency Medicine",
                "first_name": "Kiran",
                "last_name": "Bose",
                "specialization": "Emergency Medicine & Trauma Care",
                "qualification": "MBBS, MD (Emergency Medicine), ATLS Certified",
                "experience_years": 11,
                "bio": "Dr. Kiran Bose leads our emergency department with calm expertise under pressure. He has trained in advanced trauma life support and has handled hundreds of critical cases annually.",
                "gender": "M",
                "email": "kiran.bose@healthmate.com",
                "phone": "+91-98765-43218",
                "consultation_fee": 1000.00,
                "availability_status": "available",
                "photo_url": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&q=80",
                "rating": 4.7,
                "total_reviews": 147,
                "is_featured": False,
            },
            # Gastroenterology
            {
                "department_name": "Gastroenterology",
                "first_name": "Meera",
                "last_name": "Joshi",
                "specialization": "Hepatology & Endoscopy",
                "qualification": "MBBS, MD (Gastroenterology), DM (Gastroenterology)",
                "experience_years": 13,
                "bio": "Dr. Meera Joshi is an expert gastroenterologist specializing in liver diseases and advanced endoscopic procedures. She performs therapeutic endoscopies and has expertise in managing chronic hepatitis and liver cirrhosis.",
                "gender": "F",
                "email": "meera.joshi@healthmate.com",
                "phone": "+91-98765-43219",
                "consultation_fee": 1200.00,
                "availability_status": "available",
                "photo_url": "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=400&q=80",
                "rating": 4.8,
                "total_reviews": 231,
                "is_featured": False,
            },
            # Dermatology
            {
                "department_name": "Dermatology",
                "first_name": "Aisha",
                "last_name": "Khan",
                "specialization": "Medical & Cosmetic Dermatology",
                "qualification": "MBBS, MD (Dermatology & Venereology)",
                "experience_years": 9,
                "bio": "Dr. Aisha Khan combines medical excellence with an aesthetic eye. She treats a wide range of skin conditions and is particularly skilled in laser treatments, chemical peels, and non-surgical cosmetic procedures.",
                "gender": "F",
                "email": "aisha.khan@healthmate.com",
                "phone": "+91-98765-43220",
                "consultation_fee": 1000.00,
                "availability_status": "available",
                "photo_url": "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&q=80",
                "rating": 4.7,
                "total_reviews": 312,
                "is_featured": False,
            },
        ]

        for doc_data in doctors_data:
            dept_name = doc_data.pop("department_name")
            try:
                dept = Department.objects.get(name=dept_name)
                doctor, created = Doctor.objects.get_or_create(
                    email=doc_data["email"],
                    defaults={**doc_data, "department": dept}
                )
                if created:
                    # Create schedule
                    self._create_schedule(doctor)
                    self.stdout.write(f"  ✓ Created doctor: {doctor.full_name}")
            except Department.DoesNotExist:
                self.stdout.write(self.style.ERROR(f"  ✗ Department {dept_name} not found"))

    def _create_schedule(self, doctor):
        """Create a typical Mon-Fri or Mon-Sat schedule for a doctor."""
        import random
        schedule_type = random.choice(["mon_fri", "mon_sat"])
        days = [0, 1, 2, 3, 4] if schedule_type == "mon_fri" else [0, 1, 2, 3, 4, 5]

        morning_doctors = doctor.id % 2 == 0
        start = time(9, 0) if morning_doctors else time(14, 0)
        end = time(13, 0) if morning_doctors else time(18, 0)

        for day in days:
            DoctorSchedule.objects.get_or_create(
                doctor=doctor,
                day_of_week=day,
                defaults={"start_time": start, "end_time": end, "max_appointments": 15}
            )

    def _create_testimonials(self):
        testimonials_data = [
            {
                "patient_name": "Anjali Verma",
                "rating": 5,
                "review": "Dr. Sharma saved my father's life! He had a massive heart attack and Dr. Sharma performed an emergency angioplasty. The entire team was incredibly professional and compassionate. We are forever grateful to HealthMate Central.",
                "doctor_email": "rajesh.sharma@healthmate.com",
                "department_name": "Cardiology",
                "is_featured": True,
            },
            {
                "patient_name": "Suresh Pillai",
                "rating": 5,
                "review": "After suffering a stroke, I was terrified. Dr. Mehta and his team acted swiftly and I made a near-complete recovery. The stroke unit here is world-class. I can walk again, and I owe it to this hospital.",
                "doctor_email": "arjun.mehta@healthmate.com",
                "department_name": "Neurology",
                "is_featured": True,
            },
            {
                "patient_name": "Rekha Desai",
                "rating": 5,
                "review": "My knee replacement with Dr. Singh was the best decision I made. At 65, I was worried about surgery. Dr. Singh was patient, explained everything, and now at 3 months post-surgery I'm walking without pain for the first time in years!",
                "doctor_email": "vikram.singh@healthmate.com",
                "department_name": "Orthopedics",
                "is_featured": True,
            },
            {
                "patient_name": "Manish Kumar",
                "rating": 5,
                "review": "My daughter was diagnosed with leukemia at age 8. Dr. Gupta was a pillar of strength for our entire family. His treatment protocol worked beautifully and my daughter is now in remission. We can never thank him enough.",
                "doctor_email": "rajan.gupta@healthmate.com",
                "department_name": "Oncology",
                "is_featured": True,
            },
            {
                "patient_name": "Fatima Sheikh",
                "rating": 5,
                "review": "Dr. Sunita Rao has been our family pediatrician for 5 years. She's absolutely wonderful with kids — my toddler actually looks forward to doctor visits! Her knowledge and patience are remarkable.",
                "doctor_email": "sunita.rao@healthmate.com",
                "department_name": "Pediatrics",
                "is_featured": True,
            },
            {
                "patient_name": "Rohit Agarwal",
                "rating": 4,
                "review": "The dermatology team at HealthMate is excellent. Dr. Khan diagnosed my stubborn skin condition correctly when three other doctors couldn't. The treatment worked within 6 weeks. Very satisfied.",
                "doctor_email": "aisha.khan@healthmate.com",
                "department_name": "Dermatology",
                "is_featured": True,
            },
        ]

        for data in testimonials_data:
            doctor_email = data.pop("doctor_email")
            dept_name = data.pop("department_name")

            try:
                doctor = Doctor.objects.get(email=doctor_email)
                dept = Department.objects.get(name=dept_name)
                testimonial, created = Testimonial.objects.get_or_create(
                    patient_name=data["patient_name"],
                    defaults={**data, "doctor": doctor, "department": dept}
                )
                if created:
                    self.stdout.write(f"  ✓ Created testimonial from: {testimonial.patient_name}")
            except (Doctor.DoesNotExist, Department.DoesNotExist):
                pass

    def _create_blog_posts(self):
        posts_data = [
            {
                "title": "10 Warning Signs of a Heart Attack You Should Never Ignore",
                "excerpt": "Heart attacks don't always look like the dramatic chest-clutching scenes from movies. Learn the subtle warning signs that could save your life.",
                "content": "...",
                "category": "Heart Health",
                "author_email": "rajesh.sharma@healthmate.com",
                "image_url": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80",
            },
            {
                "title": "Understanding Stroke: Act FAST and Save a Life",
                "excerpt": "Every minute counts during a stroke. The FAST acronym — Face, Arms, Speech, Time — can help you recognize stroke symptoms and get help immediately.",
                "content": "...",
                "category": "Brain & Neurology",
                "author_email": "arjun.mehta@healthmate.com",
                "image_url": "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80",
            },
            {
                "title": "When to Consider Joint Replacement Surgery",
                "excerpt": "Chronic joint pain affecting your quality of life? Learn how to know when conservative treatments have run their course and surgery might be the right option.",
                "content": "...",
                "category": "Bone & Joint",
                "author_email": "vikram.singh@healthmate.com",
                "image_url": "https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80",
            },
            {
                "title": "Childhood Vaccination Schedule: What Every Parent Needs to Know",
                "excerpt": "Vaccines protect children from serious diseases. Here's a clear, updated guide to the recommended vaccination schedule from birth through adolescence.",
                "content": "...",
                "category": "Child Health",
                "author_email": "sunita.rao@healthmate.com",
                "image_url": "https://images.unsplash.com/photo-1581595219315-a187dd40c322?w=800&q=80",
            },
            {
                "title": "Early Cancer Detection: Why Screenings Save Lives",
                "excerpt": "Many cancers are highly treatable when caught early. This guide explains which cancer screenings are recommended by age and why they're worth prioritizing.",
                "content": "...",
                "category": "Cancer Care",
                "author_email": "rajan.gupta@healthmate.com",
                "image_url": "https://images.unsplash.com/photo-1631217872822-7e41e8d3de8a?w=800&q=80",
            },
            {
                "title": "Managing IBS: Practical Diet and Lifestyle Tips",
                "excerpt": "Irritable Bowel Syndrome affects millions. While there's no cure, thoughtful dietary changes and stress management can dramatically improve your quality of life.",
                "content": "...",
                "category": "Digestive Health",
                "author_email": "meera.joshi@healthmate.com",
                "image_url": "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&q=80",
            },
        ]

        for post_data in posts_data:
            author_email = post_data.pop("author_email")
            try:
                author = Doctor.objects.get(email=author_email)
                slug = slugify(post_data["title"])
                post, created = BlogPost.objects.get_or_create(
                    slug=slug,
                    defaults={**post_data, "author": author}
                )
                if created:
                    self.stdout.write(f"  ✓ Created blog post: {post.title[:50]}...")
            except Doctor.DoesNotExist:
                pass
