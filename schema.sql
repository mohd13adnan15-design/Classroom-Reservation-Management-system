-- =========================================================================
-- 1. CUSTOM TYPES (ENUMS)
-- =========================================================================

CREATE TYPE course_type_enum AS ENUM ('UG', 'PG');
CREATE TYPE timetable_status_enum AS ENUM ('active', 'cancelled', 'completed');
CREATE TYPE booking_status_enum AS ENUM ('pending', 'confirmed', 'cancelled');
CREATE TYPE attendance_status_enum AS ENUM ('present', 'absent');
CREATE TYPE leave_status_enum AS ENUM ('pending', 'approved', 'rejected');

-- =========================================================================
-- 2. TABLES
-- =========================================================================

-- 1. ROLES
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_name VARCHAR(50) NOT NULL UNIQUE
);

-- 2. DEPARTMENTS
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dept_name VARCHAR(100) NOT NULL,
    dept_code VARCHAR(20) NOT NULL UNIQUE,
    course_type course_type_enum NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SEMESTERS
CREATE TABLE semesters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    semester_name VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. USERS
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role_id UUID REFERENCES roles(id) ON DELETE RESTRICT,
    department_id UUID REFERENCES departments(id) ON DELETE RESTRICT,
    semester_id UUID REFERENCES semesters(id) ON DELETE RESTRICT,
    reg_no VARCHAR(50) UNIQUE,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. COURSES
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_code VARCHAR(20) UNIQUE NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    department_id UUID REFERENCES departments(id) ON DELETE RESTRICT,
    semester_id UUID REFERENCES semesters(id) ON DELETE RESTRICT,
    faculty_id UUID REFERENCES users(id) ON DELETE RESTRICT,
    credits INT NOT NULL CHECK (credits > 0),
    capacity INT NOT NULL CHECK (capacity > 0),
    created_by_hod UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SYLLABUS
CREATE TABLE syllabus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CLASSROOMS
CREATE TABLE classrooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_name VARCHAR(50) UNIQUE NOT NULL,
    building VARCHAR(100) NOT NULL,
    capacity INT NOT NULL CHECK (capacity > 0),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TIMETABLE
CREATE TABLE timetable (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    faculty_id UUID REFERENCES users(id) ON DELETE RESTRICT,
    classroom_id UUID REFERENCES classrooms(id) ON DELETE RESTRICT,
    department_id UUID REFERENCES departments(id) ON DELETE RESTRICT,
    day VARCHAR(20) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status timetable_status_enum DEFAULT 'active',
    updated_by_hod UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(classroom_id, day, start_time, end_time),
    CHECK (start_time < end_time)
);

-- 9. FACULTY_LEAVES
CREATE TABLE faculty_leaves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id UUID REFERENCES users(id) ON DELETE CASCADE,
    leave_date DATE NOT NULL,
    reason TEXT,
    status leave_status_enum DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. FACULTY_REALLOCATION
CREATE TABLE faculty_reallocation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timetable_id UUID REFERENCES timetable(id) ON DELETE CASCADE,
    old_faculty_id UUID REFERENCES users(id) ON DELETE CASCADE,
    new_faculty_id UUID REFERENCES users(id) ON DELETE CASCADE,
    changed_by_hod UUID REFERENCES users(id) ON DELETE SET NULL,
    changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. SEAT_BOOKING
CREATE TABLE seat_booking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    timetable_id UUID REFERENCES timetable(id) ON DELETE CASCADE,
    classroom_id UUID REFERENCES classrooms(id) ON DELETE RESTRICT,
    seat_number VARCHAR(20),
    booking_status booking_status_enum DEFAULT 'pending',
    booking_time TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, timetable_id)
);

-- 12. ATTENDANCE
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    faculty_id UUID REFERENCES users(id) ON DELETE RESTRICT,
    attendance_date DATE NOT NULL,
    status attendance_status_enum NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. NOTIFICATIONS
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. COURSE_ANALYTICS
CREATE TABLE course_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    own_department_students INT DEFAULT 0,
    other_department_students INT DEFAULT 0,
    attendance_percentage NUMERIC(5,2) DEFAULT 0.00,
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. STUDENT_ACTIVITY
CREATE TABLE student_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    home_department UUID REFERENCES departments(id) ON DELETE CASCADE,
    visited_department UUID REFERENCES departments(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES seat_booking(id) ON DELETE CASCADE,
    activity_time TIMESTAMPTZ DEFAULT NOW()
);


-- =========================================================================
-- 3. INDEXES FOR PERFORMANCE
-- =========================================================================
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_users_dept_id ON users(department_id);
CREATE INDEX idx_users_auth_id ON users(auth_user_id);
CREATE INDEX idx_courses_dept_id ON courses(department_id);
CREATE INDEX idx_courses_faculty_id ON courses(faculty_id);
CREATE INDEX idx_timetable_course_id ON timetable(course_id);
CREATE INDEX idx_timetable_classroom_id ON timetable(classroom_id);
CREATE INDEX idx_timetable_faculty_id ON timetable(faculty_id);
CREATE INDEX idx_seat_booking_student_id ON seat_booking(student_id);
CREATE INDEX idx_seat_booking_timetable_id ON seat_booking(timetable_id);


-- =========================================================================
-- 4. TRIGGERS & FUNCTIONS
-- =========================================================================

-- Trigger to auto-update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at 
BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_timetable_updated_at 
BEFORE UPDATE ON timetable FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- Trigger: Check Classroom Capacity before Seat Booking
CREATE OR REPLACE FUNCTION check_classroom_capacity()
RETURNS TRIGGER AS $$
DECLARE
    room_cap INT;
    booked_count INT;
BEGIN
    -- Fetch capacity
    SELECT capacity INTO room_cap FROM classrooms WHERE id = NEW.classroom_id;
    
    -- Count current bookings for this timetable
    SELECT COUNT(*) INTO booked_count FROM seat_booking 
    WHERE timetable_id = NEW.timetable_id AND booking_status IN ('pending', 'confirmed');
    
    IF booked_count >= room_cap THEN
        RAISE EXCEPTION 'Classroom capacity exceeded. Cannot book seat.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_classroom_capacity
BEFORE INSERT ON seat_booking
FOR EACH ROW EXECUTE FUNCTION check_classroom_capacity();


-- Trigger: UG/PG Course Validation
CREATE OR REPLACE FUNCTION check_ug_pg_validation()
RETURNS TRIGGER AS $$
DECLARE
    student_course_type course_type_enum;
    target_course_type course_type_enum;
BEGIN
    SELECT d.course_type INTO student_course_type 
    FROM users u JOIN departments d ON u.department_id = d.id 
    WHERE u.id = NEW.student_id;
    
    SELECT d.course_type INTO target_course_type 
    FROM courses c JOIN departments d ON c.department_id = d.id 
    WHERE c.id = NEW.course_id;
    
    IF student_course_type != target_course_type THEN
        RAISE EXCEPTION 'Student cannot book a course outside their respective course type (UG/PG mismatch).';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_ug_pg_validation
BEFORE INSERT ON seat_booking
FOR EACH ROW EXECUTE FUNCTION check_ug_pg_validation();


-- Trigger: Release old seat when a new booking creates a time conflict
CREATE OR REPLACE FUNCTION release_old_seat()
RETURNS TRIGGER AS $$
DECLARE
    new_day VARCHAR(20);
    new_start TIME;
    new_end TIME;
BEGIN
    -- Fetch details of the newly booked timetable slot
    SELECT day, start_time, end_time INTO new_day, new_start, new_end
    FROM timetable WHERE id = NEW.timetable_id;
    
    -- Cancel previous bookings by the same student that overlap in time
    UPDATE seat_booking sb
    SET booking_status = 'cancelled'
    FROM timetable t
    WHERE sb.timetable_id = t.id 
      AND sb.student_id = NEW.student_id 
      AND sb.id != NEW.id
      AND t.day = new_day
      AND (
          (t.start_time < new_end AND t.end_time > new_start)
      )
      AND sb.booking_status IN ('pending', 'confirmed');
      
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_single_booking_per_slot
AFTER INSERT ON seat_booking
FOR EACH ROW EXECUTE FUNCTION release_old_seat();


-- =========================================================================
-- 5. REALTIME EXPOSURE & SEED DATA
-- =========================================================================

-- Seed Data: Core Roles
INSERT INTO roles (role_name) VALUES 
('student'), ('faculty'), ('hod'), ('super_admin') 
ON CONFLICT (role_name) DO NOTHING;

-- Supabase Realtime Table Setup
ALTER PUBLICATION supabase_realtime ADD TABLE timetable;


-- =========================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE seat_booking ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable ENABLE ROW LEVEL SECURITY;

-- Examples for Users
CREATE POLICY "Users can view their own profile" 
ON users FOR SELECT USING (auth.uid() = auth_user_id);

CREATE POLICY "Super Admins can manage all users" 
ON users FOR ALL USING (
    (SELECT role_name FROM roles WHERE id = role_id) = 'super_admin'
);

-- Examples for Seat Booking
CREATE POLICY "Students can view their own bookings" 
ON seat_booking FOR SELECT USING (
    student_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid())
);

CREATE POLICY "Students can create bookings" 
ON seat_booking FOR INSERT WITH CHECK (
    student_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid())
);
