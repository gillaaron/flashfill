-- Insert admin user
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES 
('d7bed83c-b88e-4609-a3ba-2a5e93491c5b', 'admin@freshnails.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', NOW(), NOW(), NOW());

INSERT INTO user_profiles (id, username, contact_number)
VALUES 
('d7bed83c-b88e-4609-a3ba-2a5e93491c5b', 'admin', '+6591234567');

INSERT INTO user_roles (user_id, role)
VALUES 
('d7bed83c-b88e-4609-a3ba-2a5e93491c5b', 'admin');

-- Insert business
INSERT INTO businesses (id, name, registration_number, address, contact_name, contact_number, contact_email)
VALUES 
('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Fresh Nails', 'BN12345678', '123 Beauty Street, #01-01, Singapore 123456', 'Jane Doe', '+6598765432', 'contact@freshnails.com');

-- Insert outlet
INSERT INTO outlets (id, business_id, name, address, latitude, longitude, contact_person, contact_number, email)
VALUES 
('b5f8c8b9-2c8a-4f3f-8a1d-6e9b7b8c9d0e', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Fresh Nails - Serangoon Gardens', '1 Serangoon Garden Way, Singapore 555961', 1.3644, 103.8652, 'John Smith', '+6597654321', 'serangoon@freshnails.com');

-- Insert brand manager
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES 
('a1b2c3d4-e5f6-4a5b-9c3d-2e1f0a9b8c7d', 'brandmanager@freshnails.com', '$2a$10$abcdefghijklmnopqrstuvwxyz789012', NOW(), NOW(), NOW());

INSERT INTO user_profiles (id, username, contact_number)
VALUES 
('a1b2c3d4-e5f6-4a5b-9c3d-2e1f0a9b8c7d', 'brandmanager', '+6593456789');

INSERT INTO user_roles (user_id, role, business_id)
VALUES 
('a1b2c3d4-e5f6-4a5b-9c3d-2e1f0a9b8c7d', 'brand_manager', 'f47ac10b-58cc-4372-a567-0e02b2c3d479');

-- Insert outlet manager
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES 
('e1d2c3b4-a5b6-7c8d-9e0f-1a2b3c4d5e6f', 'outletmanager@freshnails.com', '$2a$10$abcdefghijklmnopqrstuvwxyz345678', NOW(), NOW(), NOW());

INSERT INTO user_profiles (id, username, contact_number)
VALUES 
('e1d2c3b4-a5b6-7c8d-9e0f-1a2b3c4d5e6f', 'outletmanager', '+6594567890');

INSERT INTO user_roles (user_id, role, business_id, outlet_id)
VALUES 
('e1d2c3b4-a5b6-7c8d-9e0f-1a2b3c4d5e6f', 'outlet_manager', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'b5f8c8b9-2c8a-4f3f-8a1d-6e9b7b8c9d0e');

-- Insert some sample contacts
INSERT INTO contacts (name, phone, email, business_id, outlet_id)
VALUES 
('Alice Wong', '+6591112222', 'alice@example.com', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'b5f8c8b9-2c8a-4f3f-8a1d-6e9b7b8c9d0e'),
('Bob Tan', '+6592223333', 'bob@example.com', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'b5f8c8b9-2c8a-4f3f-8a1d-6e9b7b8c9d0e'),
('Charlie Lim', '+6593334444', 'charlie@example.com', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'b5f8c8b9-2c8a-4f3f-8a1d-6e9b7b8c9d0e');

-- Insert some sample appointment slots
INSERT INTO appointment_slots (outlet_id, date, discount)
VALUES 
('b5f8c8b9-2c8a-4f3f-8a1d-6e9b7b8c9d0e', '2023-06-01', 10),
('b5f8c8b9-2c8a-4f3f-8a1d-6e9b7b8c9d0e', '2023-06-02', 15),
('b5f8c8b9-2c8a-4f3f-8a1d-6e9b7b8c9d0e', '2023-06-03', 20);

-- Insert some sample appointments
INSERT INTO appointments (contact_id, slot_id, status)
VALUES 
((SELECT id FROM contacts WHERE name = 'Alice Wong'), (SELECT id FROM appointment_slots WHERE date = '2023-06-01'), 'confirmed'),
((SELECT id FROM contacts WHERE name = 'Bob Tan'), (SELECT id FROM appointment_slots WHERE date = '2023-06-02'), 'pending'),
((SELECT id FROM contacts WHERE name = 'Charlie Lim'), (SELECT id FROM appointment_slots WHERE date = '2023-06-03'), 'cancelled');

