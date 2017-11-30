-- clean the database
DROP TABLE IF EXISTS Admins;
DROP TABLE IF EXISTS AvailableTimes;
DROP TABLE IF EXISTS QualifiedCourses;
DROP TABLE IF EXISTS TeachingAssistants;

-- Admin Credentials
CREATE TABLE Admins (
    username    VARCHAR(255) UNIQUE NOT NULL,
    hash        VARCHAR(255) NOT NULL
);

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

-- Mapping of TA IDs to courses they are qualified to teach
CREATE TABLE QualifiedCourses (
    ta_id       INTEGER,
    course_name VARCHAR(8),
    FOREIGN KEY (ta_id)
        REFERENCES TeachingAssistants(id)
        ON DELETE CASCADE
);

-- Manually insert a default admin account with password "password"
INSERT INTO Admins VALUES ("admin", "$2y$10$dlDU.ecgGukEkk5MqEPJye4AcpLiu0M3LCY7L/T4K2pW5paWBbl9W");
