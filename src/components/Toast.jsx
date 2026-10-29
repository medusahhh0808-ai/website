import React from 'react';
import { Check } from 'lucide-react';

export function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="apple-toast-capsule">
      <Check size={16} color="#34C759" strokeWidth={3} />
      <span>{message}</span>
    </div>
  );
}
