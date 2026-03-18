// Types matching Django REST API models exactly

export interface Teacher {
  teacher_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  department?: string;
  specialization?: string;
  hire_date: string;
}

export interface Student {
  student_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  enrollment_date: string;
  status: 'active' | 'inactive' | 'graduated';
}

export interface Course {
  course_id: number;
  course_name: string;
  course_code: string;
  teacher: number | null;
  description?: string;
  credits: number;
  max_capacity: number;
  semester?: string;
}

export interface Enrollment {
  enrollment_id: number;
  student: number;
  course: number;
  enrollment_date: string;
  grade?: number | null;
  status: 'enrolled' | 'completed' | 'dropped' | 'failed';
}

export type ActivePage = 'dashboard' | 'students' | 'teachers' | 'courses' | 'enrollments';
