<?php

require "helper.php";

function queryListUsers()
{
    $data = array();
    $db = connectToDatabase();
    $stmt = $db->stmt_init();
    $stmt->prepare("SELECT fname, lname, email, phone FROM TeachingAssistants");

    if (!$stmt->execute()) {
        echo json_encode(array("status" => SERVER_ERROR, "message" => "failed to execute query in queryListUsers"));
        return;
    }

    $data = array("status" => SUCCESS, "result" => array());
    $stmt->bind_result($fname, $lname, $email, $phone);
    while ($stmt->fetch()) {
        $data["result"][] = array("fname" => $fname, "lname" => $lname, "email" => $email, "phone" => $phone);
    }
    echo json_encode($data, JSON_PRETTY_PRINT);
}

function queryAddUser()
{
    if (!isset($_POST["id"])) {
        echo json_encode(array("status" => INVALID_ARGS, "message" => "unset id"));
        return;
    }

    $db = connectToDatabase();
    $stmt = $db->stmt_init();
    $stmt->prepare("INSERT INTO TeachingAssistants VALUES (?, ?, ?, ?, ?, ?)");
    $hash = password_hash("password", PASSWORD_DEFAULT);
    $null = null;
    $stmt->bind_param("ssssss", $_POST["id"], $hash, $null, $null, $null, $null);

    if (!$stmt->execute()) {
        echo json_encode(array("status" => SERVER_ERROR, "message" => "failed to execute query in queryAddUser"));
        return;
    }

    echo json_encode(array("status" => SUCCESS));
}

function queryRemoveUser()
{
    if (!isset($_POST["id"])) {
        echo json_encode(array("status" => INVALID_ARGS, "message" => "unset id"));
        return;
    }

    $db = connectToDatabase();
    $stmt = $db->stmt_init();
    $stmt->prepare("DELETE FROM TeachingAssistants WHERE id = ?");
    $stmt->bind_param("s", $_POST["id"]);

    if (!$stmt->execute()) {
        echo json_encode(array("status" => SERVER_ERROR, "message" => "failed to execute query in queryRemoveUser"));
        return;
    }

    echo json_encode(array("status" => SUCCESS));
}

session_start();

sessionLogin("admin");

# take action depending on the query type
switch ($_POST["query"]) {
    case "list-users":
        queryListUsers();
        break;
    case "add-user":
        queryAddUser();
        break;
    case "remove-user":
        queryRemoveUser();
        break;
    default:
        echo json_encode(array("status" => INVALID_ARGS, "message" => "invalid/unset query type"));
}

?>
