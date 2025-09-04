import { supabase } from './supabase';

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

// Upload file to Supabase Storage
export async function uploadFile(
  file: File, 
  bucket: string = 'customer-files',
  folder?: string
): Promise<UploadResult> {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}-${randomString}.${fileExtension}`;
    
    // Create file path
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return { success: false, error: error.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      success: true,
      url: urlData.publicUrl,
      path: data.path
    };
  } catch (err) {
    console.error('Upload failed:', err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Upload failed' 
    };
  }
}

// Delete file from Supabase Storage
export async function deleteFile(
  path: string, 
  bucket: string = 'customer-files'
): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Delete failed:', err);
    return false;
  }
}

// Get signed URL for private files
export async function getSignedUrl(
  path: string, 
  bucket: string = 'customer-files',
  expiresIn: number = 3600
): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) {
      console.error('Signed URL error:', error);
      return null;
    }

    return data.signedUrl;
  } catch (err) {
    console.error('Signed URL failed:', err);
    return null;
  }
}

// List files in a folder
export async function listFiles(
  folder?: string,
  bucket: string = 'customer-files'
): Promise<any[]> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder, {
        limit: 100,
        offset: 0
      });

    if (error) {
      console.error('List files error:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('List files failed:', err);
    return [];
  }
}

// Validate file before upload
export function validateFile(file: File, options?: {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
}): { valid: boolean; error?: string } {
  const { maxSize = 10 * 1024 * 1024, allowedTypes } = options || {}; // Default 10MB

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
    };
  }

  if (allowedTypes && !allowedTypes.some(type => file.type.includes(type))) {
    return {
      valid: false,
      error: `File type not allowed. Accepted types: ${allowedTypes.join(', ')}`
    };
  }

  return { valid: true };
}