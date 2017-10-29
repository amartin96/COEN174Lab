const SUCCESS = 0;
const SERVER_ERROR = 1;
const INVALID_LOGIN = 2;
const INVALID_ARGS = 3;

// bind event handlers
$("#login-submit").click(login);
$("#test-checkstatus").click(checkstatus);
$("#test-logout").click(logout);

// login button event handler
function login()
{
    var uname = $("#login-username").val();
    var pword = $("#login-password").val();
    $.post("login.php", { username: uname, password: pword }, function(data) {
        data = JSON.parse(data);
        if (data.status === SUCCESS) {
            //alert("login successful");
            $("#login").hide();
            $("#test").show();
        } else {
            alert("login failed");
        }
    });
}

function checkstatus()
{
    $.post("testlogin.php", function(data) {
        alert(data);
    });
}

// logout button event handler
function logout()
{
    $.post("logout.php", function(data) {
        data = JSON.parse(data);
        if (data.status === SERVER_ERROR) {
            alert(data.message);
        }
    });
    $("#test").hide();
    $("#login").show();
}

// this runs when the webpage is finished loading
$(function() {
    // hide all divs other than login
    $("#test").hide();
});