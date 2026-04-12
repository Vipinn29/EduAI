interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'pdf';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size,
  className = '',
  disabled = false,
}: ButtonProps) {
  const sizeClass = size === 'sm' ? 'px-3 py-1.5 text-sm' : size === 'lg' ? 'px-6 py-3 text-lg' : 'px-4 py-2';
  const baseStyle = `rounded-lg font-semibold transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 ${sizeClass}`;

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:scale-105',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 hover:scale-105',
    pdf: 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg hover:scale-105 border border-emerald-500/50',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
