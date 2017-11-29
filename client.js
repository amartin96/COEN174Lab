const SUCCESS = 0;
const SERVER_ERROR = 1;
const INVALID_LOGIN = 2;
const INVALID_ARGS = 3;

// bind event handlers
$("#login-submit").click(login);
$("#login-admin-submit").click(loginAdmin);
$("#test-submit").click(querySearch);
$("#save-all").click(saveAllInfo);
$("#test-modify-submit").click(queryModifyInfo);
$("#add-course-submit").click(queryAddCourses);
$("#test-save-time").click(queryAddTime);
$("#go-to-admin-login").click(gotoAdminLogin);
$("#go-to-ta-login").click(gotoTALogin);
$("#go-to-info").click(gotoInfo);
$("#go-to-query").click(gotoQuery);
$("#test-clear-data").click(queryClearData);
$("#test-password-submit").click(queryChangePassword);
$("#admin-password-submit").click(adminChangePassword);
$("#test-admin-list").click(queryListUsers);
$("#TA-list-clear").click(ClearUsers);
$("#test-admin-add").click(queryAddUser);
$("#test-admin-remove").click(queryRemoveUser);
$("#test-admin-logout").click(logout);
$("#test-logout").click(logout);
$("#change-password").click(gotoChangePassword);
$("#admin-change-password").click(gotoChangeAdminPassword);
$("#go-to-manage-TAs").click(gotoManageTAs);

$('#login-username, #login-password').keypress(function (e) {
  var key = e.which;
  if(key == 13)  // the enter key code
   {
       login();
   }
});

$('#login-admin-username, #login-admin-password').keypress(function (e) {
  var key = e.which;
  if(key == 13)  // the enter key code
   {
       loginAdmin();
   }
});

// login for TAs
function login()
{
    var uname = $("#login-username").val();
    var pword = $("#login-password").val();
    $.post("login.php", { username: uname, password: pword, type: "user" }, function(data) {
        data = JSON.parse(data);
        if (data.status === SUCCESS) {
            //alert("login successful");
            $("#login").hide();
            $("#whole-page").show();
            $("#main-content").show();
            $("#header").show();
            $("#test").show();
            gotoQuery();
            populateContactInfo();
            populateCourses();
            populateAvailability();
        } else {
            alert("Incorrect User ID or Password");
        }
    });
}

// login for Admins
function loginAdmin()
{
    var uname = $("#login-admin-username").val();
    var pword = $("#login-admin-password").val();
    $.post("login.php", { username: uname, password: pword, type: "admin" }, function(data) {
        data = JSON.parse(data);
        if (data.status === SUCCESS) {
            $("#admin-login").hide();
            $("#whole-page").show();
            $("#admin-header").show();
            $("#admin-main").show();
            queryListUsers();
        } else {
            alert("Incorrect Username or Password");
        }
    });
}

// Populate user contact info upon login 
function populateContactInfo()
{
    $.post("server.php", { query: "get-info" }, function(data) {
    data = JSON.parse(data);
    if (data.status === SUCCESS) {
        $("#test-modify-fname").val(data.result.fname);
        $("#test-modify-lname").val(data.result.lname);
        $("#test-modify-email").val(data.result.email);
        $("#test-modify-phone").val(data.result.phone);
        $("#studentid").val(data.result.id);
    } else {
        alert("get-info failed, status " + data.status);
    }
    });
}

// Populate user course eligibilty info upon login 
function populateCourses()
{
    $.post("server.php", { query: "get-courses" }, function(data) {
        var data = JSON.parse(data);

        $(".classcheck").each(function() {

            var checked = false;

            for(var i = 0 ; i < data.result.length ; i++)
            {
                if ($(this).val() == data.result[i])
                {
                    $(this).prop('checked', true);
                    checked = true;
                    break;
                }
            }
            if(!checked)
            {
                $(this).prop('checked', false);
            }

        });

    });
}

// Populate user availability upon login 
function populateAvailability(){
    $.post("server.php", { query: "get-availability" }, function(data) {
    var data = JSON.parse(data);
    var days = ["M", "T", "W", "R", "F"];

    for(var i = 0 ; i < 5 ; i++)
    {
        var t_hours = "08:00:00";
        var t_start = "";
        var t_end = "";
        var highlighted = false;
        var k = i + 1;

        $("#availability-table tr td:nth-child(" + k +")").each(function () {
                if(highlighted == true)
                {
                    $(this).addClass('highlighted');
                }
                else
                {
                    $(this).removeClass('highlighted');
                }


                for(var j = 0 ; j < data.result.length ; j++)
                {
                    if ((data.result[j].day == days[i]) && (data.result[j].t_start == t_hours))
                    {
                        $(this).addClass('highlighted');
                        highlighted = true;
                        break;
                    }
                    if ((data.result[j].day == days[i]) && (data.result[j].t_end == t_hours))
                    {
                        highlighted = false;
                        $(this).removeClass('highlighted');
                    }
                }
            t_hours = add15totime(t_hours);
            var time = t_hours;
            if (Number(time.match(/^(\d+)/)[1]) < 10)
            {
                t_hours = "0" + t_hours;
            }
        });
    }

    var checked = false;

    for(var i = 0 ; i < data.result.length ; i++)
    {
        if ($(this).val() == data.result[i])
        {
            $(this).prop('checked', true);
            checked = true;
            break;
        }
    }
        if(!checked)
        {
            $(this).prop('checked', false);
        }

    });
}

// Switch to admin login page
function gotoAdminLogin(){
    $("#login").hide();
    $("#admin-login").show();
}

// Switch to TA login page
function gotoTALogin(){
    $("#admin-login").hide();
    $("#login").show();
}

// Switch to TA contact info page
function gotoInfo(){
    $("#test").hide();
    $("#changepassword").hide();
    $("#query-li").removeClass('active');
    $("#info-li").addClass('active');
    $("#TAinfo").show();
}

// Switch to TA query page
function gotoQuery(){
    $("#TAinfo").hide();
    $("#changepassword").hide();
    $("#query-li").addClass('active');
    $("#info-li").removeClass('active');
    $("#test").show();
}

// Switch to TA change password
function gotoChangePassword(){
    $("#TAinfo").hide();
    $("#test").hide();
    $("#info-li").removeClass('active');
    $("#query-li").removeClass('active');
    $("#changepassword").show();
}

// Switch to admin change password
function gotoChangeAdminPassword(){
    $("#manage-TAs").hide();
    $("#admin-li").removeClass('active');
    $("#adminchangepassword").show();
}

// Switch to main admin page
function gotoManageTAs(){
    $("#adminchangepassword").hide();
    $("#admin-li").addClass('active');
    $("#manage-TAs").show();
}

// Search for available TAs and tabulate
function querySearch()
{
    $("#available-TAs").hide();
    var course = $("#test-course").val();
    var day = $("#test-day").val();
    var t_start = $("#test-t_start").val();
    var t_end = $("#test-t_end").val();

    var t_start_is_valid = /^((1[0-2]|0?[1-9]):([0-5][0-9])\s?([AaPp][Mm]))$/.test(t_start);
    var t_end_is_valid = /^((1[0-2]|0?[1-9]):([0-5][0-9])\s?([AaPp][Mm]))$/.test(t_end);

    var invalid = false;

    if (course == "")
    {
        alert("Please select a course");
        invalid = true;
    }

    if (day == "")
    {
        alert("Please select a day");
        invalid = true;
    }

    if (t_start == "")
    {
        alert("Please enter a start time");
        invalid = true;
    }

    if (t_end == "")
    {
        alert("Please enter an end time");
        invalid = true;
    }

    if (!(t_start_is_valid) && (t_start != ""))
    {
        alert('"' + t_start + '" is not a valid time. Make sure to enter time in HH:MM AM/PM format');
        invalid = true;
    }

    if (!(t_end_is_valid) && (t_end != ""))
    {
        alert('"' + t_end + '" is not a valid time. Make sure to enter time in HH:MM AM/PM format');
        invalid = true;
    }

    if (invalid)
    {
         return;
    }

    t_start = ConvertTimeformat(t_start);
    t_end = ConvertTimeformat(t_end);

    if (t_start > t_end)
    {
        alert("Invalid start and end times. Classes don't go backwards in time"); 
        return;
    }
    
    $.post("server.php", { query: "search", course: course, day: day, t_start: t_start, t_end: t_end }, function(data) {
        var data = JSON.parse(data);

            if (data.length > 0)
            {
                $("#available-TAs").show();
                $("#TA-availability-list").html("");
                var markup = "";
                for(var i = 0; i < data.length ; i++)
                    {
                    markup = '<table style="width:100%; margin-top: 15px; margin-bottom: 20px"><tr><td style="width:33%;">' + data[i].fname + ' ' + data[i].lname +'</td><td style="width:33%;">' + data[i].email +'</td><td style="width:33%;">' + data[i].phone +'</td></tr></table><hr/>';
                    $('#TA-availability-list').append(markup);
                    }
            }
            else
            {
                alert("No available TAs found");
            }
    });
}

// Save all contact information, course availabilty, and availabilty
function saveAllInfo(){
    queryModifyInfo();
    window.setTimeout(queryAddCourses, 250);
    window.setTimeout(queryAddTime, 250);
}

// Save all contact information for a user
function queryModifyInfo()
{
    var fname = $("#test-modify-fname").val();
    var lname = $("#test-modify-lname").val();
    var email = $("#test-modify-email").val();
    var phone = $("#test-modify-phone").val();

    var fname_is_valid = /^[a-zA-Z ]+$/.test(fname);
    var lname_is_valid = /^[a-zA-Z ]+$/.test(lname);
    var phone_is_valid = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phone);

    var invalid = false;

    if (!(fname_is_valid) || (fname == ""))
    {
        alert("Please enter a valid first name");
        invalid = true;
    }

    if (!(lname_is_valid) || (lname == ""))
    {
        alert("Please enter a valid last name");
        invalid = true;
    }

    if (!(phone_is_valid) && (phone != ""))
    {
        alert("Please enter a valid 10 digit phone number");
        invalid = true;
    }
    else
    {
        phone = phone.replace(/^\(?(\d{3})\)?[-. ]?(\d{3})[-. ]?(\d{4})$/, "$1-$2-$3");
        alert(phone);
    }


    if (email.toUpperCase().indexOf('@SCU.EDU') <= -1)
    {
        alert("Please enter a valid SCU email");
        invalid = true;
    }

    if(invalid)
    {
        return;
    }

    $.ajax({
        type: "POST",
        url: "server.php",
        data: { query: "modify-info", fname: fname, lname: lname, email: email, phone: phone },
        success: function(data) {
            var data = JSON.parse(data);
            if (data.status === SUCCESS) {
                alert("Contact information saved");
            }
        },
        async:false
    });
}

// Save all course eligibility for a user
function queryAddCourses()
{
    $.ajax({
        type: "POST",
        url: "server.php",
        data: { query: "clear-courses" },
        success: function(data) { },
        async:false
    });

    var check = SUCCESS;

    $(".classcheck").each(function() {
        var course = $(this).val();
        if ($(this).is(":checked"))
        {
            $.post("server.php", { query: "add-course", course: course }, function(data) {
                var data = JSON.parse(data);
                check += data.status;
            });
        }
    });

    if (check === SUCCESS) {
        alert("Qualified courses saved");
    }
}

// Save all availability for a user    
function queryAddTime(){

    $.ajax({
        type: "POST",
        url: "server.php",
        data: { query: "clear-availability" },
        success: function(data) {},
        async:false
    });

    var days = ["M", "T", "W", "R", "F"];
    var check = SUCCESS;

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

                    $.post("server.php", { query: "add-time", day: days[i], t_start: t_start, t_end: t_end }, function(data) {
                        var data = JSON.parse(data);
                        check += data.status;
                    });
                }
            }
            t_hours = add15totime(t_hours);
        });

        if (highlighted == true)
        {
            t_end = t_hours;

            $.post("server.php", { query: "add-time", day: days[i], t_start: t_start, t_end: t_end }, function(data) {
                var data = JSON.parse(data);
                check += data.status;
            });
        }
    }

    if (check === SUCCESS) {
        alert("Availability saved");
    }
}

// Helper function for availability to increment time 
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
    return(shours + ":" + sminutes + ":00");
}

// Helper function to convert AM/PM format to 24 hour format     
function ConvertTimeformat(str) {
    var time = str;
    var hours = Number(time.match(/^(\d+)/)[1]);
    var minutes = Number(time.match(/:(\d+)/)[1]);
    var AMPM = time.match(/\s(.*)$/)[1];
    if ((AMPM == "PM" || AMPM == "pm") && hours < 12) hours = hours + 12;
    if ((AMPM == "AM" || AMPM == "am") && hours == 12) hours = hours - 12;
    var sHours = hours.toString();
    var sMinutes = minutes.toString();
    if (hours < 10) sHours = "0" + sHours;
    if (minutes < 10) sMinutes = "0" + sMinutes;
    return(sHours + ":" + sMinutes);
}

// Clear all availability   
function queryClearData()
{
    $.post("server.php", { query: "clear-availability" }, function(data) {
    });

    $("#availability-table tr td").each(function () {
        $(this).removeClass('highlighted')
    });

}

// Change password for TA user 
function queryChangePassword()
{
    var password = $("#test-password").val();
    var repeat = $("#test-password-repeat").val();
    
    if (password == "" || repeat == "")
    {
       alert("Please enter a password");
        return;
    }
    
    if (password == repeat)
    {
        $.post("server.php", { query: "change-password", password: password }, function(data) {
            var data = JSON.parse(data);
            if (data.status === SUCCESS) {
                alert("Password saved successfully");
            }
        });
    } else{
        alert("Passwords don't match");
    }
}

// Change password for admin
function adminChangePassword()
{
    var password = $("#admin-password").val();
    var repeat = $("#admin-password-repeat").val();
    
    if (password == "" || repeat == "")
    {
       alert("Please enter a password");
        return;
    }
    
    if (password == repeat)
    {
        $.post("server_admin.php", { query: "change-password", password: password }, function(data) {
            alert(data);
            var data = JSON.parse(data);
            if (data.status === SUCCESS) {
                alert("Password saved successfully");
            }
        });
    } else{
        alert("Passwords don't match");
    }
}

// Get current list of TAs and tabulate
function queryListUsers()
{
    $.post("server_admin.php", { query: "list-users" }, function(data) {

        $("#TA-list").html("");
        var data = JSON.parse(data);
        if (data.result.length > 0)
        {
            var markup = "";
            for(var i = 0; i < data.result.length ; i++)
                {
                     
                  var fname = data.result[i].fname;
                  var lname = data.result[i].lname;
                  var email = data.result[i].email;
                  var phone = data.result[i].phone;
                  
                  if (fname == null)
                  {
                    fname = "First";        
                  }                   
                    
                  if (lname == null)
                  {
                    lname = "Last";        
                  }
                
                  if (email == null)
                  {
                    email = "Email";        
                  }
                
                  if (phone == null)
                  {
                    phone = "Phone";        
                  }
                
                  markup = '<table style=\"width:100%; margin-top: 15px; margin-bottom: 20px\">';
                  markup += '<tr>';
                  markup += '<td style=\"text-align: left; width:10%;\"><div class="TA-id">' + data.result[i].id + '</div></td>';
                  markup += '<td style=\"width:22%;\">' + fname + ' ' + lname + '</td>';
                  markup += '<td style=\"width:26%;\">' + email +'</td>';
                  markup += '<td style=\"width:27%;\">' + phone + '</td>';
                  markup += '<td \" style=\"width:15%;\"><button class ="remove-ta" id=\"' + data.result[i].id + '\" style="margin-top: 15px; float: right" onclick="javascript:queryRemoveUser(' + data.result[i].id + ');">Delete</button> </td>';
                  markup += '</tr>';
                  markup += '</table><hr/>';
                  $('#TA-list').append(markup);
                }
        }
    });

}

// Add eligible TA for admin
function queryAddUser()
{
    var id = $("#test-admin-id").val();
    $.post("server_admin.php", { query: "add-user", id: id }, function(data) {
        
        var data = JSON.parse(data);
        
        if(data.status == SUCCESS){
        
          alert("Student ID " + id + " has been added to the list of qualified TAs");
          queryListUsers();
        }
        else if (data.status == SERVER_ERROR)
        {
           alert("ID " + id + " has already been added");
        }
    });
}

// Remove eligible TA for admin
function queryRemoveUser(id)
{
    if (confirm("Are you sure you want to remove ID " + id + "?") == true) 
    {
        $.post("server_admin.php", { query: "remove-user", id: id }, function(data) {
            var data = JSON.parse(data);
            if(data.status == SUCCESS){
              alert("ID: " + id + " has been removed from the list of qualified TAs");
              //var element = document.getElementById("test-admin-id");
              //element.index = "";
              queryListUsers();
            }
        });
    }
}

// Remove all eligible TAs for admin
function ClearUsers()
{
    if (confirm("Are you sure you want to clear TA list?") == true) 
    {
        $("#TA-list").html("");
        $.post("server_admin.php", { query: "list-users" }, function(data) {
            var data = JSON.parse(data);
            for(var i = 0; i < data.result.length ; i++)
                {
                    $.ajax({
                        type: "POST",
                        url: "server_admin.php",
                        data: { query: "remove-user", id: data.result[i].id },
                        success: function(data) {},
                        async:false
                    });
                }
        });
    }
}

// Logout
function logout()
{
    $.post("logout.php", function(data) {
        data = JSON.parse(data);
        if (data.status === SERVER_ERROR) {
            alert(data.message);
        }
    });
    location.reload();
    document.getElementById('query-form').reset();

}

// this runs when the webpage is finished loading
$(function() {
    // hide all divs other than login
    $("#test").hide();
    $("#admin-main").hide();
    $("#admin-header").hide();
    $("#main-content").hide();
    $("#query").hide();
    $("#availableTA").hide();
    $("#TAinfo").hide();
    $("#ClassCheckboxList").hide();
    $("#Admin").hide();
    $("#admin-login").hide();
    $("#header").hide();
    $("#TAinfo").hide();
    $("#whole-page").hide();
    $("#available-TAs").hide();
    $("#changepassword").hide();
    $("#adminchangepassword").hide();
    
    $('#starttimepicker').datetimepicker({
        format: 'LT'
    });
    
    $('#endtimepicker').datetimepicker({
        format: 'LT'
    });  

    // Create availability table dragging functionality
          var isMouseDown = false;
          var highlighted;
          $("table#availability-table td.selectable")
            .mousedown(function () {
              isMouseDown = true;
              highlighted = $(this).hasClass('highlighted');

              if ( highlighted ) {
                $(this).removeClass('highlighted');
              } else {
                $(this).addClass('highlighted');
              }
              return false; // prevent text selection
            })
            .mouseover(function () {
              if (isMouseDown) {
                if ( highlighted ) {
                  $(this).removeClass('highlighted');
                } else {
                  $(this).addClass('highlighted');
                }
              }
            })
            .bind("selectstart", function () {
              return false; // prevent text selection in IE
            })

          $(document)
              .mouseup(function () {
              isMouseDown = false;
          })
});
