from django.urls import include, path
from rest_framework.routers import DefaultRouter
from . import api_views

router = DefaultRouter()
router.register(r'students', api_views.StudentViewSet, basename='student')
router.register(r'teachers', api_views.TeacherViewSet, basename='teacher')
router.register(r'courses', api_views.CourseViewSet, basename='course')
router.register(r'enrollments', api_views.EnrollmentViewSet, basename='enrollment')

urlpatterns = [
    path('', include(router.urls)),
]
