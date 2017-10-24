<?php

require "helper.php";

session_start();

# check for an existing session and log out if necessary
if (isset($_SESSION["username"]) && isset($_SESSION["password"])) {
    logout();
    session_start();
}

# connect to the database and prepare the query
$db = connectToDatabase();
$stmt = $db->stmt_init();
$stmt->prepare("SELECT hash FROM TeachingAssistants WHERE id = ?");
$stmt->bind_param("s", $_POST["username"]);

# attempt to authenticate login credentials
if ($stmt->execute()) {
    $stmt->bind_result($result);
    if ($stmt->fetch() && password_verify($_POST["password"], $result)) {
        # valid credentials
        echo json_encode(array("status" => SUCCESS));
    } else {
        # invalid credentials
        echo json_encode(array("status" => INVALID_LOGIN));
    }
} else {
    # query failed to execute
    echo json_encode(array("status" => SERVER_ERROR));
}

?>
