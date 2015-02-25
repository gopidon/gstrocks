/**
 * Created by gopi on 11/27/14.
 */


Template.postSubmit.created = function() {

    Session.set('postSubmitErrors', {});

}

Template.postSubmit.rendered = function(){

    $('#content').summernote({height: 300});
}

Template.postSubmit.helpers(
    {
        errorMessage: function(field) {
            return Session.get('postSubmitErrors')[field];
        },
        errorClass: function (field) {
            return !!Session.get('postSubmitErrors')[field] ? 'has-error' : '';
        }
    }
);

Template.postSubmit.events(
    {
        'submit form': function(e) {
            e.preventDefault();
            var post = {
                title: $(e.currentTarget).find('#title').val(),
                content: $(e.currentTarget).find('#content').val(),
                visible: !($(e.currentTarget).find('#invisible')[0]['checked'])
            };


            var errors = validatePost(post);
            if (errors.title || errors.content)
                return Session.set('postSubmitErrors', errors);


             Meteor.call('postInsert', post, function(error, result) {
             // display the error to the user and abort
                if (error)
                    return throwError(error.reason);


                Router.go('newPosts');
            });
} });


