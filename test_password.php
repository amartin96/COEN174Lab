<?php

require "dbconn.php";
require "password.php";

$db = dbconn();
$stmt = $db->stmt_init();
$stmt->prepare("UPDATE TeachingAssistants SET hash = ? WHERE id = ?");
$stmt->bind_param("ss", $_GET["username"], $_GET["password"]);

if (!$stmt->execute()) {
    echo "ERROR: failed to execute query!";
} else {
    echo "SUCCESS!"
}

?>