"use client";

export default function EmptyState() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full max-w-[512px] mx-auto bg-white flex flex-col items-center justify-center
                 py-16 text-center motion-reduce:transition-none"
    >
      {/* Heading */}
      <h2 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h2>
      {/* Body text */}
      <p className="text-base text-gray-500">Add your first task below</p>
    </div>
  );
}
