-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  contact_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Modify businesses table
ALTER TABLE businesses
ADD COLUMN registration_number TEXT,
ADD COLUMN address TEXT,
ADD COLUMN contact_name TEXT,
ADD COLUMN contact_number TEXT,
ADD COLUMN contact_email TEXT,
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Modify outlets table
ALTER TABLE outlets
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Modify appointment_slots table
ALTER TABLE appointment_slots
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Modify contacts table
ALTER TABLE contacts
ADD COLUMN business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
ADD COLUMN outlet_id UUID REFERENCES outlets(id) ON DELETE CASCADE,
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Modify appointments table
ALTER TABLE appointments
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Modify user_roles table
ALTER TABLE user_roles
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create trigger function for updating 'updated_at'
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for each table
CREATE TRIGGER update_users_modtime
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_businesses_modtime
BEFORE UPDATE ON businesses
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_outlets_modtime
BEFORE UPDATE ON outlets
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_appointment_slots_modtime
BEFORE UPDATE ON appointment_slots
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_contacts_modtime
BEFORE UPDATE ON contacts
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_appointments_modtime
BEFORE UPDATE ON appointments
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_user_roles_modtime
BEFORE UPDATE ON user_roles
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Add index for contacts table
CREATE INDEX idx_contacts_business_id ON contacts(business_id);
CREATE INDEX idx_contacts_outlet_id ON contacts(outlet_id);

