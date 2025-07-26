-- Restore staff table for two-table approach
-- Run this in your Supabase SQL Editor

-- Create staff table (separate from profiles)
CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    password TEXT NOT NULL, -- Plain text password for simplicity
    department TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_staff_staff_id ON staff(staff_id);

-- Enable RLS
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- RLS Policy for staff table (admin only)
CREATE POLICY "Admins can manage staff" ON staff
    FOR ALL USING (auth.role() = 'authenticated' AND 
       EXISTS (
           SELECT 1 
           FROM profiles 
           WHERE id = auth.uid() AND role = 'admin'
       ));

-- Insert some sample staff (optional)
INSERT INTO staff (staff_id, first_name, last_name, password, department, phone) VALUES
('STAFF001', 'John', 'Doe', 'password123', 'IT', '555-0101'),
('STAFF002', 'Jane', 'Smith', 'password123', 'HR', '555-0102'); 