-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
    id BIGSERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT,
    activation_code VARCHAR(255) NOT NULL,
    subscription_type VARCHAR(50) NOT NULL,
    device_count INTEGER NOT NULL,
    subscription_start DATE NOT NULL,
    subscription_end DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT REFERENCES users(id),
    agent_name VARCHAR(255) NOT NULL,
    version_type VARCHAR(50) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_customers_customer_name ON customers(customer_name);
CREATE INDEX IF NOT EXISTS idx_customers_business_name ON customers(business_name);
CREATE INDEX IF NOT EXISTS idx_customers_activation_code ON customers(activation_code);

-- Insert default admin user
INSERT INTO users (username, password, full_name, role)
VALUES (
    'admin',
    '$2a$10$xKR8HGdJ5yQgHgEQgRJBEOB5AhRlUxQD7yF5LVqGQjTqIrwHJrKf6', -- hashed password for 'admin123'
    'System Administrator',
    'admin'
) ON CONFLICT (username) DO NOTHING;
