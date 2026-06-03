-- ===========================================================================
-- EliteRide Car Rental Dashboard Database Schema (PostgreSQL Compatible)
-- ===========================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================================================
-- 1. LOCATIONS TABLE
-- ===========================================================================
CREATE TABLE locations (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(50) NOT NULL,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL
);

-- ===========================================================================
-- 2. FLEET (CARS) TABLE
-- ===========================================================================
CREATE TABLE fleet (
    id VARCHAR(50) PRIMARY KEY,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    plate VARCHAR(30) UNIQUE NOT NULL,
    color VARCHAR(30) NOT NULL,
    type VARCHAR(30) NOT NULL, -- SUV, Economy, Compact, Luxury, Sedan, City
    transmission VARCHAR(20) NOT NULL, -- Manual, Automatic
    fuel VARCHAR(20) NOT NULL, -- Gasoline, Diesel, Electric
    seats INT NOT NULL,
    doors INT NOT NULL,
    mileage INT NOT NULL,
    engine_size VARCHAR(50),
    vin VARCHAR(50),
    status VARCHAR(30) DEFAULT 'available' NOT NULL, -- available, reserved, rented, maintenance
    image TEXT NOT NULL,
    description TEXT,
    notes TEXT,
    internal_notes TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    
    -- Prices
    price_per_day NUMERIC(10, 2) NOT NULL,
    price_per_week NUMERIC(10, 2),
    price_per_month NUMERIC(10, 2),
    deposit_amount NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    late_fee NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    extra_mileage_fee NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    
    -- Insurance & Docs
    insurance_provider VARCHAR(100),
    insurance_number VARCHAR(100),
    insurance_start DATE,
    insurance_end DATE,
    registration_number VARCHAR(50),
    registration_expiry DATE,
    inspection_date DATE,
    inspection_expiry DATE,
    
    -- Service dates
    last_service DATE NOT NULL,
    next_service DATE NOT NULL,
    last_service_mileage INT,
    maintenance_notes TEXT,
    garage_name VARCHAR(100)
);

-- ===========================================================================
-- 3. CLIENTS TABLE (Unified Client & Blocked Client model)
-- ===========================================================================
CREATE TABLE clients (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(30) UNIQUE NOT NULL,
    whatsapp VARCHAR(30),
    email VARCHAR(100),
    city VARCHAR(50),
    address TEXT,
    nationality VARCHAR(50) DEFAULT 'Algerian' NOT NULL,
    id_number VARCHAR(50),
    license_number VARCHAR(50) NOT NULL,
    license_expiry DATE,
    
    source VARCHAR(20) DEFAULT 'walk-in' NOT NULL, -- online, walk-in, phone
    status VARCHAR(20) DEFAULT 'active' NOT NULL, -- active, blocked, new, vip
    joined_date DATE DEFAULT CURRENT_DATE NOT NULL,
    
    -- Stat counters (calculated or synced)
    total_rentals INT DEFAULT 0 NOT NULL,
    active_rentals INT DEFAULT 0 NOT NULL,
    completed_rentals INT DEFAULT 0 NOT NULL,
    cancelled_rentals INT DEFAULT 0 NOT NULL,
    total_spend NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    last_rental_date DATE,
    
    -- Trust & Risk
    trust_score INT DEFAULT 75 NOT NULL,
    late_returns INT DEFAULT 0 NOT NULL,
    damages INT DEFAULT 0 NOT NULL,
    
    -- Deposits & Balance
    deposit_held NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    deposit_returned NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    pending_balance NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    
    -- Notes & Blocked attributes
    blocked_reason TEXT,
    blocked_rental_ref VARCHAR(50),
    internal_notes TEXT,
    warning_notes TEXT,
    date_of_birth DATE
);

-- ===========================================================================
-- 4. BOOKING REQUESTS TABLE
-- ===========================================================================
CREATE TABLE booking_requests (
    id VARCHAR(50) PRIMARY KEY,
    customer VARCHAR(100) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(100),
    car VARCHAR(100) NOT NULL,
    pickup_date TIMESTAMP WITH TIME ZONE NOT NULL,
    return_date TIMESTAMP WITH TIME ZONE NOT NULL,
    pickup_location VARCHAR(100) NOT NULL,
    return_location VARCHAR(100) NOT NULL,
    status VARCHAR(30) DEFAULT 'new' NOT NULL, -- new, contacted, confirmed, cancelled
    source VARCHAR(20) DEFAULT 'online' NOT NULL, -- online, walk-in, phone
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    notes TEXT
);

-- ===========================================================================
-- 5. RENTALS TABLE
-- ===========================================================================
CREATE TABLE rentals (
    id VARCHAR(50) PRIMARY KEY,
    reference VARCHAR(50) UNIQUE NOT NULL,
    client_id VARCHAR(50) REFERENCES clients(id) ON DELETE SET NULL,
    vehicle_id VARCHAR(50) REFERENCES fleet(id) ON DELETE SET NULL,
    client VARCHAR(100) NOT NULL, -- Fallback denormalized client name
    client_phone VARCHAR(30) NOT NULL, -- Fallback denormalized phone
    car VARCHAR(100) NOT NULL, -- Fallback denormalized car name
    plate VARCHAR(30) NOT NULL, -- Fallback denormalized plate
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    deposit NUMERIC(10, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'reserved' NOT NULL, -- active, overdue, completed, reserved
    source VARCHAR(20) NOT NULL, -- online, walk-in, phone
    pickup_location VARCHAR(100) NOT NULL,
    return_location VARCHAR(100),
    driver_license VARCHAR(50) NOT NULL,
    notes TEXT
);

-- ===========================================================================
-- 6. MAINTENANCE RECORDS TABLE
-- ===========================================================================
CREATE TABLE maintenance_records (
    id VARCHAR(50) PRIMARY KEY,
    vehicle_id VARCHAR(50) REFERENCES fleet(id) ON DELETE CASCADE,
    car VARCHAR(100) NOT NULL, -- Fallback denormalized vehicle name
    plate VARCHAR(30) NOT NULL, -- Fallback denormalized plate
    type VARCHAR(100) NOT NULL, -- AC Compressor Replacement, Oil Change, etc.
    status VARCHAR(30) DEFAULT 'due-soon' NOT NULL, -- due-soon, in-progress, completed
    scheduled_date DATE NOT NULL,
    completed_date DATE,
    next_service_date DATE,
    notes TEXT,
    mileage INT NOT NULL,
    garage VARCHAR(100) NOT NULL,
    estimated_cost NUMERIC(10, 2) NOT NULL
);

-- ===========================================================================
-- 7. ALERTS TABLE
-- ===========================================================================
CREATE TABLE alerts (
    id VARCHAR(50) PRIMARY KEY,
    type VARCHAR(50) NOT NULL, -- urgent-booking, overdue-rental, returning-today, maintenance, blocked-client
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium' NOT NULL, -- high, medium, low
    time VARCHAR(50) NOT NULL, -- e.g. '2h ago', 'Today' or Timestamp string
    related_id VARCHAR(50)
);

-- ===========================================================================
-- 8. RECENT ACTIVITY TABLE
-- ===========================================================================
CREATE TABLE recent_activity (
    id VARCHAR(50) PRIMARY KEY,
    type VARCHAR(30) NOT NULL, -- booking, rental, return, client, fleet, payment
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    time VARCHAR(50) NOT NULL, -- Timestamp string or relative time '5 min ago'
    icon VARCHAR(10) NOT NULL
);

-- ===========================================================================
-- 9. NOTIFICATIONS TABLE
-- ===========================================================================
CREATE TABLE notifications (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    time VARCHAR(50) NOT NULL,
    read BOOLEAN DEFAULT FALSE NOT NULL,
    type VARCHAR(30) NOT NULL -- rental, booking, alert, client, maintenance
);


-- ===========================================================================
-- AUTOMATED TRIGGERS FOR DATA SYNC & INTEGRITY
-- ===========================================================================

-- Trigger function to automatically update Car Status in 'fleet' table 
-- when a Rental status is inserted or updated.
CREATE OR REPLACE FUNCTION sync_car_status_on_rental_change()
RETURNS TRIGGER AS $$
DECLARE
    next_status VARCHAR(30);
BEGIN
    IF (TG_OP = 'INSERT') OR (NEW.status <> OLD.status) THEN
        IF NEW.status = 'active' OR NEW.status = 'overdue' THEN
            next_status := 'rented';
        ELSIF NEW.status = 'reserved' THEN
            next_status := 'reserved';
        ELSIF NEW.status = 'completed' THEN
            next_status := 'available';
        END IF;

        IF next_status IS NOT NULL THEN
            UPDATE fleet
            SET status = next_status
            WHERE id = NEW.vehicle_id OR plate = NEW.plate;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_car_status_on_rental
AFTER INSERT OR UPDATE ON rentals
FOR EACH ROW
EXECUTE FUNCTION sync_car_status_on_rental_change();


-- Trigger function to automatically set Car Status to 'maintenance'
-- when a maintenance record status is 'in-progress'.
CREATE OR REPLACE FUNCTION sync_car_status_on_maintenance_change()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'in-progress' THEN
        UPDATE fleet
        SET status = 'maintenance'
        WHERE id = NEW.vehicle_id OR plate = NEW.plate;
    ELSIF NEW.status = 'completed' THEN
        UPDATE fleet
        SET status = 'available'
        WHERE id = NEW.vehicle_id OR plate = NEW.plate;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_car_status_on_maintenance
AFTER INSERT OR UPDATE ON maintenance_records
FOR EACH ROW
EXECUTE FUNCTION sync_car_status_on_maintenance_change();


-- ===========================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ===========================================================================
CREATE INDEX idx_fleet_plate ON fleet(plate);
CREATE INDEX idx_fleet_status ON fleet(status);
CREATE INDEX idx_clients_phone ON clients(phone);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_rentals_status ON rentals(status);
CREATE INDEX idx_rentals_client_id ON rentals(client_id);
CREATE INDEX idx_rentals_vehicle_id ON rentals(vehicle_id);
CREATE INDEX idx_bookings_status ON booking_requests(status);
CREATE INDEX idx_maintenance_vehicle ON maintenance_records(vehicle_id);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_notifications_read ON notifications(read);


-- ===========================================================================
-- DATA SEEDING (INITIAL VALUES FROM DASHBOARDDATA.TS)
-- ===========================================================================

-- 1. SEED LOCATIONS
INSERT INTO locations (id, name, address, city, notes, is_active) VALUES
('loc-1', 'Oran Airport', 'Ahmed Ben Bella Airport, Es Senia', 'Oran', 'Terminal 1 arrivals hall', TRUE),
('loc-2', 'Oran City Center', 'Place du 1er Novembre, Oran', 'Oran', '', TRUE),
('loc-3', 'Agency Main Office', 'Rue Ahmed Zabana, Oran 31000', 'Oran', 'Main office, free parking available', TRUE),
('loc-4', 'Es Senia', 'Es Senia District, Oran', 'Oran', '', TRUE),
('loc-5', 'Ahmed Ben Bella Airport', 'Es Senia International, Oran', 'Oran', 'International terminal', FALSE);

-- 2. SEED FLEET
INSERT INTO fleet (
    id, brand, model, year, plate, color, type, transmission, fuel, seats, doors, mileage, engine_size, vin, status, image, description, notes, internal_notes, is_active, is_featured,
    price_per_day, price_per_week, price_per_month, deposit_amount, late_fee, extra_mileage_fee, insurance_provider, insurance_number, insurance_start, insurance_end, registration_number, registration_expiry, inspection_date, inspection_expiry,
    last_service, next_service, last_service_mileage, garage_name, maintenance_notes
) VALUES
('f-1', 'Dacia', 'Duster', 2023, 'DAD-213-31', 'Grey Titanium', 'SUV', 'Manual', 'Diesel', 5, 5, 45230, '1.5 dCi 115hp', 'VF1HSRJFD12345678', 'available', 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=600&q=80', 'Reliable SUV, ideal for long trips and family use.', 'Well maintained. Minor scratch on rear bumper.', 'Regular client favorite.', TRUE, TRUE, 45.00, 280.00, 900.00, 150.00, 15.00, 0.25, 'AXA Algeria', 'AXA-2024-DAD-001', '2024-01-01', '2026-12-31', 'DAD-213-31', '2027-06-30', '2026-01-15', '2027-01-15', '2026-03-15', '2026-09-15', 40000, 'Renault Service Center, Oran', 'Oil and filters changed at 40,000 km.'),
('f-2', 'Renault', 'Clio 5', 2022, 'RCL-031-31', 'Pearl White', 'Economy', 'Manual', 'Gasoline', 5, 5, 28100, '1.0 TCe 100hp', 'VF1BJA00012345679', 'available', 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=600&q=80', 'Compact city car, fuel efficient and easy to park.', 'New tires installed Feb 2026.', 'Popular for city rentals.', TRUE, FALSE, 30.00, 185.00, 620.00, 100.00, 10.00, 0.20, 'CAAT Algeria', 'CAAT-2024-RCL-002', '2024-01-01', '2026-12-31', 'RCL-031-31', '2026-09-30', '2026-02-10', '2027-02-10', '2026-01-10', '2026-07-10', 25000, 'Renault Service Center, Oran', NULL),
('f-3', 'Peugeot', '208', 2023, 'PGT-208-16', 'Electric Blue', 'Compact', 'Automatic', 'Gasoline', 5, 5, 19400, '1.2 PureTech 130hp', NULL, 'reserved', 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=600&q=80', 'Sporty compact with automatic gearbox and premium interior.', 'Reserved by Karima Benali — pickup 2026-06-01.', 'VIP client. Ensure AC serviced.', TRUE, TRUE, 32.00, 200.00, 680.00, 120.00, 12.00, 0.22, 'SAA Algeria', 'SAA-2024-PGT-003', '2024-03-01', '2027-02-28', 'PGT-208-16', '2027-03-31', '2026-02-20', '2027-02-20', '2026-02-20', '2026-08-20', 15000, 'Peugeot Algeria, Oran', NULL),
('f-5', 'Hyundai', 'Tucson', 2023, 'HYT-045-31', 'Pearl White', 'SUV', 'Automatic', 'Diesel', 5, 5, 22500, '1.6 CRDi 136hp', NULL, 'rented', 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=600&q=80', 'Premium SUV with full connectivity and safety pack.', 'Currently rented to Youcef Mebarki. Return 2026-06-07.', NULL, TRUE, TRUE, 60.00, 370.00, 1200.00, 200.00, 20.00, 0.30, 'AXA Algeria', 'AXA-2024-HYT-005', '2024-04-01', '2027-03-31', 'HYT-045-31', '2028-04-30', '2026-03-01', '2027-03-01', '2026-03-01', '2026-09-01', 20000, 'Hyundai Service Center, Oran', NULL),
('f-6', 'Mercedes-Benz', 'C-Class', 2021, 'MBC-300-16', 'Obsidian Black', 'Luxury', 'Automatic', 'Gasoline', 5, 4, 87200, '2.0 Turbo 204hp', 'WDD2050081F456789', 'maintenance', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=600&q=80', 'Executive sedan with AMG styling and full luxury package.', 'In maintenance — AC compressor replacement. Est. ready 2026-06-03.', 'Only available for VIP/corporate clients.', TRUE, TRUE, 85.00, 520.00, 1800.00, 300.00, 30.00, 0.40, 'AXA Algeria', 'AXA-2021-MBC-006', '2021-06-01', '2027-05-31', 'MBC-300-16', '2027-11-30', '2025-11-20', '2026-11-20', '2025-11-20', '2026-05-20', 85000, 'Auto Prestige Garage, Oran', 'AC compressor replaced. Awaiting gas recharge.'),
('f-7', 'Toyota', 'Corolla', 2023, 'TYC-021-16', 'Midnight Black', 'Sedan', 'Automatic', 'Gasoline', 5, 4, 41600, '1.8 VVT-i 140hp', NULL, 'available', 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=600&q=80', 'Reliable and comfortable sedan, perfect for business travel.', 'Full service done April 2026. Clean interior.', 'Often requested by corporate clients.', TRUE, FALSE, 40.00, 245.00, 820.00, 130.00, 15.00, 0.22, 'CAAT Algeria', 'CAAT-2023-TYC-007', '2023-08-01', '2027-07-31', 'TYC-021-16', '2027-08-31', '2026-04-12', '2027-04-12', '2026-04-12', '2026-10-12', 40000, 'Toyota Algeria, Oran', NULL),
('f-8', 'Kia', 'Picanto', 2022, 'KPC-001-31', 'Lime Green', 'City', 'Manual', 'Gasoline', 4, 5, 15300, '1.0 MPI 67hp', NULL, 'rented', 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=600&q=80', 'Ultra-compact city car, easy parking, very economical.', 'Currently rented to Fatima Ziani. Return today.', NULL, TRUE, FALSE, 25.00, 155.00, 520.00, 80.00, 8.00, 0.18, 'SAA Algeria', 'SAA-2022-KPC-008', '2022-11-01', '2026-10-31', 'KPC-001-31', '2026-11-30', '2026-02-28', '2027-02-28', '2026-02-28', '2026-08-28', 12000, 'Pneus Express, Oran', NULL);

-- 3. SEED CLIENTS (Including Blocked Clients)
INSERT INTO clients (
    id, name, phone, whatsapp, email, city, address, nationality, id_number, license_number, license_expiry,
    source, status, joined_date, total_rentals, active_rentals, completed_rentals, cancelled_rentals, total_spend, last_rental_date,
    trust_score, late_returns, damages, deposit_held, deposit_returned, pending_balance, blocked_reason, blocked_rental_ref, internal_notes, warning_notes
) VALUES
('cl-1', 'Karima Benali', '0555 123 456', '0555 123 456', 'karima.benali@gmail.com', 'Oran', '12 Rue Larbi Ben M''hidi, Oran', 'Algerian', '31-09-123456-7', 'DL-09-2031-A', '2029-03-10', 'online', 'vip', '2025-03-10', 4, 1, 3, 0, 620.00, '2026-06-01', 95, 0, 0, 100.00, 0.00, 0.00, NULL, NULL, 'Excellent client. Always on time. Prefers automatic cars.', NULL),
('cl-2', 'Youcef Mebarki', '0661 987 321', '0661 987 321', 'y.mebarki@yahoo.fr', 'Alger', '45 Avenue Pasteur, Alger', 'Algerian', '16-87-234567-8', 'DL-16-1892-B', '2028-11-05', 'walk-in', 'active', '2024-11-05', 7, 1, 6, 0, 1850.00, '2026-06-01', 88, 1, 0, 200.00, 0.00, 0.00, NULL, NULL, 'Loyal walk-in client. Occasional late returns but always pays.', NULL),
('cl-3', 'Sarah Johnson', '0770 234 567', '0770 234 567', 'sarah.j@outlook.com', 'Oran', 'Hotel Meridien, Oran', 'British', 'UK-PASS-AB123456', 'DL-UK-44521', '2030-01-18', 'online', 'new', '2026-01-18', 2, 0, 2, 0, 290.00, '2026-04-24', 80, 0, 0, 0.00, 80.00, 0.00, NULL, NULL, 'Visiting for tourism. Always books from airport.', NULL),
('cl-4', 'Mohamed Amine Rais', '0551 456 789', '0551 456 789', 'm.rais@gmail.com', 'Constantine', '22 Rue Salah Bey, Constantine', 'Algerian', '25-85-345678-9', 'DL-25-0034-C', '2027-08-22', 'walk-in', 'active', '2025-08-22', 3, 0, 3, 0, 480.00, '2026-05-05', 82, 0, 0, 0.00, 130.00, 0.00, NULL, NULL, NULL, NULL),
('cl-5', 'Fatima Ziani', '0664 321 098', '0664 321 098', 'f.ziani@email.dz', 'Tlemcen', '7 Rue Khemisti, Tlemcen', 'Algerian', '13-81-456789-0', 'DL-13-5501-A', '2028-05-14', 'online', 'active', '2025-05-14', 5, 1, 4, 0, 730.00, '2026-05-29', 72, 1, 0, 50.00, 0.00, 0.00, NULL, NULL, NULL, 'Current rental overdue since 2026-05-31. Follow up required.'),
('cl-6', 'Lamine Bouzidi', '0771 678 901', '0771 678 901', 'lamine.b@gmail.com', 'Annaba', '18 Cours de la Révolution, Annaba', 'Algerian', '23-78-567890-1', 'DL-23-2210-B', '2027-09-30', 'walk-in', 'active', '2024-09-30', 6, 0, 6, 0, 1240.00, '2026-05-22', 90, 0, 0, 0.00, 150.00, 0.00, NULL, NULL, 'Very reliable client. Repeat customer since 2024.', NULL),
('cl-7', 'Emma Dupont', '0555 890 123', '0555 890 123', 'emma.d@mail.fr', 'Alger', 'Sheraton Hotel, Alger', 'French', 'FR-PASS-CD789012', 'DL-FR-77332', '2031-02-07', 'online', 'new', '2026-02-07', 2, 0, 1, 1, 90.00, '2026-03-10', 70, 0, 0, 0.00, 80.00, 0.00, NULL, NULL, 'Cancelled one booking last minute. Occasional visitor.', NULL),
('cl-8', 'Khalil Hadjadj', '0662 345 678', '0662 345 678', 'k.hadjadj@gmail.com', 'Sétif', '5 Rue de l''Indépendance, Sétif', 'Algerian', '19-76-678901-2', 'DL-19-3345-D', '2028-07-19', 'walk-in', 'active', '2025-07-19', 4, 0, 4, 0, 580.00, '2026-05-14', 87, 0, 0, 0.00, 80.00, 0.00, NULL, NULL, NULL, NULL),
('cl-9', 'Nadia Berkouk', '0772 012 345', '0772 012 345', 'nadia.berkouk@gmail.com', 'Oran', '33 Rue Mohamed Khemisti, Oran', 'Algerian', '31-77-789012-3', 'DL-31-7823-A', '2029-01-25', 'online', 'vip', '2025-01-25', 6, 0, 6, 0, 980.00, '2026-05-05', 94, 0, 0, 0.00, 100.00, 0.00, NULL, NULL, 'VIP repeat client. Always pays full deposit. Prefers Corolla or Tucson.', NULL),
('cl-10', 'David Chen', '0553 678 901', '0553 678 901', 'd.chen@outlook.com', 'Alger', 'Hilton Hotel, Alger', 'Chinese', 'CN-PASS-G12345678', 'DL-CN-19284', '2030-04-01', 'online', 'new', '2026-04-01', 1, 0, 1, 0, 200.00, '2026-04-05', 75, 0, 0, 0.00, 130.00, 0.00, NULL, NULL, 'Business travel. Needs official receipt. First rental successful.', NULL),
('cl-11', 'Aissa Rahmani', '0663 234 567', '0663 234 567', 'aissa.r@gmail.com', 'Tizi Ouzou', '8 Avenue Abane Ramdane, Tizi Ouzou', 'Algerian', '15-79-890123-4', 'DL-15-6612-C', '2027-06-03', 'walk-in', 'active', '2025-06-03', 4, 0, 4, 0, 660.00, '2026-04-18', 85, 0, 0, 0.00, 150.00, 0.00, NULL, NULL, NULL, NULL),
('cl-12', 'Victoria Grant', '0774 890 234', '0774 890 234', 'v.grant@email.com', 'Oran', 'Royal Hotel, Oran', 'American', 'US-PASS-A12345678', 'DL-US-55123', '2032-10-11', 'online', 'active', '2025-10-11', 3, 1, 2, 0, 480.00, '2026-06-25', 83, 0, 0, 150.00, 0.00, 0.00, NULL, NULL, NULL, NULL),

-- Blocked clients (merged into clients table with 'blocked' status)
('bc-1', 'Reda Chaouch', '0665 111 222', '0665 111 222', NULL, 'Oran', NULL, 'Algerian', NULL, 'DL-31-4401-X', NULL, 'walk-in', 'blocked', '2026-02-14', 2, 0, 2, 0, 180.00, NULL, 30, 0, 1, 0.00, 100.00, 0.00, 'Returned vehicle damaged (front bumper) and refused to pay repair costs.', 'RNT-2026-0041', NULL, NULL),
('bc-2', 'Hocine Amrani', '0778 333 444', '0778 333 444', NULL, 'Oran', NULL, 'Algerian', NULL, 'N/A', NULL, 'walk-in', 'blocked', '2026-01-28', 3, 0, 3, 0, 0.00, NULL, 30, 1, 0, 0.00, 0.00, 320.00, 'Non-payment of outstanding balance ($320) from rental in Jan 2026.', 'RNT-2026-0018', NULL, NULL),
('bc-3', 'Sofiane Belounis', '0556 555 666', '0556 555 666', NULL, 'Oran', NULL, 'Algerian', NULL, 'N/A', NULL, 'walk-in', 'blocked', '2026-03-05', 1, 0, 1, 0, 0.00, NULL, 30, 0, 0, 0.00, 0.00, 0.00, 'Provided false identity documents. Case referred to legal.', 'RNT-2026-0052', NULL, NULL);

-- 4. SEED BOOKING REQUESTS
INSERT INTO booking_requests (id, customer, phone, email, car, pickup_date, return_date, pickup_location, return_location, status, source, submitted_at, notes) VALUES
('br-1', 'Karima Benali', '0555 123 456', 'karima.benali@gmail.com', 'Peugeot 208', '2026-06-01 10:00:00+01', '2026-06-05 18:00:00+01', 'Oran Airport', 'Oran Airport', 'confirmed', 'online', '2026-05-28 14:30:00+01', 'Please have AC checked before pickup.'),
('br-2', 'Sarah Johnson', '0770 234 567', 'sarah.j@outlook.com', 'Dacia Duster', '2026-06-10 09:00:00+01', '2026-06-15 17:00:00+01', 'Oran Airport', 'Agency Main Office', 'new', 'online', '2026-05-31 09:15:00+01', 'International license, arriving flight AH-501.'),
('br-3', 'David Chen', '0553 678 901', 'd.chen@outlook.com', 'Toyota Corolla', '2026-07-01 08:30:00+01', '2026-07-05 16:30:00+01', 'Agency Main Office', 'Agency Main Office', 'contacted', 'online', '2026-05-30 16:45:00+01', 'Business trip. Needs receipt.'),
('br-4', 'Victoria Grant', '0774 890 234', 'v.grant@email.com', 'Volkswagen Golf 8', '2026-06-25 11:00:00+01', '2026-06-30 15:00:00+01', 'Oran City Center', 'Oran City Center', 'confirmed', 'online', '2026-05-29 11:00:00+01', ''),
('br-5', 'Nadia Berkouk', '0772 012 345', 'nadia.berkouk@gmail.com', 'Renault Clio 5', '2026-06-08 09:00:00+01', '2026-06-12 18:00:00+01', 'Agency Main Office', 'Agency Main Office', 'new', 'online', '2026-05-31 10:30:00+01', 'Prefers morning pickup.'),
('br-6', 'Emma Dupont', '0555 890 123', 'emma.d@mail.fr', 'Kia Picanto', '2026-06-03 14:00:00+01', '2026-06-06 12:00:00+01', 'Oran City Center', 'Oran City Center', 'cancelled', 'phone', '2026-05-27 08:20:00+01', 'Cancelled by client.'),
('br-7', 'Aissa Rahmani', '0663 234 567', 'aissa.r@gmail.com', 'Hyundai Tucson', '2026-06-14 10:00:00+01', '2026-06-18 19:00:00+01', 'Agency Main Office', 'Agency Main Office', 'new', 'online', '2026-05-31 07:45:00+01', 'Family trip, needs child seat.'),
('br-8', 'Mohamed Amine Rais', '0551 456 789', 'm.rais@gmail.com', 'Toyota Corolla', '2026-06-20 09:00:00+01', '2026-06-23 18:00:00+01', 'Agency Main Office', 'Agency Main Office', 'contacted', 'online', '2026-05-30 13:10:00+01', '');

-- 5. SEED RENTALS
-- Note: inserting these will invoke trg_sync_car_status_on_rental which keeps fleet statuses in sync.
INSERT INTO rentals (id, reference, client_id, vehicle_id, client, client_phone, car, plate, start_date, end_date, total_price, deposit, status, source, pickup_location, return_location, driver_license, notes) VALUES
('r-1', 'RNT-2026-0071', 'cl-2', 'f-5', 'Youcef Mebarki', '0661 987 321', 'Hyundai Tucson', 'HYT-045-31', '2026-06-01 09:00:00+01', '2026-06-07 18:00:00+01', 420.00, 200.00, 'active', 'walk-in', 'Agency Main Office', 'Agency Main Office', 'DL-16-1892-B', NULL),
('r-2', 'RNT-2026-0070', 'cl-5', 'f-8', 'Fatima Ziani', '0664 321 098', 'Kia Picanto', 'KPC-001-31', '2026-05-29 10:00:00+01', '2026-05-31 18:00:00+01', 50.00, 50.00, 'overdue', 'online', 'Oran City Center', 'Oran City Center', 'DL-13-5501-A', NULL),
('r-3', 'RNT-2026-0069', 'cl-1', 'f-3', 'Karima Benali', '0555 123 456', 'Peugeot 208', 'PGT-208-16', '2026-06-01 14:00:00+01', '2026-06-05 12:00:00+01', 128.00, 100.00, 'reserved', 'online', 'Oran Airport', 'Oran Airport', 'DL-09-2031-A', NULL),
('r-4', 'RNT-2026-0065', NULL, 'f-6', 'James Sterling', '0770 111 222', 'Mercedes-Benz C-Class', 'MBC-300-16', '2026-06-15 09:00:00+01', '2026-06-18 18:00:00+01', 255.00, 300.00, 'reserved', 'online', 'Agency Main Office', 'Agency Main Office', 'DL-UK-11245', NULL),
('r-5', 'RNT-2026-0060', 'cl-6', 'f-1', 'Lamine Bouzidi', '0771 678 901', 'Dacia Duster', 'DAD-213-31', '2026-05-15 08:30:00+01', '2026-05-22 19:30:00+01', 315.00, 150.00, 'completed', 'walk-in', 'Agency Main Office', 'Agency Main Office', 'DL-23-2210-B', NULL),
('r-6', 'RNT-2026-0058', 'cl-12', NULL, 'Victoria Grant', '0774 890 234', 'Volkswagen Golf 8', 'VWG-860-31', '2026-06-25 10:00:00+01', '2026-06-30 15:00:00+01', 250.00, 150.00, 'reserved', 'online', 'Oran City Center', 'Oran City Center', 'DL-US-55123', NULL),
('r-7', 'RNT-2026-0055', 'cl-8', 'f-2', 'Khalil Hadjadj', '0662 345 678', 'Renault Clio 5', 'RCL-031-31', '2026-05-10 09:00:00+01', '2026-05-14 17:00:00+01', 120.00, 80.00, 'completed', 'walk-in', 'Agency Main Office', 'Agency Main Office', 'DL-19-3345-D', NULL),
('r-8', 'RNT-2026-0048', 'cl-9', 'f-7', 'Nadia Berkouk', '0772 012 345', 'Toyota Corolla', 'TYC-021-16', '2026-05-01 08:00:00+01', '2026-05-05 18:00:00+01', 160.00, 100.00, 'completed', 'online', 'Oran City Center', 'Oran City Center', 'DL-31-7823-A', NULL),
('r-9', 'RNT-2026-0041', 'bc-1', 'f-1', 'Reda Chaouch', '0665 111 222', 'Dacia Duster', 'DAD-213-31', '2026-02-01 10:00:00+01', '2026-02-05 18:00:00+01', 180.00, 100.00, 'completed', 'walk-in', 'Agency Main Office', 'Agency Main Office', 'DL-31-4401-X', NULL),
('r-10', 'RNT-2026-0039', 'cl-3', 'f-2', 'Sarah Johnson', '0770 234 567', 'Renault Clio 5', 'RCL-031-31', '2026-04-20 09:00:00+01', '2026-04-24 16:00:00+01', 120.00, 80.00, 'completed', 'online', 'Oran Airport', 'Oran Airport', 'DL-UK-44521', NULL);

-- 6. SEED MAINTENANCE RECORDS
-- Note: inserting these may invoke trg_sync_car_status_on_maintenance which sets status to 'maintenance' or 'available'.
INSERT INTO maintenance_records (id, vehicle_id, car, plate, type, status, scheduled_date, completed_date, next_service_date, notes, mileage, garage, estimated_cost) VALUES
('m-1', 'f-6', 'Mercedes-Benz C-Class', 'MBC-300-16', 'AC Compressor Replacement', 'in-progress', '2026-05-29', NULL, NULL, 'AC not cooling. Compressor replaced. Awaiting gas recharge.', 87200, 'Auto Prestige Garage, Oran', 450.00),
('m-2', 'f-1', 'Dacia Duster', 'DAD-213-31', 'Oil Change + Filter', 'due-soon', '2026-06-10', NULL, NULL, 'Last oil change at 40,000 km. Due at 50,000 km.', 45230, 'Renault Service Center, Oran', 85.00),
('m-3', 'f-2', 'Renault Clio 5', 'RCL-031-31', 'Brake Pad Replacement', 'due-soon', '2026-06-15', NULL, NULL, 'Front brake pads showing wear. Rear pads OK.', 28100, 'Renault Service Center, Oran', 120.00),
('m-4', 'f-7', 'Toyota Corolla', 'TYC-021-16', 'Full Service Inspection', 'completed', '2026-04-12', '2026-04-12', NULL, 'All checks passed. Oil, filters, tires all replaced.', 41600, 'Toyota Algeria, Oran', 200.00),
('m-5', 'f-8', 'Kia Picanto', 'KPC-001-31', 'Tire Rotation & Alignment', 'due-soon', '2026-06-20', NULL, NULL, 'Slight pull to right detected. Alignment recommended.', 15300, 'Pneus Express, Oran', 60.00),
('m-7', 'f-5', 'Hyundai Tucson', 'HYT-045-31', 'Coolant System Flush', 'due-soon', '2026-07-01', NULL, NULL, 'Coolant change due per manufacturer schedule.', 22500, 'Hyundai Service Center, Oran', 90.00);

-- Make sure Mercedes C-Class remains 'maintenance' status after our seed (since m-1 is in-progress)
UPDATE fleet SET status = 'maintenance' WHERE id = 'f-6';
-- Make sure Hyundai Tucson remains 'rented' status (since r-1 is active)
UPDATE fleet SET status = 'rented' WHERE id = 'f-5';
-- Make sure Kia Picanto remains 'rented' status (since r-2 is overdue)
UPDATE fleet SET status = 'rented' WHERE id = 'f-8';
-- Make sure Peugeot 208 remains 'reserved' status (since r-3 is reserved)
UPDATE fleet SET status = 'reserved' WHERE id = 'f-3';

-- 7. SEED ALERTS
INSERT INTO alerts (id, type, title, message, severity, time, related_id) VALUES
('a-1', 'overdue-rental', 'Overdue Rental — Fatima Ziani', 'Kia Picanto (KPC-001-31) was due 2026-05-31 (1 day overdue). Client not yet returned vehicle.', 'high', '2h ago', 'r-2'),
('a-2', 'urgent-booking', 'New Booking Request — Sarah Johnson', 'Requested Dacia Duster for June 10–15. Arriving on flight AH-501. Needs airport pickup.', 'high', '4h ago', 'br-2'),
('a-3', 'urgent-booking', 'New Booking Request — Nadia Berkouk', 'Requested Renault Clio 5 for June 8–12. Awaiting confirmation.', 'high', '6h ago', 'br-5'),
('a-4', 'urgent-booking', 'New Booking Request — Aissa Rahmani', 'Requested Hyundai Tucson June 14–18. Needs child seat (extra charge).', 'high', '8h ago', 'br-7'),
('a-5', 'returning-today', 'Vehicle Returning Today — Kia Picanto', 'Kia Picanto (KPC-001-31) rented to Fatima Ziani was due today. Not yet returned.', 'medium', 'Today', 'r-2'),
('a-6', 'maintenance', 'Maintenance Due — Dacia Duster', 'Oil change scheduled for June 10. Book appointment with Renault Service Center.', 'medium', 'Scheduled 06-10', 'm-2'),
('a-7', 'maintenance', 'Maintenance Due — Renault Clio 5', 'Front brake pads need replacement. Scheduled June 15.', 'medium', 'Scheduled 06-15', 'm-3'),
('a-8', 'blocked-client', 'Blocked Client Attempt — Reda Chaouch', 'Blocked client Reda Chaouch (+213665111222) contacted us via phone requesting a rental.', 'medium', '1 day ago', 'bc-1'),
('a-9', 'maintenance', 'Car in Maintenance — Mercedes C-Class', 'Mercedes-Benz C-Class (MBC-300-16) in maintenance since May 29. Est. ready June 3.', 'low', '3 days ago', 'm-1'),
('a-10', 'maintenance', 'Maintenance Due — Kia Picanto', 'Tire rotation and alignment recommended for Kia Picanto. Due June 20.', 'low', 'Scheduled 06-20', 'm-5');

-- 8. SEED RECENT ACTIVITY
INSERT INTO recent_activity (id, type, title, description, time, icon) VALUES
('act-1', 'booking', 'New Booking Request', 'Aissa Rahmani requested Hyundai Tucson (Jun 14–18)', '8 min ago', '📋'),
('act-2', 'booking', 'New Booking Request', 'Nadia Berkouk requested Renault Clio 5 (Jun 8–12)', '35 min ago', '📋'),
('act-3', 'rental', 'Rental Started', 'Youcef Mebarki — Hyundai Tucson (RNT-2026-0071)', '2h ago', '🔑'),
('act-4', 'booking', 'Booking Confirmed', 'Victoria Grant — VW Golf 8 confirmed for Jun 25–30', '3h ago', '✅'),
('act-5', 'booking', 'New Booking Request', 'Sarah Johnson requested Dacia Duster (Jun 10–15)', '4h ago', '📋'),
('act-6', 'fleet', 'Car Sent to Maintenance', 'Mercedes-Benz C-Class (MBC-300-16) — AC repair', 'Yesterday', '🔧'),
('act-7', 'return', 'Rental Returned', 'Khalil Hadjadj returned Renault Clio 5 — $120 collected', 'Yesterday', '🏁'),
('act-8', 'client', 'Client Blocked', 'Sofiane Belounis blocked — false identity documents', '2 days ago', '🚫'),
('act-9', 'booking', 'Booking Cancelled', 'Emma Dupont cancelled Kia Picanto reservation', '4 days ago', '❌'),
('act-10', 'payment', 'Payment Received', 'Lamine Bouzidi — $315 for Dacia Duster rental', '5 days ago', '💰');

-- 9. SEED NOTIFICATIONS
INSERT INTO notifications (id, title, message, time, read, type) VALUES
('n-1', 'Rental Overdue', 'Fatima Ziani — Kia Picanto overdue since 31 May', '2 hours ago', FALSE, 'alert'),
('n-2', 'New Booking Request', 'Aissa Rahmani — Hyundai Tucson, 14–18 Jun', '4 hours ago', FALSE, 'booking'),
('n-3', 'New Booking Request', 'Nadia Berkouk — Renault Clio 5, 8–12 Jun', '5 hours ago', FALSE, 'booking'),
('n-4', 'Rental Confirmed', 'Karima Benali picked up Peugeot 208 — RNT-2026-0069', 'Yesterday', TRUE, 'rental'),
('n-5', 'Vehicle Needs Attention', 'Mercedes C-Class — AC compressor replacement in progress', 'Yesterday', TRUE, 'maintenance'),
('n-6', 'Client Blocked Alert', 'Reda Chaouch attempted to book — access denied', '2 days ago', TRUE, 'alert'),
('n-7', 'Rental Completed', 'Sarah Johnson returned Dacia Duster on time', '3 days ago', TRUE, 'rental');


-- ===========================================================================
-- HELPFUL QUERY VIEWS FOR DASHBOARD STATS (DYNAMIC KPIs)
-- ===========================================================================

-- View for Dashboard KPIs
CREATE OR REPLACE VIEW view_dashboard_kpis AS
SELECT
    (SELECT COUNT(*) FROM booking_requests) + (SELECT COUNT(*) FROM rentals) AS total_bookings,
    (SELECT COUNT(*) FROM booking_requests WHERE status IN ('new', 'contacted')) AS pending_requests,
    (SELECT COUNT(*) FROM booking_requests WHERE status = 'confirmed') AS confirmed_bookings,
    (SELECT COUNT(*) FROM rentals WHERE status = 'active') AS active_rentals,
    (SELECT COUNT(*) FROM fleet WHERE status = 'available') AS available_cars,
    (SELECT COUNT(*) FROM fleet WHERE status = 'rented') AS rented_cars,
    (SELECT COUNT(*) FROM fleet WHERE status = 'maintenance') AS maintenance_cars,
    (SELECT COUNT(*) FROM fleet WHERE status = 'reserved') AS reserved_cars,
    (SELECT COUNT(*) FROM clients WHERE status <> 'blocked') AS total_clients,
    (SELECT COUNT(*) FROM clients WHERE status = 'blocked') AS blocked_clients,
    (SELECT COUNT(*) FROM rentals WHERE status = 'overdue') AS overdue_rentals,
    (SELECT COALESCE(SUM(total_price), 0) FROM rentals WHERE status IN ('active', 'overdue', 'completed')) AS monthly_revenue;
