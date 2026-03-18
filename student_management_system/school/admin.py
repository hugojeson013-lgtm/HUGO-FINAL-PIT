# admin.py
from django.contrib import admin
from .models import Student, Teacher, Course, Enrollment


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['student_id', 'first_name', 'last_name', 'email', 'status', 'enrollment_date']
    list_filter = ['status', 'enrollment_date']
    search_fields = ['first_name', 'last_name', 'email']
    ordering = ['last_name', 'first_name']


@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ['teacher_id', 'first_name', 'last_name', 'email', 'department', 'hire_date']
    list_filter = ['department', 'hire_date']
    search_fields = ['first_name', 'last_name', 'email', 'department']
    ordering = ['last_name', 'first_name']


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['course_id', 'course_code', 'course_name', 'teacher', 'credits', 'semester']
    list_filter = ['semester', 'credits']
    search_fields = ['course_code', 'course_name', 'teacher__first_name', 'teacher__last_name']
    ordering = ['course_code']


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ['enrollment_id', 'student', 'course', 'enrollment_date', 'grade', 'status']
    list_filter = ['status', 'enrollment_date']
    search_fields = ['student__first_name', 'student__last_name', 'course__course_code', 'course__course_name']
    ordering = ['-enrollment_date']
