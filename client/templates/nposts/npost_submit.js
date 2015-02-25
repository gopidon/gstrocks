/**
 * Created by gopi on 11/27/14.
 */


Template.npostSubmit.created = function() {

    Session.set('npostSubmitErrors', {});

}

Template.npostSubmit.rendered = function(){

    $('#content').summernote({height: 300});
}

Template.npostSubmit.helpers(
    {
        errorMessage: function(field) {
            return Session.get('npostSubmitErrors')[field];
        },
        errorClass: function (field) {
            return !!Session.get('npostSubmitErrors')[field] ? 'has-error' : '';
        }
    }
);

Template.npostSubmit.events(
    {
        'submit form': function(e) {
            e.preventDefault();
            var post = {
                title: $(e.currentTarget).find('#title').val(),
                content: $(e.currentTarget).find('#content').val()
            };

            var errors = validateNPost(post);
            if (errors.title || errors.content)
                return Session.set('npostSubmitErrors', errors);


             Meteor.call('npostInsert', post, function(error, result) {
             // display the error to the user and abort
                if (error)
                    return throwError(error.reason);


                Router.go('newNPosts');
            });
} });


