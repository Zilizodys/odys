-- Supprime d'abord les tables dépendantes
DROP TABLE IF EXISTS public.programs CASCADE;
DROP TABLE IF EXISTS public.settings CASCADE;

-- Supprime la table users avec CASCADE pour gérer toutes les dépendances
DROP TABLE IF EXISTS public.users CASCADE;

-- Crée la table users
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Active RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Crée un trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Supprime les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own data" ON public.users;

-- Crée les politiques RLS
CREATE POLICY "Users can view their own data"
    ON public.users
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
    ON public.users
    FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own data"
    ON public.users
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Donne les permissions nécessaires
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.users TO service_role;

-- Recrée la table programs avec la référence à users
CREATE TABLE public.programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recrée la table settings avec la référence à users
CREATE TABLE public.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Active RLS pour les nouvelles tables
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Crée les politiques pour programs
CREATE POLICY "Users can view their own programs"
    ON public.programs
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own programs"
    ON public.programs
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own programs"
    ON public.programs
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Crée les politiques pour settings
CREATE POLICY "Users can view their own settings"
    ON public.settings
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
    ON public.settings
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
    ON public.settings
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Donne les permissions pour les nouvelles tables
GRANT ALL ON public.programs TO authenticated;
GRANT ALL ON public.programs TO service_role;
GRANT ALL ON public.settings TO authenticated;
GRANT ALL ON public.settings TO service_role; 