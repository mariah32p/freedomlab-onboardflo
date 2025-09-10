import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { useNavigate } from 'react-router-dom';
import { useChecklists } from '../hooks/useChecklists';
import { useCustomerSessions } from '../hooks/useCustomerSessions';
import { useFeatureGating } from '../hooks/useFeatureGating';
import UpgradePrompt from '../components/UpgradePrompt';
import { useFeatureGating } from '../hooks/useFeatureGating';
import UpgradePrompt from '../components/UpgradePrompt';
import PaymentBanner from '../components/PaymentBanner';
import TrialBanner from '../components/TrialBanner';
import { Checklist } from '../types/checklist';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Copy, 
  Check, 
  Eye,
  Globe,
  Lock,
  Calendar,
  Users,
  Link as LinkIcon
} from 'lucide-react';

export default function ChecklistsPage() {
  const { user } = useAuth();
  const { subscription, getAccessStatus } = useSubscription();
  const { checklists, loading, error, deleteChecklist } = useChecklists();
  const { createPendingSubmission } = useCustomerSessions();
  const featureAccess = useFeatureGating(checklists.length);
  const featureAccess = useFeatureGating(checklists.length);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [creatingSessionId, setCreatingSessionId] = useState<string | null>(null);
  const accessStatus = getAccessStatus();
  const navigate = useNavigate();

  const handleCreateChecklist = () => {
    if (featureAccess.canCreateMoreChecklists) {
      navigate('/checklists/create');
    }
  const handleCreateChecklist = () => {
    if (featureAccess.canCreateMoreChecklists) {
      navigate('/checklists/create');
    }
  // Redirect to dashboard if no active subscription
  useEffect(() => {
    if (!accessStatus.hasAccess || accessStatus.shouldRedirectToGetStarted) {
      navigate('/dashboard');
    }
  }, [accessStatus, navigate]);

  const handleDeleteChecklist = async (id: string) => {
    if (!confirm('Are you sure you want to delete this checklist? This will also delete all customer sessions and cannot be undone.')) {
      return;
    }
    
    setDeletingId(id);
    const success = await deleteChecklist(id);
    setDeletingId(null);
  };

  const handleCopyUrl = async (checklist: Checklist) => {
    try {
      // Copy the base checklist URL (customers will create their own sessions)
      const url = `${window.location.origin}/c/${checklist.id}`;
      await navigator.clipboard.writeText(url);
      setCopiedId(checklist.id);
      setTimeout(() => setCopiedId(null), 2000);
  // Show dashboard for users with active subscriptions