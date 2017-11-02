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
$("#add-course-submit").click(queryAddCourse);
$("#test-save-time").click(queryAddTime);
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

//$("#add-row-m").click(function(){
//
//    var counter = $('#m-table tr').length;
//
//    var markup = '<tr><td><input type="text" size = "8" id="M' + counter + '-start-time"></td><td> to </td><td><input type="text" size = "8" id="M' + counter + '-end-time"></td></tr>';
//
//    $('#m-table').append(markup);
//
//});
//
//$("#add-row-t").click(function(){
//
//    var counter = $('#t-table tr').length;
//
//    var markup = '<tr><td><input type="text" size = "8" id="T' + counter + '-start-time"></td><td> to </td><td><input type="text" size = "8" id="T' + counter + '-end-time"></td></tr>';
//
//    $('#t-table').append(markup);
//
//});
//
//$("#add-row-w").click(function(){
//
//    var counter = $('#w-table tr').length;
//
//    var markup = '<tr><td><input type="text" size = "8" id="W' + counter + '-start-time"></td><td> to </td><td><input type="text" size = "8" id="W' + counter + '-end-time"></td></tr>';
//
//    $('#w-table').append(markup);
//
//});
//
//$("#add-row-r").click(function(){
//
//    var counter = $('#r-table tr').length;
//
//    var markup = '<tr><td><input type="text" size = "8" id="R' + counter + '-start-time"></td><td> to </td><td><input type="text" size = "8" id="R' + counter + '-end-time"></td></tr>';
//
//    $('#r-table').append(markup);
//
//});
//
//$("#add-row-f").click(function(){
//
//    var counter = $('#f-table tr').length;
//
//    var markup = '<tr><td><input type="text" size = "8" id="F' + counter + '-start-time"></td><td> to </td><td><input type="text" size = "8" id="F' + counter + '-end-time"></td></tr>';
//
//    $('#f-table').append(markup);
//
//});

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
    $(".classcheck").each(function() { 
        if ($(this).is(":checked"))
        {
            var course = $(this).val();
            $.post("server.php", { query: "add-course", course: course }, function(data) {
            alert(data);});
        } else {    
            // Remove $(this).val() from the database
            // var course = $(this).val();
            // $.post("server.php", { query: "remove-course", course: course }, function(data) {
            //alert(data);});
        }

    });
}


function queryAddTime(){
    var days = ["M", "T", "W", "R", "F"];
    
    for(var i = 0 ; i < 5 ; i++)
    {
        
        var t_hours = "8:00";
        var t_start = "";
        var t_end = "";
        var highlighted = false;
        var k = i + 1;
        
        $("#availability-table tr td:nth-child(" + k +")").each(function () {
            
            if ($(this).hasClass('highlighted'))
            {
                
                if(highlighted == false)
                {
                highlighted = true;
                t_start = t_hours;
                }
            }
            else
            {
                if (highlighted == true)
                {
                    highlighted = false;
                    t_end = t_hours;
                    alert("Free from " + t_start + " to " + t_end + " on " + days[i]);
                    $.post("server.php", { query: "add-time", day: days[i], t_start: t_start, t_end: t_end }, function(data) {
                    alert(data);
                    });
                }   
            }
            t_hours = add15totime(t_hours);
        });
        
        if (highlighted == true)
        {
            t_end = t_hours;
            alert("Free from " + t_start + " to " + t_end + " on " + days[i]);
            $.post("server.php", { query: "add-time", day: days[i], t_start: t_start, t_end: t_end }, function(data) {
            alert(data);
            });
        }
    }
}

function add15totime(str){
    var time = str;
    var hours = Number(time.match(/^(\d+)/)[1]);
    var minutes = Number(time.match(/:(\d+)/)[1]);
    minutes += 15;
    var sminutes = minutes.toString();
    if (sminutes == "60")
        {
            sminutes = "00";
            hours++;     
        }
    
    var shours = hours.toString();
    return(shours + ":" + sminutes);
}

//function queryAddTime()
//{
//    for (i = 1; i < $('#m-table tr').length; i++) { 
//        var t_start = $('#M' + i + '-start-time').val();
//        var t_end = $('#M' + i + '-end-time').val();
//        if (t_start != "" && t_end != "" )
//            {
//        t_start = ConvertTimeformat(t_start);
//        t_end = ConvertTimeformat(t_end);
//                
//        $.post("server.php", { query: "add-time", day: "M", t_start: t_start, t_end: t_end }, function(data) {
//        alert(data);
//        });
//            }
//    }
//    
//    for (i = 1; i < $('#t-table tr').length; i++) { 
//        var t_start = $('#T' + i + '-start-time').val();
//        var t_end = $('#T' + i + '-end-time').val();
//        t_start = ConvertTimeformat(t_start);
//        t_end = ConvertTimeformat(t_end);
//        $.post("server.php", { query: "add-time", day: "T", t_start: t_start, t_end: t_end }, function(data) {
//        alert(data);
//        });
//    }
//    
//    for (i = 1; i < $('#w-table tr').length; i++) { 
//        var t_start = $('#W' + i + '-start-time').val();
//        var t_end = $('#W' + i + '-end-time').val();
//        t_start = ConvertTimeformat(t_start);
//        t_end = ConvertTimeformat(t_end);
//        $.post("server.php", { query: "add-time", day: "W", t_start: t_start, t_end: t_end }, function(data) {
//        alert(data);
//        });
//    }
//        
//    for (i = 1; i < $('#r-table tr').length; i++) { 
//        var t_start = $('#R' + i + '-start-time').val();
//        var t_end = $('#R' + i + '-end-time').val();
//        t_start = ConvertTimeformat(t_start);
//        t_end = ConvertTimeformat(t_end);
//        $.post("server.php", { query: "add-time", day: "R", t_start: t_start, t_end: t_end }, function(data) {
//        alert(data);
//        });
//    }
//    
//    for (i = 1; i < $('#f-table tr').length; i++) { 
//        var t_start = $('#F' + i + '-start-time').val();
//        var t_end = $('#F' + i + '-end-time').val();
//        t_start = ConvertTimeformat(t_start);
//        t_end = ConvertTimeformat(t_end);
//        $.post("server.php", { query: "add-time", day: "F", t_start: t_start, t_end: t_end }, function(data) {
//        alert(data);
//        });
//    }
//}
//
//function ConvertTimeformat(str) {
//    var time = str;
//    var hours = Number(time.match(/^(\d+)/)[1]);
//    var minutes = Number(time.match(/:(\d+)/)[1]);
//    var AMPM = time.match(/\s(.*)$/)[1];
//    if (AMPM == "PM" && hours < 12) hours = hours + 12;
//    if (AMPM == "AM" && hours == 12) hours = hours - 12;
//    var sHours = hours.toString();
//    var sMinutes = minutes.toString();
//    if (hours < 10) sHours = "0" + sHours;
//    if (minutes < 10) sMinutes = "0" + sMinutes;
//    return(sHours + ":" + sMinutes);
//}

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
    
    // Create table dragging functionality
          var isMouseDown = false;
          var highlighted
          $("table#availability-table td.selectable")
            .mousedown(function () {
              isMouseDown = true;
              highlighted = $(this).hasClass('highlighted')

              if ( highlighted ) {
                $(this).removeClass('highlighted')
              } else {
                $(this).addClass('highlighted')
              }
              return false; // prevent text selection
            })
            .mouseover(function () {
              if (isMouseDown) {
                if ( highlighted ) {
                  $(this).removeClass('highlighted')
                } else {
                  $(this).addClass('highlighted')
                }
              }
            })
            .bind("selectstart", function () {
              return false; // prevent text selection in IE
            })

          $(document)
              .mouseup(function () {
              isMouseDown = false
          })
});