/**
 * Created by gopi on 11/25/14.
 */

Template.signup.created = function() {

    Session.set('signUpErrors', {});

}

Template.signup.helpers(
    {
        errorMessage: function(field) {
            return Session.get('signUpErrors')[field];
        },
        errorClass: function (field) {
            return !!Session.get('signUpErrors')[field] ? 'has-error' : '';
        }
    }
);



Template.signup.events({
    'submit #signUpForm': function(e, t) {
        e.preventDefault();

        var signUpForm = $(e.currentTarget),
            email = trimInput(signUpForm.find('#signUpEmail').val().toLowerCase()),
            password = signUpForm.find('#signUpPassword').val(),
            passwordConfirm = signUpForm.find('#signUpPasswordConfirm').val();

        var signup ={
            email: email,
            password: password,
            passwordConfirm: passwordConfirm
        }

        var errors = validateSignUp(signup);
        if (errors.email || errors.password || errors.passwordConfirm)
            return Session.set('signUpErrors', errors);

        if (isNotEmpty(email) && isNotEmpty(password) && isEmail(email) && areValidPasswords(password, passwordConfirm)) {

            Accounts.createUser({email: email, password: password}, function(err) {
                if (err) {
                    if (err.message === 'Email already exists. [403]') {
                        throwError('We are sorry but this email is already used.');
                    } else {
                        throwError('We are sorry but something went wrong. Try again!');
                    }
                } else {
                    //console.log('Congrats, you\'re in!');
                    Router.go('home');
                }
            });

        }
        return false;
    }
});


validateSignUp = function (signup)
{
    var errors = {};



    if(!isEmail(signup.email)){
        errors.email = "Please enter a valid email address."
    }

    if(!isValidPassword(signup.password)){
        errors.password = 'Your password should be 6 characters or longer.';
    }

    if(!areValidPasswords(signup.password, signup.passwordConfirm)){
        errors.passwordConfirm = 'Your two passwords are not equivalent.';
    }

    return errors;
}