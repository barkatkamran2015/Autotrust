'use client';

export function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${className}`}
      {...props}
    />
  );
}