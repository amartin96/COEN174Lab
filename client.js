const SUCCESS = 0;
const SERVER_ERROR = 1;
const INVALID_LOGIN = 2;
const INVALID_ARGS = 3;

// bind event handlers
$("#login-submit").click(login);
$("#login-admin-submit").click(loginAdmin);
$("#test-checkstatus").click(checkstatus);
$("#test-submit").click(querySearch);
$("#test-modify-submit").click(queryModifyInfo);
$("#test-add-course-submit").click(queryAddCourse);
$("#test-add-time-submit").click(queryAddTime);
$("#test-clear-data").click(queryClearData);
$("#test-password-submit").click(queryChangePassword);
$("#test-admin-list").click(queryListUsers);
$("#test-admin-add").click(queryAddUser);
$("#test-admin-remove").click(queryRemoveUser);
$("#test-admin-logout").click(logout);
$("#test-logout").click(logout);

// login button event handler
function login()
{
    var uname = $("#login-username").val();
    var pword = $("#login-password").val();
    $.post("login.php", { username: uname, password: pword, type: "user" }, function(data) {
        data = JSON.parse(data);
        if (data.status === SUCCESS) {
            //alert("login successful");
            $("#login").hide();
            $("#test").show();
            $.post("server.php", { query: "get-info" }, function(data) {
                //alert(data);
                data = JSON.parse(data);
                if (data.status === SUCCESS) {
                    $("#test-modify-fname").val(data.result.fname);
                    $("#test-modify-lname").val(data.result.lname);
                    $("#test-modify-email").val(data.result.email);
                    $("#test-modify-phone").val(data.result.phone);
                } else {
                    alert("get-info failed, status " + data.status);
                }
            });
        } else {
            alert("login failed, status: " + data.status);
        }
    });
}

function loginAdmin()
{
    var uname = $("#login-admin-username").val();
    var pword = $("#login-admin-password").val();
    $.post("login.php", { username: uname, password: pword, type: "admin" }, function(data) {
        data = JSON.parse(data);
        if (data.status === SUCCESS) {
            //alert("login successful");
            $("#login").hide();
            $("#test-admin").show();
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

function querySearch()
{
    var course = $("#test-course").val();
    var day = $("#test-day").val();
    var t_start = $("#test-t_start").val();
    var t_end = $("#test-t_end").val();
    $.post("server.php", { query: "search", course: course, day: day, t_start: t_start, t_end: t_end }, function(data) {
        alert(data);
    });
}

function queryModifyInfo()
{
    var fname = $("#test-modify-fname").val();
    var lname = $("#test-modify-lname").val();
    var email = $("#test-modify-email").val();
    var phone = $("#test-modify-phone").val();
    $.post("server.php", { query: "modify-info", fname: fname, lname: lname, email: email, phone: phone }, function(data) {
        alert(data);
    });
}

function queryAddCourse()
{
    var course = $("#test-add-course").val();
    $.post("server.php", { query: "add-course", course: course }, function(data) {
        alert(data);
    });
}

function queryAddTime()
{
    var day = $("#test-add-day").val();
    var t_start = $("#test-add-t_start").val();
    var t_end = $("#test-add-t_end").val();
    $.post("server.php", { query: "add-time", day: day, t_start: t_start, t_end: t_end }, function(data) {
        alert(data);
    });
}

function queryClearData()
{
    $.post("server.php", { query: "clear-data" }, function(data) {
        alert(data);
    });
}

function queryChangePassword()
{
    var password = $("#test-password").val();
    $.post("server.php", { query: "change-password", password: password }, function(data) {
        alert(data);
    });
}

function queryListUsers()
{
    $.post("server_admin.php", { query: "list-users" }, function(data) {
        alert(data);
    });
}

function queryAddUser()
{
    var id = $("#test-admin-id").val();
    $.post("server_admin.php", { query: "add-user", id: id }, function(data) {
        alert(data);
    });
}

function queryRemoveUser()
{
    var id = $("#test-admin-id").val();
    $.post("server_admin.php", { query: "remove-user", id: id }, function(data) {
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
    $("#test-admin").hide();
    $("#login").show();
}

// this runs when the webpage is finished loading
$(function() {
    // hide all divs other than login
    $("#test").hide();
    $("#test-admin").hide();
    $("#query").hide();
    $("#availableTA").hide();
    $("#TAinfo").hide();
    $("#ClassCheckboxList").hide();
    $("#Admin").hide();
});