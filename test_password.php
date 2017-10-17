<?php

require "dbconn.php";
require "password.php";

$db = dbconn();
$stmt = $db->stmt_init();
$stmt->prepare("UPDATE TeachingAssistants SET hash = ? WHERE id = ?");
$stmt->bind_param("ss", $_GET["password"], $_GET["username"]);

if (!$stmt->execute()) {
    echo "ERROR: failed to execute query!";
} else {
    echo "SUCCESS!";
}

?>