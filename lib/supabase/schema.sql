-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Create search_history table
CREATE TABLE IF NOT EXISTS public.search_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  query TEXT NOT NULL,
  config JSONB NOT NULL,
  result_count INTEGER DEFAULT 0,
  results JSONB DEFAULT '[]'::jsonb,
  shared BOOLEAN DEFAULT FALSE,
  share_token TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

-- Search history policies
CREATE POLICY "Users can view own search history"
  ON public.search_history
  FOR SELECT
  USING (auth.uid() = user_id OR (shared = TRUE AND share_token IS NOT NULL));

CREATE POLICY "Users can insert own search history"
  ON public.search_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own search history"
  ON public.search_history
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own search history"
  ON public.search_history
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create usage_limits table
CREATE TABLE IF NOT EXISTS public.usage_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  searches_this_month INTEGER DEFAULT 0,
  exports_this_month INTEGER DEFAULT 0,
  last_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  max_searches INTEGER DEFAULT 100,
  max_exports INTEGER DEFAULT 50
);

-- Enable RLS
ALTER TABLE public.usage_limits ENABLE ROW LEVEL SECURITY;

-- Usage limits policies
CREATE POLICY "Users can view own usage limits"
  ON public.usage_limits
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own usage limits"
  ON public.usage_limits
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  
  INSERT INTO public.usage_limits (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to reset usage limits monthly
CREATE OR REPLACE FUNCTION public.reset_monthly_limits()
RETURNS void AS $$
BEGIN
  UPDATE public.usage_limits
  SET 
    searches_this_month = 0,
    exports_this_month = 0,
    last_reset = NOW()
  WHERE 
    EXTRACT(MONTH FROM last_reset) != EXTRACT(MONTH FROM NOW())
    OR EXTRACT(YEAR FROM last_reset) != EXTRACT(YEAR FROM NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON public.search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_share_token ON public.search_history(share_token) WHERE shared = TRUE;
CREATE INDEX IF NOT EXISTS idx_usage_limits_user_id ON public.usage_limits(user_id);
