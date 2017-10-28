<?php

# response codes
define("SUCCESS", 0);
define("SERVER_ERROR", 1);
define("INVALID_LOGIN", 2);
define("INVALID_ARGS", 3);

# database credentials
define("DBHOST", "dbserver.engr.scu.edu");
define("DBUSER", "amartin");
define("DBPASS", "password");
define("DBNAME", "sdb_amartin");

/**
 *  Connect to the MySQL database using the credentials defined
 *  in the constants in this file.  If the connection fails, prints
 *  an error message and exits.
 *
 *  @return mysqli
 */
function connectToDatabase()
{
    $result = mysqli_connect(DBHOST, DBUSER, DBPASS, DBNAME);
    if ($result->connect_errno) {
        echo json_encode(array("status" => SERVER_ERROR, "message" => $result->connect_error));
        exit;
    }
    return $result;
}

/**
 *  Completely terminates a session by removing all session variables,
 *  unsetting the session ID cookie, and destroying the session.
 *
 *  @return bool
 */
function logout()
{
    if (session_status() != PHP_SESSION_ACTIVE) {
        return false;
    }
    $_SESSION = array();                        # clear server session variables
    if (ini_get("session.use_cookies")) {       # clear client session cookie
        $params = session_get_cookie_params();
        setcookie( session_name(),
                   "",
                   time() - 42000,
                   $params["path"],
                   $params["domain"],
                   $params["secure"],
                   $params["httponly"] );
    }
    session_destroy();                          # destroy the session
    return true;
}

?>
