-- Drop the existing user_roles table
DROP TABLE IF EXISTS user_roles;

-- Alter the user_profiles table to include role information
ALTER TABLE user_profiles
ADD COLUMN role TEXT,
ADD COLUMN business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
ADD COLUMN outlet_id UUID REFERENCES outlets(id) ON DELETE CASCADE;

-- Update existing user_profiles with role information
-- (This assumes we have a way to match users between the tables)
UPDATE user_profiles
SET role = user_roles.role,
    business_id = user_roles.business_id,
    outlet_id = user_roles.outlet_id
FROM user_roles
WHERE user_profiles.id = user_roles.user_id;

-- Add any necessary indexes
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_profiles_business_id ON user_profiles(business_id);
CREATE INDEX idx_user_profiles_outlet_id ON user_profiles(outlet_id);

