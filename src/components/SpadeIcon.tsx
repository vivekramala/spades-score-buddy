import { cn } from '@/lib/utils';

interface SpadeIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-10 h-10',
  xl: 'w-16 h-16',
};

export const SpadeIcon = ({ className, size = 'md' }: SpadeIconProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn(sizeClasses[size], className)}
    >
      <path d="M12 2C12 2 4 10 4 14C4 17.314 6.686 20 10 20C10.695 20 11.366 19.893 12 19.695C12.634 19.893 13.305 20 14 20C17.314 20 20 17.314 20 14C20 10 12 2 12 2ZM10 18C8.343 18 7 16.657 7 15C7 13.343 8.343 12 10 12C10.35 12 10.687 12.06 11 12.17V18C10.687 17.94 10.35 18 10 18ZM14 18C13.65 18 13.313 17.94 13 18V12.17C13.313 12.06 13.65 12 14 12C15.657 12 17 13.343 17 15C17 16.657 15.657 18 14 18Z" />
      <path d="M12 18V22M10 22H14" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" />
    </svg>
  );
};
