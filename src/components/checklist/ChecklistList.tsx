import React from 'react';
import { Checklist } from '../../types/checklist';

interface ChecklistListProps {
  checklists: Checklist[];
  onEdit: (checklist: Checklist) => void;
  onDelete: (id: string) => void;
  onViewSubmissions: (checklist: Checklist) => void;
}

const ChecklistList: React.FC<ChecklistListProps> = ({
  checklists,
  onEdit,
  onDelete,
  onViewSubmissions
}) => {
  if (checklists.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-4">No checklists yet</div>
        <p className="text-gray-600">Create your first checklist to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {checklists.map((checklist) => (
        <div
          key={checklist.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {checklist.title}
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(checklist)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(checklist.id)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
          
          {checklist.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {checklist.description}
            </p>
          )}
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>
              {checklist.is_public ? 'Public' : 'Private'}
            </span>
            <button
              onClick={() => onViewSubmissions(checklist)}
              className="text-green-600 hover:text-green-800 font-medium"
            >
              View Submissions
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChecklistList;