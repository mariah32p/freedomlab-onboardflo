/*
  # Create user_branding table

  1. New Tables
    - `user_branding`
      - `id` (uuid, primary key)
      - `user_id` (uuid, unique, foreign key to auth.users)
      - `logo_url` (text, optional)
      - `primary_color` (text, default '#10b981')
      - `secondary_color` (text, default '#059669')
      - `font_family` (text, default 'Montserrat')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_branding` table
    - Add policies for authenticated users to manage their own branding data
*/

CREATE TABLE IF NOT EXISTS public.user_branding (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  logo_url text,
  primary_color text DEFAULT '#10b981'::text NOT NULL,
  secondary_color text DEFAULT '#059669'::text NOT NULL,
  font_family text DEFAULT 'Montserrat'::text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT user_branding_pkey PRIMARY KEY (id),
  CONSTRAINT user_branding_user_id_key UNIQUE (user_id),
  CONSTRAINT user_branding_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE public.user_branding ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own branding"
  ON public.user_branding
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own branding"
  ON public.user_branding
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own branding"
  ON public.user_branding
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);