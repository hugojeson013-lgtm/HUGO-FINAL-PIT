import { Teacher, Student, Course, Enrollment } from '../types';

// Read API base URL from environment so frontend can be pointed at
// a local Django server (e.g. REACT_APP_API_URL=http://127.0.0.1:8000/api)
// Fallback to a relative `/api` so the app also works when the backend
// is proxied to the same host in production.
const BASE_URL = (process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.replace(/\/$/, '')) || '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return {} as T;
  return res.json();
}

// ── Students ──────────────────────────────────────────────
export const studentApi = {
  list: () => request<Student[]>('/students/'),
  get: (id: number) => request<Student>(`/students/${id}/`),
  create: (data: Omit<Student, 'student_id'>) =>
    request<Student>('/students/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Student>) =>
    request<Student>(`/students/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/students/${id}/`, { method: 'DELETE' }),
};

// ── Teachers ──────────────────────────────────────────────
export const teacherApi = {
  list: () => request<Teacher[]>('/teachers/'),
  get: (id: number) => request<Teacher>(`/teachers/${id}/`),
  create: (data: Omit<Teacher, 'teacher_id'>) =>
    request<Teacher>('/teachers/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Teacher>) =>
    request<Teacher>(`/teachers/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/teachers/${id}/`, { method: 'DELETE' }),
};

// ── Courses ───────────────────────────────────────────────
export const courseApi = {
  list: () => request<Course[]>('/courses/'),
  get: (id: number) => request<Course>(`/courses/${id}/`),
  create: (data: Omit<Course, 'course_id'>) =>
    request<Course>('/courses/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Course>) =>
    request<Course>(`/courses/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/courses/${id}/`, { method: 'DELETE' }),
};

// ── Enrollments ───────────────────────────────────────────
export const enrollmentApi = {
  list: () => request<Enrollment[]>('/enrollments/'),
  get: (id: number) => request<Enrollment>(`/enrollments/${id}/`),
  create: (data: Omit<Enrollment, 'enrollment_id' | 'enrollment_date'>) =>
    request<Enrollment>('/enrollments/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Enrollment>) =>
    request<Enrollment>(`/enrollments/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<void>(`/enrollments/${id}/`, { method: 'DELETE' }),
};
