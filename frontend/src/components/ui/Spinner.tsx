interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };

export const Spinner = ({ size = 'md', className = '' }: SpinnerProps) => (
  <div className={`${sizes[size]} animate-spin rounded-full border-2 border-current border-t-transparent ${className}`} />
);

export const PageLoader = () => (
  <div className="flex items-center justify-center h-64">
    <Spinner size="lg" className="text-brand-500" />
  </div>
);
