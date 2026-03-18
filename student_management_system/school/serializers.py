from rest_framework import serializers
from .models import Student, Teacher, Course, Enrollment


class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = [
            'teacher_id', 'first_name', 'last_name', 'email', 'phone',
            'department', 'specialization', 'hire_date'
        ]


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = [
            'student_id', 'first_name', 'last_name', 'email', 'phone',
            'date_of_birth', 'enrollment_date', 'status'
        ]


class CourseSerializer(serializers.ModelSerializer):
    teacher = serializers.PrimaryKeyRelatedField(
        queryset=Teacher.objects.all(), allow_null=True
    )

    class Meta:
        model = Course
        fields = [
            'course_id', 'course_name', 'course_code', 'teacher',
            'description', 'credits', 'max_capacity', 'semester'
        ]


class EnrollmentSerializer(serializers.ModelSerializer):
    student = serializers.PrimaryKeyRelatedField(queryset=Student.objects.all())
    course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all())

    class Meta:
        model = Enrollment
        fields = [
            'enrollment_id', 'enrollment_date', 'student', 'course', 'grade', 'status'
        ]
