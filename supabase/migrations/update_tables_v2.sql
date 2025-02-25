-- Create user_profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE,
  contact_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Modify user_roles table
ALTER TABLE user_roles
DROP COLUMN user_id,
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create trigger function for updating 'updated_at'
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
   END;
$$ LANGUAGE plpgsql;

-- Create trigger for user_profiles table
CREATE TRIGGER update_user_profiles_modtime
BEFORE UPDATE ON user_profiles
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Add index for user_profiles table
CREATE INDEX idx_user_profiles_user_id ON user_profiles(id);

