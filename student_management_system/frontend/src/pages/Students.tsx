import React, { useState } from 'react';
import { Student } from '../types';
import { studentApi } from '../services/api';
import Button from '../components/Button';
import Modal from '../components/Modal';
import ConfirmDelete from '../components/ConfirmDelete';

interface StudentsProps {
  students: Student[];
  onRefresh: () => void;
  onToast: (msg: string, type: 'success' | 'error') => void;
}

const empty: Omit<Student, 'student_id'> = {
  first_name: '', last_name: '', email: '', phone: '',
  date_of_birth: '', enrollment_date: '', status: 'active',
};

export default function Students({ students, onRefresh, onToast }: StudentsProps) {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [deleting, setDeleting] = useState<Student | null>(null);
  const [form, setForm] = useState<Omit<Student, 'student_id'>>(empty);
  const [loading, setLoading] = useState(false);
  const [viewStudent, setViewStudent] = useState<Student | null>(null);

  const filtered = students.filter(s =>
    `${s.first_name} ${s.last_name} ${s.email}`.toLowerCase().includes(search.toLowerCase())
  );

  function openCreate() { setForm(empty); setEditing(null); setShowForm(true); }
  function openEdit(s: Student) {
    setForm({ first_name: s.first_name, last_name: s.last_name, email: s.email, phone: s.phone || '', date_of_birth: s.date_of_birth || '', enrollment_date: s.enrollment_date, status: s.status });
    setEditing(s); setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) {
        await studentApi.update(editing.student_id, form);
        onToast('Student updated successfully!', 'success');
      } else {
        await studentApi.create(form);
        onToast('Student created successfully!', 'success');
      }
      setShowForm(false); onRefresh();
    } catch (err: any) {
      onToast(err.message || 'Something went wrong', 'error');
    } finally { setLoading(false); }
  }

  async function handleDelete() {
    if (!deleting) return;
    try {
      await studentApi.delete(deleting.student_id);
      onToast('Student deleted successfully!', 'success');
      setDeleting(null); onRefresh();
    } catch (err: any) {
      onToast(err.message || 'Delete failed', 'error');
    }
  }

  const inputClass = "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all";
  const labelClass = "block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5";

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Students</h2>
          <p className="text-slate-500 text-sm mt-0.5">{students.length} total students</p>
        </div>
        <Button label="+ Add Student" onClick={openCreate} variant="primary" icon="🎓" />
      </div>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        <input
          type="text" placeholder="Search students..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border-2 border-slate-100 rounded-xl bg-white text-sm focus:outline-none focus:border-teal-300 transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50 border-b-2 border-slate-200">
              <tr>
                {['ID', 'Name', 'Email', 'Phone', 'Status', 'Enrolled', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-400">No students found</td></tr>
              ) : filtered.map(s => (
                <tr key={s.student_id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-400 text-sm font-mono">#{s.student_id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-xs font-bold text-teal-600 flex-shrink-0">
                        {s.first_name[0]}{s.last_name[0]}
                      </div>
                      <span className="font-semibold text-slate-800 text-sm">{s.first_name} {s.last_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-sm">{s.email}</td>
                  <td className="px-4 py-3 text-slate-500 text-sm">{s.phone || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                      ${s.status === 'active' ? 'bg-emerald-100 text-emerald-700'
                        : s.status === 'graduated' ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-slate-100 text-slate-600'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-sm">{s.enrollment_date}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button label="View" onClick={() => setViewStudent(s)} variant="ghost" size="sm" />
                      <Button label="Edit" onClick={() => openEdit(s)} variant="secondary" size="sm" />
                      <Button label="Delete" onClick={() => setDeleting(s)} variant="danger" size="sm" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {viewStudent && (
        <Modal title="Student Details" onClose={() => setViewStudent(null)}>
          <div className="grid grid-cols-2 gap-4">
            {[
              ['ID', `#${viewStudent.student_id}`],
              ['Full Name', `${viewStudent.first_name} ${viewStudent.last_name}`],
              ['Email', viewStudent.email],
              ['Phone', viewStudent.phone || 'N/A'],
              ['Date of Birth', viewStudent.date_of_birth || 'N/A'],
              ['Enrollment Date', viewStudent.enrollment_date],
              ['Status', viewStudent.status],
            ].map(([label, value]) => (
              <div key={label} className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{label}</p>
                <p className="text-slate-800 font-medium mt-1">{value}</p>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* Form Modal */}
      {showForm && (
        <Modal title={editing ? 'Edit Student' : 'Add New Student'} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelClass}>First Name *</label>
                <input className={inputClass} value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value.replace(/[^a-zA-Z]/g, '') })} required /></div>
              <div><label className={labelClass}>Last Name *</label>
                <input className={inputClass} value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value.replace(/[^a-zA-Z]/g, '') })} required /></div>
            </div>
            <div><label className={labelClass}>Email *</label>
              <input type="email" className={inputClass} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelClass}>Phone</label>
                <input type="tel" inputMode="numeric" className={inputClass} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })} /></div>
              <div><label className={labelClass}>Date of Birth</label>
                <input type="date" className={inputClass} value={form.date_of_birth} onChange={e => setForm({ ...form, date_of_birth: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelClass}>Enrollment Date *</label>
                <input type="date" className={inputClass} value={form.enrollment_date} onChange={e => setForm({ ...form, enrollment_date: e.target.value })} required /></div>
              <div><label className={labelClass}>Status</label>
                <select className={inputClass} value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="graduated">Graduated</option>
                </select></div>
            </div>
            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
              <Button label="Cancel" onClick={() => setShowForm(false)} variant="secondary" />
              <Button label={loading ? 'Saving...' : editing ? 'Update Student' : 'Create Student'} type="submit" variant="primary" disabled={loading} />
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirm */}
      {deleting && (
        <ConfirmDelete
          title="Delete Student"
          description={`Are you sure you want to delete "${deleting.first_name} ${deleting.last_name}"? All enrollments will also be deleted.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
