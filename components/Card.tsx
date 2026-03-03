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
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {title && <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>}
      {description && <p className="text-gray-600 text-sm mb-4">{description}</p>}
      {children}
    </div>
  );
}
