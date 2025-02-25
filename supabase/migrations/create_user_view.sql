CREATE OR REPLACE VIEW full_user_info AS
SELECT 
    au.id,
    au.email,
    up.username,
    up.contact_number,
    ur.role,
    ur.business_id,
    ur.outlet_id,
    b.name AS business_name,
    o.name AS outlet_name
FROM 
    auth.users au
LEFT JOIN user_profiles up ON au.id = up.id
LEFT JOIN user_roles ur ON au.id = ur.user_id
LEFT JOIN businesses b ON ur.business_id = b.id
LEFT JOIN outlets o ON ur.outlet_id = o.id;

