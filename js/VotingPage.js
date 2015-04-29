$(document).ready(function () {
 $('#successvote').hide();
    $('#alreadyvote').hide();
$('#errorloginvote').hide();
    $.post('Login', "username=&password=", giveLoginResponse);
    var l = Ladda.create(document.querySelector('.SignUpButton')); //SignUp Button Spinner
    var m = Ladda.create(document.querySelector('.LogInButton')); //Log In Button Spinner
    var userString = "null";
    $('#AccountDetailsContent').hide();
    var checkStatus = true;
    var party="null";

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
            $('#msg').html("<br><br><center>Error:>Please Check the Terms & Conditions<br></center>");
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
        userString = "null";
        if (data.Authentication === 'PASS') {
            checkStatus = false;
            userString = data.Username;
            if(data.Vote === 'false'){
            islogged();
            }else if(data.Vote === 'true'){
            hasVoted();
            }
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
            notlogged();
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
            notlogged();
        }
    }

    function giveLogoutResponse(data) {
        if (data === 'Successfully Logged Out!')
        {
            notlogged();
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
    function notlogged() {
        $('#successvote').hide();
        $('#alreadyvote').hide();
        $('#errorloginvote').show();      
        $('#aapvote').prop('disabled', true);
        $('#bjpvote').prop('disabled', true);
        $('#congrvote').prop('disabled', true);
    }

    function islogged() {
        $('#successvote').hide();
        $('#errorloginvote').hide();
        $('#aapvote').prop('disabled', false);
        $('#bjpvote').prop('disabled', false);
        $('#congrvote').prop('disabled', false);
    }
   
  function hasVoted(){
$('#errorloginvote').hide()
$('#successvote').hide();
$('#alreadyvote').show();
$('#aapvote').prop('disabled', true);
$('#bjpvote').prop('disabled', true);
$('#congrvote').prop('disabled', true);
}



    $('#aapvote').on("click", function (e) {
        $('#partyselect').html("<th colspan=2><strong><center>Aam Aadmi Party</center></strong></th>");
        $('#partyimg').attr("src", "images/aap.jpg");
        $('#votingusername').html(userString);
        party = "aap";
        $('#VotingModal').modal('show');
    });


    $('#bjpvote').on("click", function (e) {
        $('#partyselect').html("<th colspan=2><strong><center>Bhartiya Janta Party</center></strong></th>");
        $('#partyimg').attr("src", "images/bjp.jpg");
        $('#votingusername').html(userString);
        party = "bjp";
        $('#VotingModal').modal('show');
    });


    $('#congrvote').on("click", function (e) {
        $('#partyselect').html("<th colspan=2><strong><center>Indian National Congress</center></strong></th>");
        $('#partyimg').attr("src", "images/congress.png");
        $('#votingusername').html(userString);
        party = "inc";
        $('#VotingModal').modal('show');
    });

$('#VoteModalConfirm').on("click", function () {
       var pattern = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+/-])[a-zA-Z0-9!@#$%^&*()_+/-]{8,}$/;
       var password = $('#votepassverify').val();
        var isCorrect = pattern.test(password);
        if(password === ''){
$('#votepasserror').html("Please Enter a Password");
}else if(isCorrect === false){
$('#votepasserror').html("Invalid Password");
}else{
$.post('Voting',"username="+userString+"&password="+password+"&party="+party, giveVotingResponse);
}

    });

function giveVotingResponse(data){

if(data.VOTE === 'SUCCESS'){
$('#votepasserror').html("SUCCESS! Your Vote has been Casted!<br>Redirecting in 5 Sec.");
VoteSuccess();
setTimeout(function(){$('#VotingModal').modal('hide');},5000);
}else if(data.VOTE === 'FAILED'){
$('#votepasserror').html("Incorrect Password!");
}
}


    $('#VoteModalClose').on("click", function () {
        $('#VoteModalConfirm').prop('disabled',false);
        $('#partyselect').html("");
        $('#partyimg').attr("src", "");
         $('#votepasserror').html("");
        $('#votepassverify').val('');
party="null";

    });
function VoteSuccess(){
$('#VoteModalConfirm').prop('disabled',true);
$('#successvote').show();
$('#aapvote').prop('disabled', true);
$('#bjpvote').prop('disabled', true);
$('#congrvote').prop('disabled', true);

}
    $('#VotingModal').on('hidden.bs.modal', function () {
        $('#VoteModalConfirm').prop('disabled',false);
        $('#partyselect').html("");
        $('#partyimg').attr("src", "");
       $('#votepasserror').html("");
       $('#votepassverify').val('');
       party="null";
    });



});