-- Generated by Gemini

-- Dummy data for Users table
INSERT INTO users (first_name, last_name, email, pwd, phone_number, profile_picture, is_owner) VALUES
('Alice', 'Smith', 'alice.smith@email.com', 'hashed_password_1', '123-456-7890', 'alice.jpg', TRUE),
('Bob', 'Johnson', 'bob.johnson@email.com', 'hashed_password_2', '987-654-3210', 'bob.png', FALSE),
('Charlie', 'Brown', 'charlie.brown@email.com', 'hashed_password_3', '555-123-4567', 'charlie.gif', TRUE),
('Diana', 'Miller', 'diana.miller@email.com', 'hashed_password_4', '111-222-3333', 'diana.jpeg', FALSE);

-- Dummy data for Properties table
INSERT INTO properties (owner_id, property_name, property_description, location_name, latitude, longitude, city, country, property_type, amenities, rules, check_in_time, check_out_time, price_per_night, capacity, number_of_reviews, average_rating, is_active, note_from_owner) VALUES
(1, 'Riverside Retreat', 'Secluded campsite by the flowing river, perfect for fishing and relaxation.', 'Riverbend Valley', 40.7128, -74.0060, 'City of New York', 'United States', 'Tent', 'Picnic table, fire pit, potable water nearby', 'No loud music after 10 PM, respect wildlife.', '14:00', '11:00', 35.00, 4, 15, 4.8, TRUE, 'Enjoy the sounds of nature!'),
(3, 'Mountain Top Cabin', 'Cozy cabin with stunning panoramic mountain views.', 'Eagle Peak', 34.0522, -118.2437, 'Los Angelos', 'United States', 'Cabin', 'Full kitchen, bathroom with shower, fireplace, private deck', 'No smoking inside, pets allowed on leash.', '15:00', '10:00', 75.00, 2, 22, 4.5, TRUE, 'Bring warm clothes, nights can be chilly.'),
(1, 'Forest Glamping Tent', 'Luxury camping experience in a spacious and stylish tent.', 'Whispering Woods', 51.5074, 0.1278, 'London', 'United Kingdom', 'Glamp', 'Comfortable beds, solar lighting, outdoor seating area', 'Leave no trace, quiet hours from 11 PM.', '16:00', '12:00', 60.00, 3, 8, 4.9, TRUE, 'Experience the beauty of the forest in comfort.'),
(3, 'Lakeside RV Spot', 'Spacious RV spot with full hookups right by the serene lake.', 'Clearwater Lake', 37.7749, -122.4194, 'San Fransico', 'United States', 'RV', 'Electric hookup, water hookup, sewage dump station', 'Maximum stay 7 days, respect other campers.', '13:00', '12:00', 50.00, 6, 5, 4.2, TRUE, 'Great for boating and fishing enthusiasts.');

-- Dummy data for PropertyDetails table
INSERT INTO property_details (property_id, parking_available, pet_friendly, has_campfire_pit, has_personal_restroom, has_shared_restroom, has_personal_shower, has_shared_shower, has_personal_kitchen, has_shared_kitchen, has_sockets, has_views, has_picnic_table, has_grill, has_safety_features, has_personal_dryer, has_shared_dryer, has_wifi, has_cell_service, has_swimming_lake, has_swimming_pool, has_hiking_trail, is_wheelchair_accessible, has_fishing) VALUES
(1, TRUE, TRUE, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, TRUE, TRUE, TRUE, TRUE, FALSE, FALSE, FALSE, TRUE, TRUE, FALSE, TRUE, FALSE, TRUE),
(2, TRUE, TRUE, TRUE, TRUE, FALSE, TRUE, FALSE, TRUE, FALSE, TRUE, TRUE, TRUE, TRUE, FALSE, TRUE, FALSE, TRUE, TRUE, FALSE, FALSE, TRUE, FALSE, FALSE),
(3, TRUE, FALSE, TRUE, FALSE, TRUE, FALSE, TRUE, FALSE, FALSE, TRUE, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, TRUE, TRUE, FALSE, FALSE, TRUE, FALSE, FALSE),
(4, TRUE, TRUE, FALSE, FALSE, TRUE, FALSE, TRUE, FALSE, FALSE, TRUE, TRUE, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, TRUE, TRUE, FALSE, FALSE, TRUE, TRUE);

-- Dummy data for user_saves table
INSERT INTO user_saves (user_id, property_id) VALUES
(2, 1),
(4, 2),
(2, 3);

-- Dummy data for Bookings table
INSERT INTO bookings (property_id, guest_id, check_in_date, check_out_date, number_of_guests, total_price, booking_status) VALUES
(1, 2, '2025-05-10', '2025-05-12', 2, 70.00, 'confirmed'),
(2, 4, '2025-06-01', '2025-06-05', 1, 300.00, 'confirmed'),
(3, 2, '2025-07-15', '2025-07-16', 3, 60.00, 'pending'),
(4, 4, '2025-08-20', '2025-08-23', 4, 150.00, 'confirmed');

-- Dummy data for PropertyImages table
INSERT INTO property_images (property_id, image_url, alt_text, is_main) VALUES
(1, 'riverside_1.jpg', 'Riverside campsite view', TRUE),
(1, 'riverside_2.jpg', 'River flowing by the campsite', FALSE),
(2, 'cabin_1.jpg', 'Exterior view of mountain cabin', TRUE),
(3, 'glamping_1.jpg', 'Inside the stylish glamping tent', TRUE),
(4, 'rv_spot_1.jpg', 'RV parked by the lake', TRUE);

-- Dummy data for Reviews table
INSERT INTO reviews (property_id, guest_id, rating, comment) VALUES
(1, 2, 5, 'Beautiful location right by the river!'),
(2, 4, 4, 'Cabin was cozy and the views were amazing.'),
(1, 4, 4, 'Great spot, enjoyed the campfire.'),
(3, 2, 5, 'The glamping tent was so comfortable and unique.'),
(4, 2, 3, 'Good RV spot, but the hookups were a bit finicky.');

-- Dummy data for Notifications table
INSERT INTO notifications (user_id, notification_type, notification_message, is_read) VALUES
(2, 'booking_confirmation', 'Your booking for Riverside Retreat on 2025-05-10 has been confirmed.', TRUE),
(1, 'new_review', 'New review received for your property Mountain Top Cabin.', FALSE),
(4, 'booking_reminder', 'Reminder: Your booking for Mountain Top Cabin on 2025-06-01 is approaching.', FALSE),
(2, 'property_saved', 'You saved the property Mountain Top Cabin to your favorites.', TRUE);