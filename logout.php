<?php

require "helper.php";

if (logout()) {
    echo json_encode(array("status" => SERVER_ERROR, "message" => "Logout error: no active session"));
} else {
    echo json_encode(array("status" => SUCCESS));
}

?>