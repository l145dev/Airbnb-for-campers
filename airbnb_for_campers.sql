-- SQL file for PostgreSQL made with Gemini, reviewed & fixed by Aryan

-- Drop tables if they exist (for development/testing purposes)
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS property_images;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS property_details;
DROP TABLE IF EXISTS properties;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS notifications;

-- Create Users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    pwd VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    profile_picture VARCHAR(255),
    is_owner BOOLEAN DEFAULT FALSE,
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Properties table
CREATE TABLE properties (
    property_id SERIAL PRIMARY KEY,
    owner_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    property_name VARCHAR(255) NOT NULL,
    property_description TEXT,
    location_name VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    property_type VARCHAR(50) DEFAULT 'Tent' CHECK (property_type IN ('Cabin', 'Tent', 'RV', 'Treehouse', 'Glamp', 'Farm', 'Yurt', 'Unique', 'Other')),
    amenities TEXT,
    rules TEXT,
    check_in_time TIME,
    check_out_time TIME,
    price_per_night DECIMAL(10, 2) NOT NULL,
    capacity INTEGER,
    number_of_reviews INTEGER DEFAULT 0,
    average_rating DECIMAL(3, 1),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create PropertyDetails table
CREATE TABLE property_details (
    property_detail_id SERIAL PRIMARY KEY,
    property_id INTEGER UNIQUE NOT NULL REFERENCES properties(property_id) ON DELETE CASCADE,
    parking_available BOOLEAN,
    pet_friendly BOOLEAN,
    has_campfire_pit BOOLEAN,
    has_restrooms BOOLEAN,
    has_showers BOOLEAN,
    water_source VARCHAR(255),
    electricity_available BOOLEAN,
    views VARCHAR(255),
    safety_features TEXT
);

-- Create the user_saves table
CREATE TABLE user_saves (
    user_save_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    property_id INTEGER NOT NULL,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign key constraints
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (property_id) REFERENCES properties(property_id),

    -- Prevent duplicate saves for the same user and property
    UNIQUE (user_id, property_id)
);

-- Create Bookings table
CREATE TABLE bookings (
    booking_id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES properties(property_id) ON DELETE CASCADE,
    guest_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    number_of_guests INTEGER NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    booking_status VARCHAR(50) DEFAULT 'pending',
    booking_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create PropertyImages table
CREATE TABLE property_images (
    image_id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES properties(property_id) ON DELETE CASCADE,
    image_url VARCHAR(255) NOT NULL,
    alt_text VARCHAR(255),
    is_main BOOLEAN
);

-- Create Reviews table
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES properties(property_id) ON DELETE CASCADE,
    guest_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    review_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Notifications table
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    notification_type VARCHAR(100) NOT NULL,
    notification_message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for foreign keys and frequently queried columns
CREATE INDEX idx_owner_id ON properties (owner_id);
CREATE INDEX idx_guest_id ON bookings (guest_id);
CREATE INDEX idx_property_id_bookings ON bookings (property_id);
CREATE INDEX idx_property_id_images ON property_images (property_id);
CREATE INDEX idx_property_id_reviews ON reviews (property_id);
CREATE INDEX idx_guest_id_reviews ON reviews (guest_id);
CREATE INDEX idx_user_id_notifications ON notifications (user_id);
CREATE INDEX idx_user_saved_properties ON user_saves (user_id);
CREATE INDEX idx_property_saved_by_users ON user_saves (property_id);