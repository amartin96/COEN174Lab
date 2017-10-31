<?php

# response codes
define("SUCCESS", 0);
define("SERVER_ERROR", 1);
define("INVALID_LOGIN", 2);
define("INVALID_ARGS", 3);

# database credentials
define("DBHOST", "dbserver.engr.scu.edu");
#define("DBHOST", "127.0.0.1");
define("DBUSER", "amartin");
define("DBPASS", "password");
define("DBNAME", "sdb_amartin");

/**
 * Connect to the MySQL database using the credentials defined
 * in the constants in this file.  If the connection fails, prints
 * an error message and exits.
 *
 * @return mysqli
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
 * Attempt to log in using the given credentials.
 *
 * @param string $username
 * @param string $password
 * @param string $type      One of: "user", "admin"
 * @return int              Status code
 */
function login($username, $password, $type = "user")
{
    if ($type === "admin") {
        $query = "SELECT hash FROM Admins WHERE username = ?";
    } else {
        $query = "SELECT hash FROM TeachingAssistants WHERE id = ?";
    }

    # connect to the database and prepare the query
    $db = connectToDatabase();
    $stmt = $db->stmt_init();
//    $stmt->prepare("SELECT hash FROM TeachingAssistants WHERE id = ?");
//    $stmt->bind_param("s", $username);
    $stmt->prepare($query);
    $stmt->bind_param("s", $username);

    # attempt to authenticate login credentials
    if ($stmt->execute()) {
        $stmt->bind_result($result);
        if ($stmt->fetch() && password_verify($password, $result)) {
            # valid credentials
            return SUCCESS;
        }
        # invalid credentials
        return INVALID_LOGIN;
    }
    # query failed to execute
    return SERVER_ERROR;
}

/**
 * @param string $type
 * @return int
 */
function sessionLogin($type = "user")
{
    # check for the existence of a valid session
    if (session_status() != PHP_SESSION_ACTIVE || !isset($_SESSION["username"]) || !isset($_SESSION["password"])) {
        return INVALID_LOGIN;
    }
    return login($_SESSION["username"], $_SESSION["password"], $type);
}

/**
 * Completely terminates a session by removing all session variables,
 * unsetting the session ID cookie, and destroying the session.
 *
 * @return bool
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
