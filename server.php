<?php

require "helper.php";

function querySearch()
{
    if (!isset($_POST["day"]) || !isset($_POST["t_start"]) || !isset($_POST["t_end"]) || !isset($_POST["course"])) {
        echo json_encode(array("status" => INVALID_ARGS, "message" => "unset t_start/t_end/course"));
        return;
    }
    
    $db = connectToDatabase();
    $stmt = $db->stmt_init();
    $stmt->prepare(file_get_contents("query.sql"));
    $stmt->bind_param("ssss", $_POST["day"], $_POST["t_start"], $_POST["t_end"], $_POST["course"]);
    
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

function queryGetInfo()
{
    $db = connectToDatabase();
    $stmt = $db->stmt_init();
    $stmt->prepare("SELECT fname, lname, email, phone FROM TeachingAssistants WHERE id = ?");
    $stmt->bind_param("s", $_SESSION["username"]);

    if (!$stmt->execute()) {
        echo json_encode(array("status" => SERVER_ERROR, "message" => "failed to execute query in queryGetInfo"));
        return;
    }

    $stmt->bind_result($fname, $lname, $email, $phone);
    $stmt->fetch();
    $data = array("fname" => $fname, "lname" => $lname, "email" => $email, "phone" => $phone, "id" => $_SESSION["username"]);
    echo json_encode(array("status" => SUCCESS, "result" => $data), JSON_PRETTY_PRINT);
}

function queryModifyInfo()
{
    if (!isset($_POST["fname"]) || !isset($_POST["lname"]) || !isset($_POST["email"]) || !isset($_POST["phone"])) {
        echo json_encode(array("status" => INVALID_ARGS, "message" => "unset fname/lname/email/phone"));
        return;
    }

    $db = connectToDatabase();
    $stmt = $db->stmt_init();
    $stmt->prepare("UPDATE TeachingAssistants SET fname = ?, lname = ?, email = ?, phone = ? WHERE id = ?");
    $stmt->bind_param("sssss", $_POST["fname"], $_POST["lname"], $_POST["email"], $_POST["phone"], $_SESSION["username"]);

    if (!$stmt->execute()) {
        echo json_encode(array("status" => SERVER_ERROR, "message" => "failed to execute query in queryModifyInfo"));
        return;
    }

    echo json_encode(array("status" => SUCCESS));
}

function queryAddCourse()
{
    if (!isset($_POST["course"])) {
        echo json_encode(array("status" => INVALID_ARGS, "message" => "unset course"));
        return;
    }

    $db = connectToDatabase();
    $stmt = $db->stmt_init();
    $stmt->prepare("INSERT INTO QualifiedCourses VALUES (?, ?)");
    $stmt->bind_param("ss", $_SESSION["username"], $_POST["course"]);

    if (!$stmt->execute()) {
        echo json_encode(array("status" => SERVER_ERROR, "message" => "failed to execute query in queryAddCourse"));
        return;
    }

    echo json_encode(array("status" => SUCCESS));
}

function queryAddTime()
{
    if (!isset($_POST["day"]) || !isset($_POST["t_start"]) || !isset($_POST["t_end"])) {
        echo json_encode(array("status" => INVALID_ARGS, "message" => "unset day/t_start/t_end"));
        return;
    }

    $db = connectToDatabase();
    $stmt = $db->stmt_init();
    $stmt->prepare("INSERT INTO AvailableTimes VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $_SESSION["username"], $_POST["day"], $_POST["t_start"], $_POST["t_end"]);

    if (!$stmt->execute()) {
        echo json_encode(array("status" => SERVER_ERROR, "message" => "failed to execute query in queryAddTime"));
        return;
    }

    echo json_encode(array("status" => SUCCESS));
}

function queryClearData()
{
    $db = connectToDatabase();
    $stmt = $db->stmt_init();
    $stmt->prepare("DELETE FROM AvailableTimes WHERE ta_id = ?");
    $stmt->bind_param("s", $_SESSION["username"]);

    if (!$stmt->execute()) {
        echo json_encode(array("status" => SERVER_ERROR, "message" => "failed to execute query 1 in queryClearData"));
        return;
    }

    $stmt = $db->stmt_init();
    $stmt->prepare("DELETE FROM QualifiedCourses WHERE ta_id = ?");
    $stmt->bind_param("s", $_SESSION["username"]);

    if (!$stmt->execute()) {
        echo json_encode(array("status" => SERVER_ERROR, "message" => "failed to execute query 2 in queryClearData"));
        return;
    }

    echo json_encode(array("status" => SUCCESS));
}

function queryChangePassword()
{
    if (!isset($_POST["password"])) {
        echo json_encode(array("status" => INVALID_ARGS, "message" => "unset password"));
        return;
    }

    $db = connectToDatabase();
    $stmt = $db->stmt_init();
    $stmt->prepare("UPDATE TeachingAssistants SET hash = ? WHERE id = ?");
    $hash = password_hash($_POST["password"], PASSWORD_DEFAULT);
    $stmt->bind_param("ss", $hash, $_SESSION["username"]);

    if (!$stmt->execute()) {
        echo json_encode(array("status" => SERVER_ERROR, "message" => "failed to execute query in queryChangePassword"));
        return;
    }

    echo json_encode(array("status" => SUCCESS));
}

session_start();

sessionLogin();

# take action depending on the query type
switch ($_POST["query"]) {
    case "search":
        querySearch();
        break;
    case "get-info":
        queryGetInfo();
        break;
    case "modify-info":
        queryModifyInfo();
        break;
    case "add-course":
        queryAddCourse();
        break;
    case "add-time":
        queryAddTime();
        break;
    case "clear-data":
        queryClearData();
        break;
    case "change-password":
        queryChangePassword();
        break;
    default:
        echo json_encode(array("status" => INVALID_ARGS, "message" => "invalid/unset query type"));
}

?>
