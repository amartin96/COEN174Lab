SELECT fname, lname, email, phone
FROM TeachingAssistants
WHERE id IN (
    SELECT ta_id
    FROM AvailableTimes
    WHERE day = ? AND t_start <= ? AND t_end >= ?
) AND id IN (
    SELECT ta_id
    FROM QualifiedCourses
    WHERE course_name = ?
) AND id != ?;
