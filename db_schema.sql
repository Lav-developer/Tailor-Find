-- Database schema for TailorFind PHP website

CREATE DATABASE IF NOT EXISTS tailorfind;
USE tailorfind;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('customer', 'tailor') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tailors table (extends users)
CREATE TABLE tailors (
    id INT PRIMARY KEY,
    address TEXT,
    mobile VARCHAR(20),
    specialties TEXT, -- comma-separated
    experience INT DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    description TEXT,
    price_min INT DEFAULT 0,
    price_max INT DEFAULT 0,
    working_hours_start TIME DEFAULT '09:00:00',
    working_hours_end TIME DEFAULT '18:00:00',
    is_available BOOLEAN DEFAULT TRUE,
    total_bookings INT DEFAULT 0,
    completed_bookings INT DEFAULT 0,
    joined_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bookings table
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tailor_id INT NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_mobile VARCHAR(20) NOT NULL,
    service_type VARCHAR(255) NOT NULL,
    preferred_date DATE NOT NULL,
    description TEXT,
    status ENUM('pending', 'accepted', 'rejected', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tailor_id) REFERENCES tailors(id)
);

-- Reviews table
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tailor_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tailor_id) REFERENCES tailors(id)
);

-- Portfolio table
CREATE TABLE portfolio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tailor_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tailor_id) REFERENCES tailors(id)
);

-- Insert sample data
INSERT INTO users (email, password, name, role) VALUES
('john@tailorfind.com', '$2y$10$examplehashedpassword', 'John Doe', 'tailor'),
('admin@tailorfind.com', '$2y$10$examplehashedpassword', 'Admin', 'customer');

INSERT INTO tailors (id, address, mobile, specialties, experience, rating, description, price_min, price_max, is_available, total_bookings, completed_bookings) VALUES
(1, '123 Main St, Mumbai', '+919876543210', 'Alterations,Custom Suits', 5, 4.5, 'Expert tailor with a passion for quality.', 500, 5000, TRUE, 0, 0);
