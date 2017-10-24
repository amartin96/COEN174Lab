// bind the event handler for the login button
$("#login-submit").click(login);

// login button event handler
function login() {
    var uname = $("#login-username").val();
    var pword = $("#login-password").val();
    $.post("login.php", { username: uname, password: pword }, function(data) {
        if (data.status == 0) {
            // yay we logged in
        } else {
            // stay on the login page and say "invalid credentials" or something
        }
    });
}