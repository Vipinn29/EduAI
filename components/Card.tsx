interface CardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export default function Card({
  children,
  title,
  description,
  className = '',
}: CardProps) {
  return (
    <div className={`bg-white rounded-lg transition-all duration-300 ease-out hover:shadow-lg p-6 border border-gray-100 ${className}`}>
      {title && <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>}
      {description && <p className="text-gray-600 text-sm mb-4">{description}</p>}
      {children}
    </div>
  );
}
