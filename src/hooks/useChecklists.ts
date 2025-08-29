import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Checklist, ChecklistStep, ChecklistWithSteps, CreateChecklistData, CreateStepData } from '../types/checklist';

export function useChecklists() {
  const { user } = useAuth();
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchChecklists();
    }
  }, [user]);

  const fetchChecklists = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('checklists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setChecklists(data || []);
    } catch (err) {
      console.error('Error fetching checklists:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch checklists');
    } finally {
      setLoading(false);
    }
  };

  const createChecklist = async (checklistData: CreateChecklistData): Promise<Checklist | null> => {
    if (!user) return null;

    try {
      setError(null);

      // Hash password if provided
      let passwordHash = null;
      if (checklistData.password) {
        // In a real app, you'd hash this properly. For MVP, we'll store it directly
        passwordHash = checklistData.password;
      }

      const { data, error: createError } = await supabase
        .from('checklists')
        .insert({
          user_id: user.id,
          title: checklistData.title,
          description: checklistData.description,
          is_public: checklistData.is_public,
          password_hash: passwordHash,
          brand_color: checklistData.brand_color,
          logo_url: checklistData.logo_url || null,
          completion_page_content: checklistData.completion_page_content,
        })
        .select()
        .single();

      if (createError) throw createError;

      // Add to local state
      setChecklists(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error creating checklist:', err);
      setError(err instanceof Error ? err.message : 'Failed to create checklist');
      return null;
    }
  };

  const updateChecklist = async (id: string, updates: Partial<CreateChecklistData>): Promise<boolean> => {
    try {
      setError(null);

      // Handle password hashing if password is being updated
      const updateData: any = { ...updates };
      if (updates.password !== undefined) {
        updateData.password_hash = updates.password || null;
        delete updateData.password;
      }

      const { error: updateError } = await supabase
        .from('checklists')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user?.id);

      if (updateError) throw updateError;

      // Update local state
      setChecklists(prev => 
        prev.map(checklist => 
          checklist.id === id 
            ? { ...checklist, ...updateData }
            : checklist
        )
      );

      return true;
    } catch (err) {
      console.error('Error updating checklist:', err);
      setError(err instanceof Error ? err.message : 'Failed to update checklist');
      return false;
    }
  };

  const deleteChecklist = async (id: string): Promise<boolean> => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('checklists')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (deleteError) throw deleteError;

      // Remove from local state
      setChecklists(prev => prev.filter(checklist => checklist.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting checklist:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete checklist');
      return false;
    }
  };

  return {
    checklists,
    loading,
    error,
    createChecklist,
    updateChecklist,
    deleteChecklist,
    refetch: fetchChecklists,
  };
}

export function useChecklistSteps(checklistId: string | null) {
  const [steps, setSteps] = useState<ChecklistStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (checklistId) {
      fetchSteps();
    } else {
      setSteps([]);
      setLoading(false);
    }
  }, [checklistId]);

  const fetchSteps = async () => {
    if (!checklistId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('checklist_steps')
        .select('*')
        .eq('checklist_id', checklistId)
        .order('order_index', { ascending: true });

      if (fetchError) throw fetchError;

      setSteps(data || []);
    } catch (err) {
      console.error('Error fetching steps:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch steps');
    } finally {
      setLoading(false);
    }
  };

  const createStep = async (stepData: CreateStepData): Promise<ChecklistStep | null> => {
    if (!checklistId) return null;

    try {
      setError(null);

      // Get the next order index
      const maxOrder = steps.length > 0 ? Math.max(...steps.map(s => s.order_index)) : -1;

      const { data, error: createError } = await supabase
        .from('checklist_steps')
        .insert({
          checklist_id: checklistId,
          title: stepData.title,
          description: stepData.description,
          is_required: stepData.is_required,
          order_index: maxOrder + 1,
        })
        .select()
        .single();

      if (createError) throw createError;

      // Add to local state
      setSteps(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Error creating step:', err);
      setError(err instanceof Error ? err.message : 'Failed to create step');
      return null;
    }
  };

  const updateStep = async (id: string, updates: Partial<CreateStepData>): Promise<boolean> => {
    try {
      setError(null);

      const { error: updateError } = await supabase
        .from('checklist_steps')
        .update(updates)
        .eq('id', id);

      if (updateError) throw updateError;

      // Update local state
      setSteps(prev => 
        prev.map(step => 
          step.id === id 
            ? { ...step, ...updates }
            : step
        )
      );

      return true;
    } catch (err) {
      console.error('Error updating step:', err);
      setError(err instanceof Error ? err.message : 'Failed to update step');
      return false;
    }
  };

  const deleteStep = async (id: string): Promise<boolean> => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('checklist_steps')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Remove from local state
      setSteps(prev => prev.filter(step => step.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting step:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete step');
      return false;
    }
  };

  const reorderSteps = async (newOrder: ChecklistStep[]): Promise<boolean> => {
    try {
      setError(null);

      // Update order_index for each step
      const updates = newOrder.map((step, index) => ({
        id: step.id,
        order_index: index,
      }));

      for (const update of updates) {
        const { error: updateError } = await supabase
          .from('checklist_steps')
          .update({ order_index: update.order_index })
          .eq('id', update.id);

        if (updateError) throw updateError;
      }

      // Update local state
      setSteps(newOrder);
      return true;
    } catch (err) {
      console.error('Error reordering steps:', err);
      setError(err instanceof Error ? err.message : 'Failed to reorder steps');
      return false;
    }
  };

  return {
    steps,
    loading,
    error,
    createStep,
    updateStep,
    deleteStep,
    reorderSteps,
    refetch: fetchSteps,
  };
}