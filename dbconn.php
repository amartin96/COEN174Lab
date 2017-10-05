<?php

define("DBHOST", "dbserver.engr.scu.edu");
define("DBUSER", "amartin");
define("DBPASS", "password");
define("DBNAME", "sdb_amartin");

function dbconn()
{
    $result = new mysqli(DBHOST, DBUSER, DBPASS, DBNAME);
    if ($result->connect_errno) {
        $error = array("error" => "Error connecting to database: " . $result->connect_error);
        echo json_encode($error);
        exit(1);
    }
    return $result;
}

?>