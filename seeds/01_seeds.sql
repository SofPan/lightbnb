INSERT INTO users (name, email, password)
VALUES('ownerz_rock42', 'i_own_property@socool.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('wanderlust88', 'vacay_is_life@travelsalot.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('just_looking_0k', 'fake-email@email.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties(owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 'A piece of paradise', 'description', 'thumb-url.com', 'cover-url.com', 120, 1, 3, 3, 'Mexico', 'Playa Linda', 'Zihuatanejo', 'Guerrero', '12345', TRUE),
(1, 'Going to be torn down', 'description', 'thumb-url.com', 'cover-url.com', 10, 0, 1, 1, 'Canada', 'My Back Yard', 'Toronto', 'Ontario', 'L0L 0N0', FALSE),
(3, 'Not a real property', 'description', 'thumb-url.com', 'cover-url.com', 50, 4, 17, 1, 'Somewhere', 'Over', 'Here', 'I guess', '000000', TRUE);

INSERT INTO reservations(start_date, end_date, property_id, guest_id)
VALUES('01-01-2025', '03-31-2025', 1, 2),
('04-01-2025', '04-15-2025', 3, 3),
('12-30-2024', '12-31-2024', 2, 2);

INSERT INTO property_reviews(property_id, guest_id, reservation_id, rating, message)
VALUES(1, 2, 1, 5, 'PERFECTION!!!!!'),
(3, 3, 2, 0, 'This place does not exist!!!'),
(2, 2, 3, 1, 'Oops, I should have read the title...');
