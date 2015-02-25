/**
 * Created by gopi on 2/17/15.
 */

Template.contact.created = function() {

    Session.set('fbErrors', {});

}

Template.contact.helpers(
    {
        errorMessage: function(field) {
            return Session.get('fbErrors')[field];
        },
        errorClass: function (field) {
            return !!Session.get('fbErrors')[field] ? 'has-error' : '';
        }
    }
);


Template.contact.events(
    {
        'submit form': function(e) {
            e.preventDefault();
            var fb = {
                name: $(e.currentTarget).find('#name').val(),
                suggestion: $(e.currentTarget).find('#suggestion').val()
            };

            var errors = validateFb(fb);
            if (errors.name || errors.suggestion)
                return Session.set('fbErrors', errors);


            Meteor.call('fbInsert', fb, function(error, result) {
                // display the error to the user and abort
                if (error)
                    return throwError(error.reason);


                Router.go('home');
            });
        } });