$(document).ready(function () {

    var strength = "";

    $('#password').focusin(function () {
        $('#submit-message').hide();
    })
    $('#password').keyup(function () {
        var number = /([0-9])/;
        var alphabets = /([a-zA-Z])/;
        var special_characters = /([~,!,@,#,$,%,^,&,*,-,_,+,=,?,>,<])/;

        $('#password-strength-message').show();

        if ($('#password').val().length == 0) {
            strength = "";
            $('#password-strength-message').hide();
        }

        if ($('#password').val().length < 6) {
            $('#password-strength-message').removeClass();
            $('#password-strength-message').addClass('weak-password');
            $('#password-strength-message').html("Weak (should be at least 6 characters.)");
            strength = "weak";
        } else {
            if ($('#password').val().match(number) && $('#password').val().match(alphabets) && $('#password').val().match(special_characters)) {
                $('#password-strength-message').removeClass();
                $('#password-strength-message').addClass('strong-password');
                $('#password-strength-message').html("Strong");
                strength = "strong";
            } else {
                $('#password-strength-message').removeClass();
                $('#password-strength-message').addClass('medium-password');
                $('#password-strength-message').html("Medium (should include alphabets, numbers and special characters.)");
                strength = "medium";
            }
        }
    });

    $("#submit").click(function () {
        if (strength == "strong"){
            return true;
        } else{
            $('#submit-message').show();
            $('#submit-message').removeClass();
            $('#submit-message').addClass('weak-password');
            $('#submit-message').html("Password should be strong to sign up!");
            return false;
        }
    })


});
