import React from 'react';
import Button from './Button';

interface ConfirmDeleteProps {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDelete({ title, description, onConfirm, onCancel }: ConfirmDeleteProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-2xl flex-shrink-0">⚠️</div>
          <div>
            <h3 className="text-slate-800 font-bold text-lg">{title}</h3>
            <p className="text-slate-500 text-sm mt-0.5">{description}</p>
          </div>
        </div>
        <p className="text-red-600 text-sm font-medium bg-red-50 px-3 py-2 rounded-lg mb-5">
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button label="Cancel" onClick={onCancel} variant="secondary" />
          <Button label="Yes, Delete" onClick={onConfirm} variant="danger" />
        </div>
      </div>
    </div>
  );
}
