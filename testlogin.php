<?php

require "helper.php";

session_start();

$status = sessionLogin();

if ($status == SUCCESS) {
    echo "You are logged in";
} else {
    echo "You are not logged in\n" . "status: " . $status;
}

?>