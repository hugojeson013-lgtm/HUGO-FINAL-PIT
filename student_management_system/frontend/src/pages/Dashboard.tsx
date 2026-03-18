import React from 'react';
import { Student, Teacher, Course, Enrollment, ActivePage } from '../types';

interface DashboardProps {
  students: Student[];
  teachers: Teacher[];
  courses: Course[];
  enrollments: Enrollment[];
  onNavigate: (page: ActivePage) => void;
}

export default function Dashboard({ students, teachers, courses, enrollments, onNavigate }: DashboardProps) {
  const activeStudents = students.filter(s => s.status === 'active').length;
  const enrolledCount = enrollments.filter(e => e.status === 'enrolled').length;
  const completedCount = enrollments.filter(e => e.status === 'completed').length;

  const stats = [
    { label: 'Total Students', value: students.length, sub: `${activeStudents} active`, icon: '🎓', color: 'bg-teal-50 border-teal-200', iconBg: 'bg-teal-100', nav: 'students' as ActivePage },
    { label: 'Total Teachers', value: teachers.length, sub: 'Faculty members', icon: '👩‍🏫', color: 'bg-emerald-50 border-emerald-200', iconBg: 'bg-emerald-100', nav: 'teachers' as ActivePage },
    { label: 'Total Courses', value: courses.length, sub: 'Available courses', icon: '📚', color: 'bg-amber-50 border-amber-200', iconBg: 'bg-amber-100', nav: 'courses' as ActivePage },
    { label: 'Enrollments', value: enrollments.length, sub: `${enrolledCount} active`, icon: '📋', color: 'bg-cyan-50 border-cyan-200', iconBg: 'bg-cyan-100', nav: 'enrollments' as ActivePage },
  ];

  const recentStudents = [...students].slice(-5).reverse();
  const recentEnrollments = [...enrollments].slice(-5).reverse();

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-slate-500 text-sm mt-1">Welcome back! Here's an overview of your system.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <button
            key={s.label}
            onClick={() => onNavigate(s.nav)}
            className={`text-left p-5 rounded-2xl border-2 ${s.color} hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer`}
          >
            <div className={`w-11 h-11 ${s.iconBg} rounded-xl flex items-center justify-center text-xl mb-3`}>{s.icon}</div>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{s.label}</p>
            <p className="text-slate-800 text-3xl font-bold mt-1">{s.value}</p>
            <p className="text-slate-400 text-xs mt-1">{s.sub}</p>
          </button>
        ))}
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Active Enrollments', value: enrolledCount, color: 'text-teal-600', bg: 'bg-teal-50' },
          { label: 'Completed', value: completedCount, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Dropped / Failed', value: enrollments.filter(e => e.status === 'dropped' || e.status === 'failed').length, color: 'text-red-600', bg: 'bg-red-50' },
        ].map(item => (
          <div key={item.label} className={`${item.bg} rounded-2xl p-4 flex items-center gap-4`}>
            <p className={`text-3xl font-bold ${item.color}`}>{item.value}</p>
            <p className="text-slate-600 text-sm font-medium">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Tables row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Students */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Recent Students</h3>
            <button onClick={() => onNavigate('students')} className="text-teal-600 text-xs font-semibold hover:underline bg-transparent border-0 cursor-pointer">View all →</button>
          </div>
          <table className="w-full">
            <tbody>
              {recentStudents.length === 0 ? (
                <tr><td className="px-5 py-8 text-center text-slate-400 text-sm">No students yet</td></tr>
              ) : recentStudents.map(s => (
                <tr key={s.student_id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-sm font-bold text-teal-600">
                        {s.first_name[0]}{s.last_name[0]}
                      </div>
                      <div>
                        <p className="text-slate-800 text-sm font-medium">{s.first_name} {s.last_name}</p>
                        <p className="text-slate-400 text-xs">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold
                      ${s.status === 'active' ? 'bg-emerald-100 text-emerald-700' : s.status === 'graduated' ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-600'}`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Enrollments */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Recent Enrollments</h3>
            <button onClick={() => onNavigate('enrollments')} className="text-teal-600 text-xs font-semibold hover:underline bg-transparent border-0 cursor-pointer">View all →</button>
          </div>
          <table className="w-full">
            <tbody>
              {recentEnrollments.length === 0 ? (
                <tr><td className="px-5 py-8 text-center text-slate-400 text-sm">No enrollments yet</td></tr>
              ) : recentEnrollments.map(e => {
                const student = students.find(s => s.student_id === e.student);
                const course = courses.find(c => c.course_id === e.course);
                return (
                  <tr key={e.enrollment_id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="text-slate-800 text-sm font-medium">{student ? `${student.first_name} ${student.last_name}` : `Student #${e.student}`}</p>
                      <p className="text-slate-400 text-xs">{course ? course.course_code : `Course #${e.course}`}</p>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold
                        ${e.status === 'enrolled' ? 'bg-teal-100 text-teal-700'
                          : e.status === 'completed' ? 'bg-emerald-100 text-emerald-700'
                          : e.status === 'dropped' ? 'bg-slate-100 text-slate-600'
                          : 'bg-red-100 text-red-700'}`}>
                        {e.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
