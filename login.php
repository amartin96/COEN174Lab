<?php

require("password.php");
require("dbconn.php");

function printLoginWithMessage($message)
{
    # load the login page
    $html = new DOMDocument();
    $html->loadHTMLFile("login.html");

    # add an invalid credentials message
    $node = $html->createTextNode($message);
    $html->getElementsByTagName("body")->item(0)->appendChild($node);

    # print the HTML
    echo $html->saveHTML();
}

# connect to the database
$db = dbconn();

# fetch hashed password from database
$stmt = $db->stmt_init();
$stmt->prepare("SELECT hash FROM TeachingAssistants WHERE username = ?");
$stmt->bind_param("s", $_POST["username"]);

if ($stmt->execute()) {
    $stmt->bind_result($result);

    # determine whether credentials authenticate
    if ($stmt->fetch() && password_verify($_POST["password"], $result)) {
        echo file_get_contents("client.html");
    } else {
        printLoginWithMessage("Invalid login");
    }
} else {
    // ERROR
    printLoginWithMessage("Server error");
}

?>