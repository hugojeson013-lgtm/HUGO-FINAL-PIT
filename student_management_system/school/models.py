# models.py
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class Teacher(models.Model):
    """Teacher model - stores teacher information"""
    teacher_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(max_length=150, unique=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    department = models.CharField(max_length=100, blank=True, null=True)
    specialization = models.CharField(max_length=50, blank=True, null=True)
    hire_date = models.DateField()

    class Meta:
        db_table = 'teacher'
        ordering = ['last_name', 'first_name']

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Student(models.Model):
    """Student model - stores student information"""
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('graduated', 'Graduated'),
    ]

    student_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(max_length=150, unique=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    enrollment_date = models.DateField()
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='active'
    )

    class Meta:
        db_table = 'student'
        ordering = ['last_name', 'first_name']

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Course(models.Model):
    """Course model - stores course information"""
    course_id = models.AutoField(primary_key=True)
    course_name = models.CharField(max_length=150)
    course_code = models.CharField(max_length=20, unique=True)
    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.SET_NULL,
        null=True,
        related_name='courses'
    )
    description = models.TextField(blank=True, null=True)
    credits = models.IntegerField(validators=[MinValueValidator(1)])
    max_capacity = models.IntegerField(default=30)
    semester = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        db_table = 'course'
        ordering = ['course_code']

    def __str__(self):
        return f"{self.course_code} - {self.course_name}"


class Enrollment(models.Model):
    """Enrollment model - junction table for students and courses"""
    ENROLLMENT_STATUS_CHOICES = [
        ('enrolled', 'Enrolled'),
        ('completed', 'Completed'),
        ('dropped', 'Dropped'),
        ('failed', 'Failed'),
    ]

    enrollment_id = models.AutoField(primary_key=True)
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name='enrollments'
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='enrollments'
    )
    enrollment_date = models.DateField(auto_now_add=True)
    grade = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        blank=True,
        null=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    status = models.CharField(
        max_length=10,
        choices=ENROLLMENT_STATUS_CHOICES,
        default='enrolled'
    )

    class Meta:
        db_table = 'enrollment'
        unique_together = ['student', 'course']
        ordering = ['-enrollment_date']

    def __str__(self):
        return f"{self.student} enrolled in {self.course}"
