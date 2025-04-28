'use client';

export function Button({ className = '', ...props }) {
  return (
    <button
      className={`px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all ${className}`}
      {...props}
    />
  );
}