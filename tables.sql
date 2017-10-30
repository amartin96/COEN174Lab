-- clean the database
DROP TABLE IF EXISTS AvailableTimes;
DROP TABLE IF EXISTS QualifiedCourses;
DROP TABLE IF EXISTS TeachingAssistants;
DROP TABLE IF EXISTS Sections;
DROP TABLE IF EXISTS Courses;

-- TA info
CREATE TABLE TeachingAssistants (
    id      INTEGER PRIMARY KEY,
    hash    VARCHAR(255) NOT NULL,
    fname   VARCHAR(255),
    lname   VARCHAR(255),
    email   VARCHAR(255),
    phone   VARCHAR(12)
);

-- Mapping of TA IDs to times they are available as a sub
CREATE TABLE AvailableTimes (
    ta_id   INTEGER NOT NULL,
    day     ENUM('M', 'T', 'W', 'R', 'F'),
    t_start TIME NOT NULL,
    t_end   TIME NOT NULL,
    FOREIGN KEY (ta_id)
        REFERENCES TeachingAssistants(id)
        ON DELETE CASCADE
);

-- Used to check for valid course names
CREATE TABLE Courses (
    name    VARCHAR(8) UNIQUE NOT NULL
);

-- Mapping of TA IDs to courses they are qualified to teach
CREATE TABLE QualifiedCourses (
    ta_id       INTEGER,
    course_name VARCHAR(8),
    FOREIGN KEY (ta_id)
        REFERENCES TeachingAssistants(id)
        ON DELETE CASCADE,
    FOREIGN KEY (course_name)
        REFERENCES Courses(name)
        ON DELETE CASCADE
);

-- Course info
CREATE TABLE Sections (
    id      INTEGER PRIMARY KEY,
    name    VARCHAR(8),
    day     ENUM('M', 'T', 'W', 'R', 'F'),
    t_start TIME,
    t_end   TIME,
    FOREIGN KEY (name)
        REFERENCES Courses(name)
        ON DELETE CASCADE
);
