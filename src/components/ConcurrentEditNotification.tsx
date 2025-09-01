import React from 'react';
import { Users, X } from 'lucide-react';
import { CustomerSession } from '../types/checklist';

interface ConcurrentEditNotificationProps {
  otherUsers: CustomerSession[];
  show: boolean;
  onDismiss: () => void;
}

export default function ConcurrentEditNotification({ 
  otherUsers, 
  show, 
  onDismiss 
}: ConcurrentEditNotificationProps) {
  if (!show || otherUsers.length === 0) return null;

  const activeUsers = otherUsers.filter(user => {
    const lastActivity = new Date(user.last_activity);
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return lastActivity > fiveMinutesAgo;
  });

  if (activeUsers.length === 0) return null;

  return (
    <div className="fixed top-24 right-4 bg-blue-50 border border-blue-200 rounded-lg shadow-lg p-4 max-w-sm z-40 animate-slide-in">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-blue-900 font-sans">
              {activeUsers.length === 1 ? 'Someone else is here' : `${activeUsers.length} others are here`}
            </h4>
            <div className="mt-1 space-y-1">
              {activeUsers.slice(0, 3).map((user, index) => (
                <p key={user.id} className="text-xs text-blue-700 font-sans">
                  {user.name || user.email} {user.company && `(${user.company})`}
                </p>
              ))}
              {activeUsers.length > 3 && (
                <p className="text-xs text-blue-600 font-sans">
                  +{activeUsers.length - 3} more
                </p>
              )}
            </div>
            <p className="text-xs text-blue-600 mt-2 font-sans">
              Changes are saved automatically for everyone
            </p>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-blue-400 hover:text-blue-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}