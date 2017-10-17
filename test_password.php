<?php

require "dbconn.php";
require "password.php";

if ($argc != 2) {
    echo "Usage: php test_password.php USERNAME PASSWORD";
    exit(1);
}

$db = dbconn();
$stmt = $db->stmt_init();
$stmt->prepare("UPDATE TeachingAssistants SET hash = ? WHERE id = ?");
$stmt->bind_param("ss", $argv[1], $argv[2]);

if (!$stmt->execute()) {
    echo "ERROR: failed to execute query!";
}

?>