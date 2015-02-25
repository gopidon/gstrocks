/**
 * Created by gopi on 11/27/14.
 */


Template.dpostSubmit.created = function() {

    Session.set('dpostSubmitErrors', {});

}

Template.dpostSubmit.rendered = function(){

    $('#content').summernote({height: 300});
}

Template.dpostSubmit.helpers(
    {
        errorMessage: function(field) {
            return Session.get('dpostSubmitErrors')[field];
        },
        errorClass: function (field) {
            return !!Session.get('dpostSubmitErrors')[field] ? 'has-error' : '';
        }
    }
);

Template.dpostSubmit.events(
    {
        'submit form': function(e) {
            e.preventDefault();
            var post = {
                title: $(e.currentTarget).find('#title').val(),
                content: $(e.currentTarget).find('#content').val()
            };

            var errors = validateDPost(post);
            if (errors.title || errors.content)
                return Session.set('dpostSubmitErrors', errors);


             Meteor.call('dpostInsert', post, function(error, result) {
             // display the error to the user and abort
                if (error)
                    return throwError(error.reason);


                Router.go('newDPosts');
            });
} });


