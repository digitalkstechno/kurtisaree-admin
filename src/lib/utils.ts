import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

export const getImageUrl = (path: any) => {
  if (!path) return '/placeholder.jpg';
  
  const imagePath = typeof path === 'string' ? path : path.url || '';
  if (!imagePath) return '/placeholder.jpg';
  if (imagePath.startsWith('http')) return imagePath;

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  return `${apiBase}${cleanPath}`;
};
