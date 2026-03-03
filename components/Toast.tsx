import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  duration?: number;
}

export default function Toast({ message, duration = 3000 }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(id);
  }, [duration]);

  if (!visible) return null;

  return (
    <div className="fixed top-6 right-6 z-50 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg animate-slide-in-up">
      {message}
    </div>
  );
}
