import React, { useState } from 'react';
import { useChecklists } from '../hooks/useChecklists';
import { useCustomerSessions } from '../hooks/useCustomerSessions';
import { useSubscription } from '../hooks/useSubscription';
import ChecklistWizard from '../components/checklist/ChecklistWizard';
import ChecklistList from '../components/checklist/ChecklistList';
import { PaymentBanner } from '../components/PaymentBanner';
import { TrialBanner } from '../components/TrialBanner';
import { Plus } from 'lucide-react';

export default function ChecklistsPage() {
  const { checklists, loading, createChecklist, updateChecklist, deleteChecklist } = useChecklists();
  const { sessions } = useCustomerSessions();
  const { subscription } = useSubscription();
  const [showWizard, setShowWizard] = useState(false);

  const handleCreateChecklist = async (checklistData: any) => {
    await createChecklist(checklistData);
    setShowWizard(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your checklists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PaymentBanner />
      <TrialBanner />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Checklists</h1>
            <p className="mt-2 text-gray-600">
              Create and manage customer onboarding checklists
            </p>
          </div>
          <button
            onClick={() => setShowWizard(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Checklist
          </button>
        </div>

        <ChecklistList
          checklists={checklists}
          onEdit={updateChecklist}
          onDelete={deleteChecklist}
        />

        {showWizard && (
          <ChecklistWizard
            onSave={handleCreateChecklist}
            onCancel={() => setShowWizard(false)}
          />
        )}
      </div>
    </div>
  );
}