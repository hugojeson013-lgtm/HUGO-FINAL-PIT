# views.py
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.db.models import Q
from .models import Student, Teacher, Course, Enrollment


# ============= STUDENT VIEWS =============

def student_list(request):
    """READ: Display all students"""
    students = Student.objects.all()
    return render(request, 'students/student_list.html', {'students': students})


def student_create(request):
    """CREATE: Add a new student"""
    if request.method == 'POST':
        student = Student.objects.create(
            first_name=request.POST['first_name'],
            last_name=request.POST['last_name'],
            email=request.POST['email'],
            phone=request.POST.get('phone', ''),
            date_of_birth=request.POST.get('date_of_birth') or None,
            enrollment_date=request.POST['enrollment_date'],
            status=request.POST.get('status', 'active')
        )
        messages.success(request, f'Student {student} created successfully!')
        return redirect('student_list')
    
    return render(request, 'students/student_form.html')


def student_detail(request, pk):
    """READ: Display single student details"""
    student = get_object_or_404(Student, pk=pk)
    enrollments = student.enrollments.all()
    return render(request, 'students/student_detail.html', {
        'student': student,
        'enrollments': enrollments
    })


def student_delete(request, pk):
    """DELETE: Remove a student"""
    student = get_object_or_404(Student, pk=pk)
    if request.method == 'POST':
        student_name = str(student)
        student.delete()
        messages.success(request, f'Student {student_name} deleted successfully!')
        return redirect('student_list')
    
    return render(request, 'students/student_confirm_delete.html', {'student': student})


# ============= TEACHER VIEWS =============

def teacher_list(request):
    """READ: Display all teachers"""
    teachers = Teacher.objects.all()
    return render(request, 'teachers/teacher_list.html', {'teachers': teachers})


def teacher_create(request):
    """CREATE: Add a new teacher"""
    if request.method == 'POST':
        teacher = Teacher.objects.create(
            first_name=request.POST['first_name'],
            last_name=request.POST['last_name'],
            email=request.POST['email'],
            phone=request.POST.get('phone', ''),
            department=request.POST.get('department', ''),
            specialization=request.POST.get('specialization', ''),
            hire_date=request.POST['hire_date']
        )
        messages.success(request, f'Teacher {teacher} created successfully!')
        return redirect('teacher_list')
    
    return render(request, 'teachers/teacher_form.html')


def teacher_detail(request, pk):
    """READ: Display single teacher details"""
    teacher = get_object_or_404(Teacher, pk=pk)
    courses = teacher.courses.all()
    return render(request, 'teachers/teacher_detail.html', {
        'teacher': teacher,
        'courses': courses
    })


def teacher_delete(request, pk):
    """DELETE: Remove a teacher"""
    teacher = get_object_or_404(Teacher, pk=pk)
    if request.method == 'POST':
        teacher_name = str(teacher)
        teacher.delete()
        messages.success(request, f'Teacher {teacher_name} deleted successfully!')
        return redirect('teacher_list')
    
    return render(request, 'teachers/teacher_confirm_delete.html', {'teacher': teacher})


# ============= COURSE VIEWS =============

def course_list(request):
    """READ: Display all courses"""
    courses = Course.objects.select_related('teacher').all()
    return render(request, 'courses/course_list.html', {'courses': courses})


def course_create(request):
    """CREATE: Add a new course"""
    if request.method == 'POST':
        teacher_id = request.POST.get('teacher_id')
        teacher = None
        if teacher_id:
            teacher = get_object_or_404(Teacher, pk=teacher_id)
        
        course = Course.objects.create(
            course_name=request.POST['course_name'],
            course_code=request.POST['course_code'],
            teacher=teacher,
            description=request.POST.get('description', ''),
            credits=request.POST['credits'],
            max_capacity=request.POST.get('max_capacity', 30),
            semester=request.POST.get('semester', '')
        )
        messages.success(request, f'Course {course} created successfully!')
        return redirect('course_list')
    
    teachers = Teacher.objects.all()
    return render(request, 'courses/course_form.html', {'teachers': teachers})


def course_detail(request, pk):
    """READ: Display single course details"""
    course = get_object_or_404(Course, pk=pk)
    enrollments = course.enrollments.select_related('student').all()
    return render(request, 'courses/course_detail.html', {
        'course': course,
        'enrollments': enrollments
    })


def course_delete(request, pk):
    """DELETE: Remove a course"""
    course = get_object_or_404(Course, pk=pk)
    if request.method == 'POST':
        course_name = str(course)
        course.delete()
        messages.success(request, f'Course {course_name} deleted successfully!')
        return redirect('course_list')
    
    return render(request, 'courses/course_confirm_delete.html', {'course': course})


# ============= ENROLLMENT VIEWS =============

def enrollment_list(request):
    """READ: Display all enrollments"""
    enrollments = Enrollment.objects.select_related('student', 'course').all()
    return render(request, 'enrollments/enrollment_list.html', {'enrollments': enrollments})


def enrollment_create(request):
    """CREATE: Enroll a student in a course"""
    if request.method == 'POST':
        student = get_object_or_404(Student, pk=request.POST['student_id'])
        course = get_object_or_404(Course, pk=request.POST['course_id'])
        
        # Check if enrollment already exists
        if Enrollment.objects.filter(student=student, course=course).exists():
            messages.error(request, f'{student} is already enrolled in {course}!')
            return redirect('enrollment_create')
        
        enrollment = Enrollment.objects.create(
            student=student,
            course=course,
            status=request.POST.get('status', 'enrolled')
        )
        messages.success(request, f'{student} enrolled in {course} successfully!')
        return redirect('enrollment_list')
    
    students = Student.objects.filter(status='active')
    courses = Course.objects.all()
    return render(request, 'enrollments/enrollment_form.html', {
        'students': students,
        'courses': courses
    })


def enrollment_detail(request, pk):
    """READ: Display single enrollment details"""
    enrollment = get_object_or_404(Enrollment, pk=pk)
    return render(request, 'enrollments/enrollment_detail.html', {'enrollment': enrollment})


def enrollment_delete(request, pk):
    """DELETE: Remove an enrollment"""
    enrollment = get_object_or_404(Enrollment, pk=pk)
    if request.method == 'POST':
        enrollment_info = str(enrollment)
        enrollment.delete()
        messages.success(request, f'Enrollment "{enrollment_info}" deleted successfully!')
        return redirect('enrollment_list')
    
    return render(request, 'enrollments/enrollment_confirm_delete.html', {'enrollment': enrollment})



def student_update(request, pk):
    """UPDATE: Edit a student"""
    student = get_object_or_404(Student, pk=pk)
    if request.method == 'POST':
        student.first_name = request.POST['first_name']
        student.last_name = request.POST['last_name']
        student.email = request.POST['email']
        student.phone = request.POST.get('phone', '')
        student.date_of_birth = request.POST.get('date_of_birth') or None
        student.enrollment_date = request.POST['enrollment_date']
        student.status = request.POST.get('status', 'active')
        student.save()
        messages.success(request, f'Student {student} updated successfully!')
        return redirect('student_list')
    return render(request, 'students/student_form.html', {'student': student})

# ============= UPDATE =============

def teacher_update(request, pk):
    """UPDATE: Edit a teacher"""
    teacher = get_object_or_404(Teacher, pk=pk)
    if request.method == 'POST':
        teacher.first_name = request.POST['first_name']
        teacher.last_name = request.POST['last_name']
        teacher.email = request.POST['email']
        teacher.phone = request.POST.get('phone', '')
        teacher.department = request.POST.get('department', '')
        teacher.specialization = request.POST.get('specialization', '')
        teacher.hire_date = request.POST['hire_date']
        teacher.save()
        messages.success(request, f'Teacher {teacher} updated successfully!')
        return redirect('teacher_list')
    return render(request, 'teachers/teacher_form.html', {'teacher': teacher})


def course_update(request, pk):
    """UPDATE: Edit a course"""
    course = get_object_or_404(Course, pk=pk)
    if request.method == 'POST':
        teacher_id = request.POST.get('teacher_id')
        course.teacher = get_object_or_404(Teacher, pk=teacher_id) if teacher_id else None
        course.course_name = request.POST['course_name']
        course.course_code = request.POST['course_code']
        course.description = request.POST.get('description', '')
        course.credits = request.POST['credits']
        course.max_capacity = request.POST.get('max_capacity', 30)
        course.semester = request.POST.get('semester', '')
        course.save()
        messages.success(request, f'Course {course} updated successfully!')
        return redirect('course_list')
    teachers = Teacher.objects.all()
    return render(request, 'courses/course_form.html', {'course': course, 'teachers': teachers})


def enrollment_update(request, pk):
    """UPDATE: Edit an enrollment"""
    enrollment = get_object_or_404(Enrollment, pk=pk)
    if request.method == 'POST':
        enrollment.status = request.POST.get('status', 'enrolled')
        enrollment.save()
        messages.success(request, f'Enrollment updated successfully!')
        return redirect('enrollment_list')
    return render(request, 'enrollments/enrollment_form.html', {'enrollment': enrollment})
