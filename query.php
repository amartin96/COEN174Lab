<?php

# ini_set('display_errors', 'on');
# error_reporting(E_ALL);

define("DBHOST", "dbserver.engr.scu.edu");
define("DBUSER", "amartin");
define("DBPASS", "password");
define("DBNAME", "sdb_amartin");

# connect to the database
$db_conn = mysqli_connect(DBHOST, DBUSER, DBPASS, DBNAME);

# check for connection errors
if (mysqli_connect_errno()) {
    error_log(__FILE__ . " - Error connecting to database: " . mysqli_connect_error());
    exit(1);
}

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

while ($stmt->fetch()) {
    printf("%s\t%s\t%s\t%s</br>", $fname, $lname, $email, $phone);
}

#$result = $db_conn->query("SHOW DATABASES");
#var_dump(mysqli_fetch_assoc($result));

?>
