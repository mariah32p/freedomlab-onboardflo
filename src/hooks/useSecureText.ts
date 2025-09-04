import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface SecureTextData {
  id: string;
  session_id: string;
  step_id: string;
  encrypted_content: string;
  expires_at: string;
  created_at: string;
}

export function useSecureText(sessionId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simple encryption/decryption (in production, use proper crypto)
  const encrypt = (text: string): string => {
    try {
      return btoa(unescape(encodeURIComponent(text)));
    } catch {
      return text; // Fallback if encoding fails
    }
  };

  const decrypt = (encryptedText: string): string => {
    try {
      return decodeURIComponent(escape(atob(encryptedText)));
    } catch {
      return encryptedText; // Fallback if decoding fails
    }
  };

  const saveSecureText = async (stepId: string, content: string, expiryHours: number = 24): Promise<boolean> => {
    if (!sessionId || !content.trim()) return false;

    setLoading(true);
    setError(null);

    try {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + expiryHours);

      const encryptedContent = encrypt(content);

      const { error } = await supabase
        .from('secure_text_data')
        .upsert({
          session_id: sessionId,
          step_id: stepId,
          encrypted_content: encryptedContent,
          expires_at: expiresAt.toISOString(),
        }, {
          onConflict: 'session_id,step_id'
        });

      if (error) throw error;

      return true;
    } catch (err) {
      console.error('Error saving secure text:', err);
      setError('Failed to save secure data');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getSecureText = async (stepId: string): Promise<{ content: string; isExpired: boolean } | null> => {
    if (!sessionId) return null;

    try {
      const { data, error } = await supabase
        .from('secure_text_data')
        .select('*')
        .eq('session_id', sessionId)
        .eq('step_id', stepId)
        .maybeSingle();

      if (error) throw error;

      if (!data) return null;

      const isExpired = new Date() > new Date(data.expires_at);
      
      if (isExpired) {
        // Auto-delete expired data
        await deleteSecureText(stepId);
        return { content: '', isExpired: true };
      }

      const decryptedContent = decrypt(data.encrypted_content);
      return { content: decryptedContent, isExpired: false };
    } catch (err) {
      console.error('Error getting secure text:', err);
      return null;
    }
  };

  const deleteSecureText = async (stepId: string): Promise<boolean> => {
    if (!sessionId) return false;

    try {
      const { error } = await supabase
        .from('secure_text_data')
        .delete()
        .eq('session_id', sessionId)
        .eq('step_id', stepId);

      if (error) throw error;

      return true;
    } catch (err) {
      console.error('Error deleting secure text:', err);
      return false;
    }
  };

  const getExpiryInfo = async (stepId: string): Promise<{ expiresAt: Date; timeLeft: string } | null> => {
    if (!sessionId) return null;

    try {
      const { data, error } = await supabase
        .from('secure_text_data')
        .select('expires_at')
        .eq('session_id', sessionId)
        .eq('step_id', stepId)
        .maybeSingle();

      if (error || !data) return null;

      const expiresAt = new Date(data.expires_at);
      const now = new Date();
      const timeLeftMs = expiresAt.getTime() - now.getTime();
      
      if (timeLeftMs <= 0) return null;

      const hours = Math.floor(timeLeftMs / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
      
      let timeLeft = '';
      if (hours > 0) {
        timeLeft = `${hours}h ${minutes}m`;
      } else {
        timeLeft = `${minutes}m`;
      }

      return { expiresAt, timeLeft };
    } catch (err) {
      console.error('Error getting expiry info:', err);
      return null;
    }
  };

  return {
    loading,
    error,
    saveSecureText,
    getSecureText,
    deleteSecureText,
    getExpiryInfo,
  };
}