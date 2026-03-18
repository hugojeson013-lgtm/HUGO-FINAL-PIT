import React, { useState } from 'react';
import { Teacher } from '../types';
import { teacherApi } from '../services/api';
import Button from '../components/Button';
import Modal from '../components/Modal';
import ConfirmDelete from '../components/ConfirmDelete';

interface TeachersProps {
  teachers: Teacher[];
  onRefresh: () => void;
  onToast: (msg: string, type: 'success' | 'error') => void;
}

const empty: Omit<Teacher, 'teacher_id'> = {
  first_name: '', last_name: '', email: '', phone: '',
  department: '', specialization: '', hire_date: '',
};

export default function Teachers({ teachers, onRefresh, onToast }: TeachersProps) {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [deleting, setDeleting] = useState<Teacher | null>(null);
  const [form, setForm] = useState<Omit<Teacher, 'teacher_id'>>(empty);
  const [loading, setLoading] = useState(false);
  const [viewTeacher, setViewTeacher] = useState<Teacher | null>(null);

  const filtered = teachers.filter(t =>
    `${t.first_name} ${t.last_name} ${t.email} ${t.department}`.toLowerCase().includes(search.toLowerCase())
  );

  function openCreate() { setForm(empty); setEditing(null); setShowForm(true); }
  function openEdit(t: Teacher) {
    setForm({ first_name: t.first_name, last_name: t.last_name, email: t.email, phone: t.phone || '', department: t.department || '', specialization: t.specialization || '', hire_date: t.hire_date });
    setEditing(t); setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    try {
      if (editing) {
        await teacherApi.update(editing.teacher_id, form);
        onToast('Teacher updated successfully!', 'success');
      } else {
        await teacherApi.create(form);
        onToast('Teacher created successfully!', 'success');
      }
      setShowForm(false); onRefresh();
    } catch (err: any) { onToast(err.message || 'Error', 'error'); }
    finally { setLoading(false); }
  }

  async function handleDelete() {
    if (!deleting) return;
    try {
      await teacherApi.delete(deleting.teacher_id);
      onToast('Teacher deleted!', 'success');
      setDeleting(null); onRefresh();
    } catch (err: any) { onToast(err.message || 'Delete failed', 'error'); }
  }

  const inputClass = "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all";
  const labelClass = "block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Teachers</h2>
          <p className="text-slate-500 text-sm mt-0.5">{teachers.length} faculty members</p>
        </div>
        <Button label="+ Add Teacher" onClick={openCreate} variant="primary" icon="👩‍🏫" />
      </div>

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        <input type="text" placeholder="Search teachers..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border-2 border-slate-100 rounded-xl bg-white text-sm focus:outline-none focus:border-teal-300 transition-all" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50 border-b-2 border-slate-200">
              <tr>
                {['ID', 'Name', 'Email', 'Department', 'Specialization', 'Hired', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-400">No teachers found</td></tr>
              ) : filtered.map(t => (
                <tr key={t.teacher_id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-400 text-sm font-mono">#{t.teacher_id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-xs font-bold text-emerald-600 flex-shrink-0">
                        {t.first_name[0]}{t.last_name[0]}
                      </div>
                      <span className="font-semibold text-slate-800 text-sm">{t.first_name} {t.last_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-sm">{t.email}</td>
                  <td className="px-4 py-3">
                    {t.department ? <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-semibold">{t.department}</span> : <span className="text-slate-400">—</span>}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-sm">{t.specialization || '—'}</td>
                  <td className="px-4 py-3 text-slate-500 text-sm">{t.hire_date}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button label="View" onClick={() => setViewTeacher(t)} variant="ghost" size="sm" />
                      <Button label="Edit" onClick={() => openEdit(t)} variant="secondary" size="sm" />
                      <Button label="Delete" onClick={() => setDeleting(t)} variant="danger" size="sm" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {viewTeacher && (
        <Modal title="Teacher Details" onClose={() => setViewTeacher(null)}>
          <div className="grid grid-cols-2 gap-4">
            {[['ID', `#${viewTeacher.teacher_id}`], ['Full Name', `${viewTeacher.first_name} ${viewTeacher.last_name}`],
              ['Email', viewTeacher.email], ['Phone', viewTeacher.phone || 'N/A'],
              ['Department', viewTeacher.department || 'N/A'], ['Specialization', viewTeacher.specialization || 'N/A'],
              ['Hire Date', viewTeacher.hire_date]
            ].map(([label, value]) => (
              <div key={label} className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{label}</p>
                <p className="text-slate-800 font-medium mt-1">{value}</p>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {showForm && (
        <Modal title={editing ? 'Edit Teacher' : 'Add New Teacher'} onClose={() => setShowForm(false)}>
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
              <div><label className={labelClass}>Hire Date *</label>
                <input type="date" className={inputClass} value={form.hire_date} onChange={e => setForm({ ...form, hire_date: e.target.value })} required /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelClass}>Department</label>
                <input className={inputClass} value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} /></div>
              <div><label className={labelClass}>Specialization</label>
                <input className={inputClass} value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} /></div>
            </div>
            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
              <Button label="Cancel" onClick={() => setShowForm(false)} variant="secondary" />
              <Button label={loading ? 'Saving...' : editing ? 'Update Teacher' : 'Create Teacher'} type="submit" variant="primary" disabled={loading} />
            </div>
          </form>
        </Modal>
      )}

      {deleting && (
        <ConfirmDelete
          title="Delete Teacher"
          description={`Delete "${deleting.first_name} ${deleting.last_name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
