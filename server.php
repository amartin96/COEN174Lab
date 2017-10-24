<?php

require "helper.php";

function querySearch()
{
    if (!isset($_POST["t_start"]) || !isset($_POST["t_end"]) || !isset($_POST["course"]) {
        echo json_encode(array("status" => INVALID_ARGS, "message" => "unset t_start/t_end/course"));
        return;
    }
    
    $db = connectToDatabase();
    $stmt = $db->stmt_init();
    $stmt->prepare(file_get_contents("query.sql"));
    $stmt->bind_param("sss", $_POST["t_start"], $_POST["t_end"], $_POST["course"]);
    
    if (!$stmt->execute()) {
        echo json_encode(array("status" => SERVER_ERROR, "message" => "failed to execute query in querySearch"));
        return;
    }
    
    $data = array();
    $stmt->bind_result($fname, $lname, $email, $phone);
    while ($stmt->fetch()) {
        $data[] = array("fname" => $fname, "lname" => $lname, "email" => $email, "phone" => $phone);
    }
    echo json_encode($data, JSON_PRETTY_PRINT);
}

function queryModify()
{
    
}

session_start();

# if an existing session was not found, return INVALID_LOGIN
if (!isset($_SESSION["username"]) || !isset($_SESSION["password"]) {
    echo json_encode(array("status" => INVALID_LOGIN));
    exit;
}

# take action depending on the query type
switch ($_POST["query"]) {
    case "search":
        querySearch();
        break;
    case "modify":
        queryModify();
        break;
    case 
    default:
        echo json_encode(array("status" => INVALID_ARGS, "message" => "invalid/unset query type"));
}

?>
