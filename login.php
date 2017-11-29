<?php

require "helper.php";

session_save_path("./tmp");
session_start();

# check for an existing session and log out if necessary
if (isset($_SESSION["username"]) && isset($_SESSION["password"]) && isset($_SESSION["type"])) {
    logout();
    session_start();
}

# attempt to log in with the given credentials
$status = login($_POST["username"], $_POST["password"], $_POST["type"]);
if ($status == SUCCESS) {
    $_SESSION["username"] = $_POST["username"];
    $_SESSION["password"] = $_POST["password"];
}
echo json_encode(array("status" => $status));

?>
