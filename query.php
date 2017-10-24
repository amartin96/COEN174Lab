<?php

require("dbconn.php");

# connect to the database
$db_conn = dbconn();

# create the SQL prepared statement
$stmt = $db_conn->stmt_init();
$stmt->prepare(file_get_contents("query.sql"));

# bind the parameters of the prepared statement to the user input
$t_start = $_POST["t_start"];
$t_end = $_POST["t_end"];
$course = $_POST["course"];
$stmt->bind_param("sss", $t_start, $t_end, $course);

# execute the statement and retrieve results
if (!$stmt->execute()) {
    echo "prepared statement error";
    exit(1);
}
$stmt->bind_result($fname, $lname, $email, $phone);

# format results as associative array and convert to JSON
$data = array();
while ($stmt->fetch()) {
    $data[] = array("fname" => $fname, "lname" => $lname, "email" => $email, "phone" => $phone);
}
echo json_encode($data, JSON_PRETTY_PRINT);

?>
