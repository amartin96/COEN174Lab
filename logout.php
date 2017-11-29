<?php

require "helper.php";

session_save_path("./tmp");
session_start();

if (logout()) {
    echo json_encode(array("status" => SUCCESS));
} else {
    echo json_encode(array("status" => SERVER_ERROR, "message" => "Logout error: no active session"));
}

?>
