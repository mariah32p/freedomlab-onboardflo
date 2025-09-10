import React from 'react';
import { Skeleton, SkeletonText, SkeletonButton } from './ui/Skeleton';

export default function SettingsSkeleton() {
  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-9 w-32 mb-2" /> {/* "Settings" title */}
          <Skeleton className="h-5 w-80" /> {/* Description */}
        </div>

        <div className="space-y-6">
          {/* Account Settings Skeleton */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <Skeleton className="h-6 w-20" /> {/* "Account" title */}
            </div>
            <div className="p-6 space-y-4">
              {/* Email Field Skeleton */}
              <div>
                <Skeleton className="h-4 w-10 mb-1" /> {/* "Email" label */}
                <Skeleton className="h-6 w-64" /> {/* Email value */}
              </div>
              {/* Plan Field Skeleton */}
              <div>
                <Skeleton className="h-4 w-8 mb-1" /> {/* "Plan" label */}
                <div className="flex items-center">
                  <Skeleton className="h-6 w-20 mr-2" /> {/* Plan name */}
                  <Skeleton className="h-6 w-12 rounded-full" /> {/* Trial badge */}
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Management Skeleton */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <Skeleton className="h-6 w-28" /> {/* "Subscription" title */}
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Skeleton className="h-5 w-40 mb-1" /> {/* "Manage Subscription" */}
                  <Skeleton className="h-4 w-72" /> {/* Description */}
                </div>
                <SkeletonButton size="md" /> {/* "Manage Billing" button */}
              </div>
              <Skeleton className="h-4 w-96" /> {/* Helper text */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}