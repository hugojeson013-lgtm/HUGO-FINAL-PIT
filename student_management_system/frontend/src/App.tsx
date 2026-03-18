import React, { useState, useEffect, useCallback } from 'react';
import { Student, Teacher, Course, Enrollment, ActivePage } from './types';
import { studentApi, teacherApi, courseApi, enrollmentApi } from './services/api';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Courses from './pages/Courses';
import Enrollments from './pages/Enrollments';

interface ToastState { message: string; type: 'success' | 'error'; }

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setError(null);
      const [s, t, c, e] = await Promise.all([
        studentApi.list(), teacherApi.list(), courseApi.list(), enrollmentApi.list()
      ]);
      setStudents(s); setTeachers(t); setCourses(c); setEnrollments(e);
    } catch (err: any) {
      setError('Cannot connect to the Django backend. Make sure it is running on http://127.0.0.1:8000');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  function showToast(message: string, type: 'success' | 'error') {
    setToast({ message, type });
  }

  const pageProps = { onRefresh: fetchAll, onToast: showToast };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar active={activePage} onNavigate={setActivePage} />

      {/* Main */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm capitalize">{activePage}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
              🟢 API: 127.0.0.1:8000
            </span>
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">A</div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-8 py-6">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                <p className="text-slate-500 text-sm">Loading data...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-32">
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 max-w-lg text-center">
                <div className="text-4xl mb-3">⚠️</div>
                <h3 className="text-red-800 font-bold text-lg mb-2">Backend Connection Error</h3>
                <p className="text-red-600 text-sm mb-4">{error}</p>
                <button onClick={fetchAll} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors cursor-pointer border-0">
                  Retry Connection
                </button>
              </div>
            </div>
          ) : (
            <>
              {activePage === 'dashboard' && (
                <Dashboard students={students} teachers={teachers} courses={courses} enrollments={enrollments} onNavigate={setActivePage} />
              )}
              {activePage === 'students' && (
                <Students students={students} {...pageProps} />
              )}
              {activePage === 'teachers' && (
                <Teachers teachers={teachers} {...pageProps} />
              )}
              {activePage === 'courses' && (
                <Courses courses={courses} teachers={teachers} {...pageProps} />
              )}
              {activePage === 'enrollments' && (
                <Enrollments enrollments={enrollments} students={students} courses={courses} {...pageProps} />
              )}
            </>
          )}
        </main>

        <footer className="px-8 py-4 border-t border-slate-100 text-xs text-slate-400 text-center">
          Student Management System — Django REST + React TypeScript
        </footer>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
