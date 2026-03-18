# urls.py
from django.urls import path
from . import views

urlpatterns = [
    # Student URLs
    path('students/', views.student_list, name='student_list'),
    path('students/create/', views.student_create, name='student_create'),
    path('students/<int:pk>/', views.student_detail, name='student_detail'),
    path('students/<int:pk>/delete/', views.student_delete, name='student_delete'),
    
    # Teacher URLs
    path('teachers/', views.teacher_list, name='teacher_list'),
    path('teachers/create/', views.teacher_create, name='teacher_create'),
    path('teachers/<int:pk>/', views.teacher_detail, name='teacher_detail'),
    path('teachers/<int:pk>/delete/', views.teacher_delete, name='teacher_delete'),
    
    # Course URLs
    path('courses/', views.course_list, name='course_list'),
    path('courses/create/', views.course_create, name='course_create'),
    path('courses/<int:pk>/', views.course_detail, name='course_detail'),
    path('courses/<int:pk>/delete/', views.course_delete, name='course_delete'),
    
    # Enrollment URLs
    path('enrollments/', views.enrollment_list, name='enrollment_list'),
    path('enrollments/create/', views.enrollment_create, name='enrollment_create'),
    path('enrollments/<int:pk>/', views.enrollment_detail, name='enrollment_detail'),
    path('enrollments/<int:pk>/delete/', views.enrollment_delete, name='enrollment_delete'),
    
    # Update URLs
    path('students/<int:pk>/update/', views.student_update, name='student_update'),
    path('teachers/<int:pk>/update/', views.teacher_update, name='teacher_update'),
    path('courses/<int:pk>/update/', views.course_update, name='course_update'),
    path('enrollments/<int:pk>/update/', views.enrollment_update, name='enrollment_update'),

]
