import React, { useState } from 'react';
import { Course, Teacher } from '../types';
import { courseApi } from '../services/api';
import Button from '../components/Button';
import Modal from '../components/Modal';
import ConfirmDelete from '../components/ConfirmDelete';

interface CoursesProps {
  courses: Course[];
  teachers: Teacher[];
  onRefresh: () => void;
  onToast: (msg: string, type: 'success' | 'error') => void;
}

const empty: Omit<Course, 'course_id'> = {
  course_name: '', course_code: '', teacher: null,
  description: '', credits: 3, max_capacity: 30, semester: '',
};

export default function Courses({ courses, teachers, onRefresh, onToast }: CoursesProps) {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [deleting, setDeleting] = useState<Course | null>(null);
  const [form, setForm] = useState<Omit<Course, 'course_id'>>(empty);
  const [loading, setLoading] = useState(false);
  const [viewCourse, setViewCourse] = useState<Course | null>(null);

  const filtered = courses.filter(c =>
    `${c.course_code} ${c.course_name} ${c.semester}`.toLowerCase().includes(search.toLowerCase())
  );

  function openCreate() { setForm(empty); setEditing(null); setShowForm(true); }
  function openEdit(c: Course) {
    setForm({ course_name: c.course_name, course_code: c.course_code, teacher: c.teacher, description: c.description || '', credits: c.credits, max_capacity: c.max_capacity, semester: c.semester || '' });
    setEditing(c); setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    try {
      const payload = { ...form, teacher: form.teacher ? Number(form.teacher) : null };
      if (editing) { await courseApi.update(editing.course_id, payload); onToast('Course updated!', 'success'); }
      else { await courseApi.create(payload); onToast('Course created!', 'success'); }
      setShowForm(false); onRefresh();
    } catch (err: any) { onToast(err.message || 'Error', 'error'); }
    finally { setLoading(false); }
  }

  async function handleDelete() {
    if (!deleting) return;
    try {
      await courseApi.delete(deleting.course_id);
      onToast('Course deleted!', 'success');
      setDeleting(null); onRefresh();
    } catch (err: any) { onToast(err.message || 'Delete failed', 'error'); }
  }

  const inputClass = "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all";
  const labelClass = "block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Courses</h2>
          <p className="text-slate-500 text-sm mt-0.5">{courses.length} available courses</p>
        </div>
        <Button label="+ Add Course" onClick={openCreate} variant="primary" icon="📚" />
      </div>

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        <input type="text" placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border-2 border-slate-100 rounded-xl bg-white text-sm focus:outline-none focus:border-teal-300 transition-all" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50 border-b-2 border-slate-200">
              <tr>
                {['Code', 'Course Name', 'Teacher', 'Credits', 'Capacity', 'Semester', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-400">No courses found</td></tr>
              ) : filtered.map(c => {
                const teacher = teachers.find(t => t.teacher_id === c.teacher);
                return (
                  <tr key={c.course_id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg text-xs font-bold font-mono">{c.course_code}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800 text-sm">{c.course_name}</td>
                    <td className="px-4 py-3 text-slate-600 text-sm">{teacher ? `${teacher.first_name} ${teacher.last_name}` : <span className="text-slate-400">No teacher</span>}</td>
                    <td className="px-4 py-3">
                      <span className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full text-xs font-semibold">{c.credits} cr</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-sm">{c.max_capacity}</td>
                    <td className="px-4 py-3 text-slate-500 text-sm">{c.semester || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button label="View" onClick={() => setViewCourse(c)} variant="ghost" size="sm" />
                        <Button label="Edit" onClick={() => openEdit(c)} variant="secondary" size="sm" />
                        <Button label="Delete" onClick={() => setDeleting(c)} variant="danger" size="sm" />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {viewCourse && (
        <Modal title="Course Details" onClose={() => setViewCourse(null)}>
          <div className="grid grid-cols-2 gap-4">
            {[['Course Code', viewCourse.course_code], ['Course Name', viewCourse.course_name],
              ['Teacher', teachers.find(t => t.teacher_id === viewCourse.teacher) ? `${teachers.find(t => t.teacher_id === viewCourse.teacher)!.first_name} ${teachers.find(t => t.teacher_id === viewCourse.teacher)!.last_name}` : 'No teacher'],
              ['Credits', String(viewCourse.credits)], ['Max Capacity', String(viewCourse.max_capacity)],
              ['Semester', viewCourse.semester || 'N/A'],
            ].map(([label, value]) => (
              <div key={label} className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{label}</p>
                <p className="text-slate-800 font-medium mt-1">{value}</p>
              </div>
            ))}
            {viewCourse.description && (
              <div className="col-span-2 bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Description</p>
                <p className="text-slate-700 text-sm mt-1">{viewCourse.description}</p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {showForm && (
        <Modal title={editing ? 'Edit Course' : 'Add New Course'} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelClass}>Course Name *</label>
                <input className={inputClass} value={form.course_name} onChange={e => setForm({ ...form, course_name: e.target.value })} required /></div>
              <div><label className={labelClass}>Course Code *</label>
                <input className={inputClass} value={form.course_code} onChange={e => setForm({ ...form, course_code: e.target.value })} required /></div>
            </div>
            <div><label className={labelClass}>Teacher</label>
              <select className={inputClass} value={form.teacher ?? ''} onChange={e => setForm({ ...form, teacher: e.target.value ? Number(e.target.value) : null })}>
                <option value="">-- No Teacher --</option>
                {teachers.map(t => <option key={t.teacher_id} value={t.teacher_id}>{t.first_name} {t.last_name}</option>)}
              </select></div>
            <div><label className={labelClass}>Description</label>
              <textarea className={`${inputClass} min-h-[80px] resize-y`} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
            <div className="grid grid-cols-3 gap-4">
              <div><label className={labelClass}>Credits *</label>
                <input type="number" min="1" className={inputClass} value={form.credits} onChange={e => setForm({ ...form, credits: Number(e.target.value) })} required /></div>
              <div><label className={labelClass}>Max Capacity</label>
                <input type="number" min="1" className={inputClass} value={form.max_capacity} onChange={e => setForm({ ...form, max_capacity: Number(e.target.value) })} /></div>
              <div><label className={labelClass}>Semester</label>
                <input className={inputClass} placeholder="e.g. Fall 2025" value={form.semester} onChange={e => setForm({ ...form, semester: e.target.value })} /></div>
            </div>
            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
              <Button label="Cancel" onClick={() => setShowForm(false)} variant="secondary" />
              <Button label={loading ? 'Saving...' : editing ? 'Update Course' : 'Create Course'} type="submit" variant="primary" disabled={loading} />
            </div>
          </form>
        </Modal>
      )}

      {deleting && (
        <ConfirmDelete
          title="Delete Course"
          description={`Delete "${deleting.course_code} - ${deleting.course_name}"? All enrollments will also be deleted.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
