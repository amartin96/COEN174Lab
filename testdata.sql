INSERT INTO Admins VALUES ('admin', 0);

INSERT INTO TeachingAssistants VALUES (0, '0', 'Bob', 'Jones', 'bjones@scu.edu', '111-111-1111');
INSERT INTO TeachingAssistants VALUES (1, '0', 'Bill', 'Ding', 'bding@scu.edu', '222-222-2222');

INSERT INTO AvailableTimes VALUES (0, 'M', '9:15', '12:00');
INSERT INTO AvailableTimes VALUES (0, 'T', '17:00', '20:30');
INSERT INTO AvailableTimes VALUES (1, 'W', '14:15', '17:00');
INSERT INTO AvailableTimes VALUES (1, 'T', '17:15', '20:00');

INSERT INTO Courses VALUES ('COEN 100');
INSERT INTO Courses VALUES ('COEN 200');

INSERT INTO QualifiedCourses VALUES (0, 'COEN 100');
INSERT INTO QualifiedCourses VALUES (1, 'COEN 100');
INSERT INTO QualifiedCourses VALUES (1, 'COEN 200');
