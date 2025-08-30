import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import PaymentBanner from '../components/PaymentBanner';
import TrialBanner from '../components/TrialBanner';
import ChecklistList from '../components/checklist/ChecklistList';
import ChecklistBuilder from '../components/checklist/ChecklistBuilder';
import { useChecklists } from '../hooks/useChecklists';
import { Checklist, CreateChecklistData } from '../types/checklist';
import { ChecklistTemplate } from '../data/checklistTemplates';

export default function ChecklistsPage() {
  const { user } = useAuth();
  const { subscription, getAccessStatus } = useSubscription();
  const { createChecklist, updateChecklist, refetch } = useChecklists();
  const accessStatus = getAccessStatus();
  
  // Checklist builder state
  const [showChecklistBuilder, setShowChecklistBuilder] = useState(false);
  const [editingChecklist, setEditingChecklist] = useState<Checklist | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ChecklistTemplate | null>(null);

  const handleCreateChecklist = (template?: ChecklistTemplate) => {
    setEditingChecklist(null);
    setSelectedTemplate(template || null);
    setShowChecklistBuilder(true);
  };

  const handleEditChecklist = (checklist: Checklist) => {
    setEditingChecklist(checklist);
    setShowChecklistBuilder(true);
  };

  const handleSaveChecklist = async (data: CreateChecklistData) => {
    try {
      if (editingChecklist) {
        const success = await updateChecklist(editingChecklist.id, data);
        if (success) {
          await refetch();
          setShowChecklistBuilder(false);
          setEditingChecklist(null);
          setSelectedTemplate(null);
        }
      } else {
        const newChecklist = await createChecklist(data);
        if (newChecklist) {
          await refetch();
          setShowChecklistBuilder(false);
          setEditingChecklist(null);
          setSelectedTemplate(null);
        }
      }
    } catch (err) {
      console.error('Error saving checklist:', err);
    }
  };

  const handleCloseBuilder = () => {
    setShowChecklistBuilder(false);
    setEditingChecklist(null);
    setSelectedTemplate(null);
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trial Banner */}
        <TrialBanner />
        
        {/* Payment Issue Banner */}
        <PaymentBanner />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-sans">Checklists</h1>
          <p className="text-gray-600 font-sans">
            Create and manage your onboarding flows
          </p>
        </div>

        {/* Content */}
        <ChecklistList 
          onEditChecklist={handleEditChecklist}
          onCreateNew={handleCreateChecklist}
        />
        
        {/* Checklist Builder Modal */}
        {showChecklistBuilder && (
          <ChecklistBuilder
            checklist={editingChecklist}
            template={selectedTemplate}
            onSave={handleSaveChecklist}
            onClose={handleCloseBuilder}
            isCreating={!editingChecklist}
          />
        )}
      </div>
    </div>
  );
}