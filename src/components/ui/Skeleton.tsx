import React from 'react';

interface SkeletonProps {
  className?: string;
}

// Base skeleton component with shimmer animation
export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div 
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      style={{
        backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
        backgroundSize: '200px 100%',
        backgroundRepeat: 'no-repeat',
        animation: 'shimmer 1.5s infinite',
      }}
    />
  );
}

// Text line skeleton with various widths
interface SkeletonTextProps {
  width?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export function SkeletonText({ width = 'md', className = '' }: SkeletonTextProps) {
  const widthClasses = {
    sm: 'w-16',
    md: 'w-32', 
    lg: 'w-48',
    xl: 'w-64',
    full: 'w-full'
  };

  return (
    <Skeleton className={`h-4 ${widthClasses[width]} ${className}`} />
  );
}

// Button-shaped skeleton
interface SkeletonButtonProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function SkeletonButton({ size = 'md', className = '' }: SkeletonButtonProps) {
  const sizeClasses = {
    sm: 'h-8 w-20',
    md: 'h-10 w-28',
    lg: 'h-12 w-36'
  };

  return (
    <Skeleton className={`${sizeClasses[size]} rounded-lg ${className}`} />
  );
}

// Box/Card skeleton
interface SkeletonBoxProps {
  height?: string;
  className?: string;
}

export function SkeletonBox({ height = 'h-20', className = '' }: SkeletonBoxProps) {
  return (
    <Skeleton className={`w-full ${height} rounded-xl ${className}`} />
  );
}

// Add the shimmer keyframe animation to the document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shimmer {
      0% {
        background-position: -200px 0;
      }
      100% {
        background-position: 200px 0;
      }
    }
  `;
  document.head.appendChild(style);
}