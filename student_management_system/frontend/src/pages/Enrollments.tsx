import React, { useState } from 'react';
import { Enrollment, Student, Course } from '../types';
import { enrollmentApi } from '../services/api';
import Button from '../components/Button';
import Modal from '../components/Modal';
import ConfirmDelete from '../components/ConfirmDelete';

interface EnrollmentsProps {
  enrollments: Enrollment[];
  students: Student[];
  courses: Course[];
  onRefresh: () => void;
  onToast: (msg: string, type: 'success' | 'error') => void;
}

const emptyForm = { student: 0, course: 0, status: 'enrolled' as Enrollment['status'], grade: null as number | null };

export default function Enrollments({ enrollments, students, courses, onRefresh, onToast }: EnrollmentsProps) {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Enrollment | null>(null);
  const [deleting, setDeleting] = useState<Enrollment | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [viewEnrollment, setViewEnrollment] = useState<Enrollment | null>(null);

  const filtered = enrollments.filter(e => {
    const student = students.find(s => s.student_id === e.student);
    const course = courses.find(c => c.course_id === e.course);
    return `${student?.first_name} ${student?.last_name} ${course?.course_code} ${course?.course_name} ${e.status}`
      .toLowerCase().includes(search.toLowerCase());
  });

  function openCreate() { setForm(emptyForm); setEditing(null); setShowForm(true); }
  function openEdit(e: Enrollment) {
    setForm({ student: e.student, course: e.course, status: e.status, grade: e.grade ?? null });
    setEditing(e); setShowForm(true);
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault(); setLoading(true);
    try {
      if (editing) {
        await enrollmentApi.update(editing.enrollment_id, { status: form.status, grade: form.grade ?? undefined });
        onToast('Enrollment updated!', 'success');
      } else {
        if (!form.student || !form.course) { onToast('Please select student and course', 'error'); setLoading(false); return; }
        await enrollmentApi.create({ student: form.student, course: form.course, status: form.status, grade: form.grade ?? undefined });
        onToast('Enrollment created!', 'success');
      }
      setShowForm(false); onRefresh();
    } catch (err: any) { onToast(err.message || 'Error', 'error'); }
    finally { setLoading(false); }
  }

  async function handleDelete() {
    if (!deleting) return;
    try {
      await enrollmentApi.delete(deleting.enrollment_id);
      onToast('Enrollment deleted!', 'success');
      setDeleting(null); onRefresh();
    } catch (err: any) { onToast(err.message || 'Delete failed', 'error'); }
  }

  const statusColors: Record<string, string> = {
    enrolled: 'bg-teal-100 text-teal-700',
    completed: 'bg-emerald-100 text-emerald-700',
    dropped: 'bg-slate-100 text-slate-600',
    failed: 'bg-red-100 text-red-700',
  };

  const inputClass = "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all";
  const labelClass = "block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Enrollments</h2>
          <p className="text-slate-500 text-sm mt-0.5">{enrollments.length} total enrollments</p>
        </div>
        <Button label="+ New Enrollment" onClick={openCreate} variant="primary" icon="📋" />
      </div>

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        <input type="text" placeholder="Search enrollments..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border-2 border-slate-100 rounded-xl bg-white text-sm focus:outline-none focus:border-teal-300 transition-all" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50 border-b-2 border-slate-200">
              <tr>
                {['ID', 'Student', 'Course', 'Date', 'Grade', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-400">No enrollments found</td></tr>
              ) : filtered.map(e => {
                const student = students.find(s => s.student_id === e.student);
                const course = courses.find(c => c.course_id === e.course);
                return (
                  <tr key={e.enrollment_id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-400 text-sm font-mono">#{e.enrollment_id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-teal-100 rounded-full flex items-center justify-center text-xs font-bold text-teal-600">
                          {student ? `${student.first_name[0]}${student.last_name[0]}` : '?'}
                        </div>
                        <span className="text-slate-800 text-sm font-medium">
                          {student ? `${student.first_name} ${student.last_name}` : `Student #${e.student}`}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {course ? (
                        <div>
                          <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs font-bold font-mono mr-1">{course.course_code}</span>
                          <span className="text-slate-600 text-sm">{course.course_name}</span>
                        </div>
                      ) : <span className="text-slate-400">Course #{e.course}</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-sm">{e.enrollment_date}</td>
                    <td className="px-4 py-3">
                      {e.grade != null ? (
                        <span className="font-bold text-slate-800">{e.grade}</span>
                      ) : <span className="text-slate-400 text-sm">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[e.status] || ''}`}>{e.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button label="View" onClick={() => setViewEnrollment(e)} variant="ghost" size="sm" />
                        <Button label="Edit" onClick={() => openEdit(e)} variant="secondary" size="sm" />
                        <Button label="Delete" onClick={() => setDeleting(e)} variant="danger" size="sm" />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {viewEnrollment && (() => {
        const s = students.find(st => st.student_id === viewEnrollment.student);
        const c = courses.find(co => co.course_id === viewEnrollment.course);
        return (
          <Modal title="Enrollment Details" onClose={() => setViewEnrollment(null)}>
            <div className="grid grid-cols-2 gap-4">
              {[['Enrollment ID', `#${viewEnrollment.enrollment_id}`],
                ['Student', s ? `${s.first_name} ${s.last_name}` : `#${viewEnrollment.student}`],
                ['Course', c ? `${c.course_code} - ${c.course_name}` : `#${viewEnrollment.course}`],
                ['Date', viewEnrollment.enrollment_date],
                ['Grade', viewEnrollment.grade != null ? String(viewEnrollment.grade) : 'Not graded'],
                ['Status', viewEnrollment.status],
              ].map(([label, value]) => (
                <div key={label} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{label}</p>
                  <p className="text-slate-800 font-medium mt-1">{value}</p>
                </div>
              ))}
            </div>
          </Modal>
        );
      })()}

      {showForm && (
        <Modal title={editing ? 'Edit Enrollment' : 'New Enrollment'} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {!editing && (
              <>
                <div><label className={labelClass}>Student *</label>
                  <select className={inputClass} value={form.student || ''} onChange={e => setForm({ ...form, student: Number(e.target.value) })} required>
                    <option value="">-- Select Student --</option>
                    {students.filter(s => s.status === 'active').map(s => (
                      <option key={s.student_id} value={s.student_id}>{s.first_name} {s.last_name} ({s.email})</option>
                    ))}
                  </select></div>
                <div><label className={labelClass}>Course *</label>
                  <select className={inputClass} value={form.course || ''} onChange={e => setForm({ ...form, course: Number(e.target.value) })} required>
                    <option value="">-- Select Course --</option>
                    {courses.map(c => (
                      <option key={c.course_id} value={c.course_id}>{c.course_code} - {c.course_name}</option>
                    ))}
                  </select></div>
              </>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelClass}>Status</label>
                <select className={inputClass} value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })}>
                  <option value="enrolled">Enrolled</option>
                  <option value="completed">Completed</option>
                  <option value="dropped">Dropped</option>
                  <option value="failed">Failed</option>
                </select></div>
              <div><label className={labelClass}>Grade (0–100)</label>
                <input type="number" min="0" max="100" step="0.01" className={inputClass} value={form.grade ?? ''} onChange={e => setForm({ ...form, grade: e.target.value ? Number(e.target.value) : null })} placeholder="Optional" /></div>
            </div>
            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
              <Button label="Cancel" onClick={() => setShowForm(false)} variant="secondary" />
              <Button label={loading ? 'Saving...' : editing ? 'Update Enrollment' : 'Create Enrollment'} type="submit" variant="primary" disabled={loading} />
            </div>
          </form>
        </Modal>
      )}

      {deleting && (
        <ConfirmDelete
          title="Delete Enrollment"
          description={`Delete enrollment #${deleting.enrollment_id}?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
