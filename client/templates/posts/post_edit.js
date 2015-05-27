/**
 * Created by gopi on 11/27/14.
 */
Template.postEdit.created = function() {
    Session.set('postEditErrors', {});
}

Template.postEdit.rendered = function(){

    $('#content').summernote({height: 300});
}


Template.postEdit.helpers(
    {
        errorMessage: function(field) {
            return Session.get('postEditErrors')[field];
        },
        errorClass: function (field) {
            return !!Session.get('postEditErrors')[field] ? 'has-error' : '';
        },
        invisible: function(){
            return !this.visible;
        }
    }
);

Template.postEdit.events({
    'submit form': function(e) {
        e.preventDefault();
        var currentPostId = this._id;
        var postProperties = {
            title: $(e.target).find('[name=title]').val(),
            content: $(e.target).find('[name=content]').val(),
            visible: !($(e.currentTarget).find('#invisible')[0]['checked'])
        }

        var errors = validatePost(postProperties);
        if (errors.title || errors.content) {

            return Session.set('postEditErrors', errors);
        }

        Posts.update(currentPostId, {$set: postProperties}, function(error)
        {
            if (error) {
                // display the error to the user
                throwError(error.reason);
            } else {
                Router.go('newPosts');
            }
        });
    },
    'click .delete': function(e) {
        e.preventDefault();
        if (confirm("Delete this post?")) {
            var currentPostId = this._id;
            Posts.remove(currentPostId);
            Router.go('newPosts');
        } }
});