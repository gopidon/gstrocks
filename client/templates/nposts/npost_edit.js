/**
 * Created by gopi on 11/27/14.
 */
Template.npostEdit.created = function() {
    Session.set('npostEditErrors', {});
}

Template.npostEdit.rendered = function(){

    $('#content').summernote({height: 300});
}


Template.npostEdit.helpers(
    {
        errorMessage: function(field) {
            return Session.get('npostEditErrors')[field];
        },
        errorClass: function (field) {
            return !!Session.get('npostEditErrors')[field] ? 'has-error' : '';
        }
    }
);

Template.npostEdit.events({ 'submit form': function(e) {
    e.preventDefault();
    var currentNPostId = this._id;
    var npostProperties = {
        title: $(e.target).find('[name=title]').val(),
        content: $(e.target).find('[name=content]').val()
    }

    var errors = validateNPost(npostProperties);
    if (errors.title || errors.content) {

        return Session.set('npostEditErrors', errors);
    }

    Meteor.call("npostUpdate",currentNPostId, npostProperties, function(error)
    {
        if (error) {
            // display the error to the user
            throwError(error.reason);
        } else {
            Router.go('newNPosts');
        }
    });
},
    'click .delete': function(e) {
        e.preventDefault();
        if (confirm("Delete this post?")) {
            var currentNPostId = this._id;
            Meteor.call('npostDelete', currentNPostId, function(error) {
                // display the error to the user and abort
                if (error)
                    throwError(error.reason);
                else
                    Router.go('newNPosts');
            });

        } }
});