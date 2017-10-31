<?php

require "helper.php";

$db = connectToDatabase();
$stmt = $db->stmt_init();
$stmt->prepare("UPDATE TeachingAssistants SET hash = ? WHERE id = ?");
$stmt->bind_param("ss", password_hash($_GET["password"], PASSWORD_DEFAULT), $_GET["username"]);

if (!$stmt->execute()) {
    echo "ERROR: failed to execute query!";
} else {
    echo "SUCCESS!";
}

?>