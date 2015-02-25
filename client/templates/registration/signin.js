/**
 * Created by gopi on 11/25/14.
 */
Template.signin.events({
    'submit #signInForm': function(e, t) {
        e.preventDefault();

        var signInForm = $(e.currentTarget),
            email = trimInput(signInForm.find('#signInEmail').val().toLowerCase()),
            password = signInForm.find('#signInPassword').val();

       // if (isNotEmpty(email) && isEmail(email) && isNotEmpty(password) && isValidPassword(password)) {

            Meteor.loginWithPassword(email, password, function(err) {
                if (err) {

                    return throwError('Login credentials are not valid.');
                } else {
                    //throwError('Login Successful!');
                }
            });

       // }
        // return false;
    }
});