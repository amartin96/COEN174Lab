<?php

require "helper.php";

session_start();
session_save_path("./tmp");

if (logout()) {
    echo json_encode(array("status" => SUCCESS));
} else {
    echo json_encode(array("status" => SERVER_ERROR, "message" => "Logout error: no active session"));
}

?>
