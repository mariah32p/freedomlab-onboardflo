import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChecklistList from '../components/checklist/ChecklistList';
import ChecklistWizard from '../components/checklist/ChecklistWizard';
import { useChecklists } from '../hooks/useChecklists';
import { Checklist, CreateChecklistData } from '../types/checklist';

export default function ChecklistsPage() {
  const { checklists, createChecklist, deleteChecklist } = useChecklists();
  const [showWizard, setShowWizard] = useState(false);
  const navigate = useNavigate();

  const handleSave = async (data: CreateChecklistData & { steps: any[] }) => {
    await createChecklist(data);
    setShowWizard(false);
  };

  const handleDelete = async (id: string) => {
    await deleteChecklist(id);
  };

  const handleViewSubmissions = (checklist: Checklist) => {
    navigate('/submissions');
  };

  if (showWizard) {
    return <ChecklistWizard onSave={handleSave} onClose={() => setShowWizard(false)} />;
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-sans">Checklists</h1>
            <p className="text-gray-600 font-sans">Manage your onboarding checklists</p>
          </div>
          <button
            onClick={() => setShowWizard(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-md font-medium hover:bg-emerald-700"
          >
            New Checklist
          </button>
        </div>
        <ChecklistList
          checklists={checklists}
          onEdit={() => setShowWizard(true)}
          onDelete={handleDelete}
          onViewSubmissions={handleViewSubmissions}
        />
      </div>
    </div>
  );
}
