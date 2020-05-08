$(document).ready(function () {

    var strength = "";

    var email = $("#email");
    var emailMessage = $("#email-message");
    var signUpPassword = $('#signup-password');
    var signInPassword = $("#signin-password");
    var passwordMessage = $('#password-message');
    var submit = $("#submit");
    var submitMessage = $('#submit-message');
    var emailOk = $("#email-ok");
    var passwordOk = $("#password-ok");
    var passwordRequirementMessage = "Minimum Password length is 6 and it should include alphabets, numbers and special characters";

    emailOk.hide();
    passwordOk.hide();

    signUpPassword.focusin(function () {
        submitMessage.hide();
    });

    signInPassword.focusin(function () {
        passwordMessage.hide();
    });

    email.focusin(function () {
        emailMessage.hide();
    });

    signUpPassword.blur(function () {
        if (signUpPassword.val().length == 0) {

            passwordOk.hide();
            passwordMessage.show()
                .removeClass()
                .addClass('error')
                .html("Password cannot be empty!");
        }
    });

    signInPassword.blur(function () {
        if (signInPassword.val().length == 0) {

            passwordMessage.show()
                .removeClass()
                .addClass('error')
                .html("Password cannot be empty!");
        }
    });

    signUpPassword.keyup(function () {
        var number = /([0-9])/;
        var alphabets = /([a-zA-Z])/;
        var special_characters = /([~,!,@,#,$,%,^,&,*,-,_,+,=,?,>,<])/;

        passwordMessage.show();

        if (signUpPassword.val().length == 0) {

            passwordOk.hide();
            strength = "";
            passwordMessage.hide();
        }

        if (signUpPassword.val().length < 6) {

            passwordOk.hide();
            passwordMessage.removeClass()
                .addClass('weak-password')
                .html(passwordRequirementMessage);
            strength = "weak";
        } else {
            if (signUpPassword.val().match(number) && signUpPassword.val().match(alphabets) && signUpPassword.val().match(special_characters)) {

                passwordOk.show();
                passwordMessage.hide();
                strength = "strong";
            } else {

                passwordOk.hide();
                passwordMessage.removeClass()
                    .addClass('medium-password')
                    .html(passwordRequirementMessage);
                strength = "medium";
            }
        }
    });

    submit.click(function () {
        if (strength == "strong") {
            return true;
        } else {
            submitMessage.show()
                .removeClass()
                .addClass('error')
                .html("Password should be strong to sign up!");
            return false;
        }
    })

    email.focusin(function () {
        emailMessage.hide();
    })

    email.blur(function () {

        if (email.val().length == 0) {

            emailOk.hide();
            emailMessage.show()
                .removeClass()
                .addClass('error')
                .html("Email cannot be empty!");
        } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.val())) {

            emailOk.hide();
            emailMessage.show()
                .removeClass()
                .addClass('error')
                .html("Please enter a valid email");
        } else {
            var emailValue = email.val();
            $.ajax({
                type: 'POST',
                url: window.location.protocol + '//' + window.location.host + '/user/verification',
                data: {email: emailValue, _csrf : $("#_csrf").val()},

                success: function (data) {
                    if (data == false) {
                        emailMessage.hide();
                        emailOk.show();
                    } else {
                        emailOk.hide();
                        emailMessage.show()
                            .removeClass()
                            .addClass('error')
                            .html("User Email already in use!");
                    }
                },
                error: function (error) {
                    console.log('Error: ' + error);
                }
            });
        }
    });


});
