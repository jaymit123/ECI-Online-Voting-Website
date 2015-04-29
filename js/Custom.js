$(document).ready(function () {

    $.post('Login', "username=&password=", giveLoginResponse);
    var l = Ladda.create(document.querySelector('.SignUpButton')); //SignUp Button Spinner
    var m = Ladda.create(document.querySelector('.LogInButton')); //Log In Button Spinner
    $('#AccountDetailsContent').hide();
    var checkStatus = true;


//Reset Form on Close
    $('.modal-footer').on("click", '#RegModalClose', function () {
        $('#RegForm')[0].reset();
        $('#msg').html("");
        l.stop();
        $('#SignUpStatus').html("Sign Up");
    });

    $('#RegisterModal').on('hidden.bs.modal', function () {
        $('#RegForm')[0].reset();
        $('#msg').html("");
        l.stop();
        $('#SignUpStatus').html("Sign Up");
    });
    $('#RegForm').submit(function (e) {
        var pattern = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+/-])[a-zA-Z0-9!@#$%^&*()_+/-]{8,}$/;
        var firstname = $('#firstname').val();
        var lastname = $('#lastname').val();
        var username = $('#usernamereg').val();
        var password = $('#passwordreg').val();
        var repassword = $('#repassword').val();
        var state = $('#stateinfo').val();
        var isCorrect = pattern.test(password);
        $('#msg').html("");
        if (firstname === '' || lastname === '' || username === '' || password === '' || repassword === '' || state === 'none') {
            $('#msg').html("<br><br>Error : All Field are Mandatory.<br>Please Enter Details in all fields.");
            return false;
        } else if (username.length < 6) {
            $('#msg').html("<br><br>Error :Incorrect Username Format!<br>Username Length : 6");
            return false;
        } else if (isCorrect === false) {
            $('#msg').html("<br><br><center>Error: Incorrect Password Format!<br>Length :Min 8 <br>Including 1 No + 1 Special Char</center>");
            return false;
        } else if (!(password === repassword)) {
            $('#msg').html("<br><br>Error:These Passwords don't match.<br>Try Again?");
            return false;
        } else if ($("#tnc").prop('checked') === false) {
            $('#msg').html("<br><br><center>Error:Check the Terms & Conditions<br></center>");
            return false;
        } else {
            e.preventDefault();
            l.start();
            $('#SignUpStatus').html("Please Wait");
            $('#msg').html("<br><br>Please do not exit this Window!");

            var regData = $('#RegForm').serialize();
            $.post('Register', regData, giveRegResponse);
            return false;
        }
    });
 function giveRegResponse(data) {
        if (data.STATUS === 'SUCCESS') {
            $('#msg').html("<br><br>Registered Successfully!<br><br>Redirecting in 3 Sec");
            m.start();
            setTimeout(function (e) {
                $.post('Login', "username=&password=", giveLoginResponse);
                $('#RegisterModal').modal('hide');
            }, 3000);
        } else if (data.STATUS === 'FAILURE') {
            $('#msg').html("<br><br>Username already Exist!");
            $('#SignUpStatus').html("Login");

            l.stop();
        }
    }

//Register Form End

    $('#AboveLoginForm #LogInButton').on("click", function (e) {
        if (checkStatus === true) {
            var username = $('#username').val();
            var password = $('#password').val();
            var pattern = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+/-])[a-zA-Z0-9!@#$%^&*()_+/-]{8,}$/;
            var isCorrect = pattern.test(password);
            $('#iderror').html("");
            $('#paserror').html("");
            if (username === '') {
                $('#iderror').html("<b>Username Required!</b>");
                return false;
            } else if (username.length < 6) {
                $('#iderror').html("<b>Invalid Username</b>");
                return false;
            } else if (password === '') {
                $('#paserror').html("<b>Password Required!</b>.");
                return false;
            } else if (isCorrect === false) {
                $('#paserror').html("<b>Invalid Password.</b>");
                return false;
            } else {
                e.preventDefault();
    $('#LogInStatus').html("Please Wait");
                m.start();
               
                var formData = $('#LoginForm').serialize();

                $.post('Login', formData, giveLoginResponse);

                return false;
            }
        } else if (checkStatus === false) {
            e.preventDefault();
            checkStatus = true;
            m.start();
            $.post('Logout', "", giveLogoutResponse);
            return false;
        }
    });

    function giveLoginResponse(data) {
      
        if (data.Authentication === 'PASS') {
            checkStatus = false;
           
            $('#LoginForm')[0].reset();
            $('#LoginForm').hide();
            $('#RegisterButton').html("Account");
            $('#LoginHeader').html(data.Username + " <span class=caret></span>");
            setTimeout(function () {
                m.stop();
            }, 1000);
            $('#LogInStatus').html("Log Out");
            $('#RegisterFormContent').hide();
            $('#AccountDetailsContent').show();
            $('#accusername').html(" " + data.Username);
            $('#accfullname').html(data.Name);
            $('#accstate').html(data.State);
            $('#ProfileData').html("Hello " + data.Username);
        } else if (data.Authentication === 'FAIL') {
            $('#paserror').html("<b>Sorry Username/Password is Incorrect!</b>");
            setTimeout(function () {
                $('#paserror').html("");
            }, 5000);
            setTimeout(function () {
                m.stop();
            }, 1000);
            $('#LogInStatus').html("Log In");
        } else if (data.Authentication === 'LoginCheckFail') {
            m.stop();
            $('#LogInStatus').html("Log In");
        }
    }

    function giveLogoutResponse(data) {
        if (data === 'Successfully Logged Out!')
        {
            $('#ProfileData').html("");
            $('#LoginForm').show();
            $('#LoginForm')[0].reset();
            setTimeout(function () {
                m.stop();
            }, 1000);
            $('#LogInStatus').html("Login");
            $('#LoginHeader').html("Login <span class=caret></span>");
            $('#RegisterButton').html("Register");
            $('#accusername').html("");
            $('#accfullname').html("");
            $('#accstate').html("");
            $('#AccountDetailsContent').hide();
            $('#RegisterFormContent').show();


        }
    }





});
