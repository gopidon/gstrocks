/**
 * Created by gopi on 11/27/14.
 */
Template.dpostEdit.created = function() {
    Session.set('dpostEditErrors', {});
}

Template.dpostEdit.rendered = function(){

    $('#content').summernote({height: 300});
}


Template.dpostEdit.helpers(
    {
        errorMessage: function(field) {
            return Session.get('dpostEditErrors')[field];
        },
        errorClass: function (field) {
            return !!Session.get('dpostEditErrors')[field] ? 'has-error' : '';
        },
        eOpinion: function(){
            return this.eOpinion;
        }
    }
);

Template.dpostEdit.events({ 'submit form': function(e) {
    e.preventDefault();
    var currentDPostId = this._id;
    var dpostProperties = {
        title: $(e.target).find('[name=title]').val(),
        content: $(e.target).find('[name=content]').val(),
        eOpinion: $(e.currentTarget).find('#eOpinion')[0]['checked']
    }

    var errors = validateDPost(dpostProperties);
    if (errors.title || errors.content) {

        return Session.set('dpostEditErrors', errors);
    }

    Meteor.call("dpostUpdate",currentDPostId, dpostProperties, function(error)
    {
        if (error) {
            // display the error to the user
            throwError(error.reason);
        } else {
            Router.go('newDPosts');
        }
    });
},
    'click .delete': function(e) {
        e.preventDefault();
        if (confirm("Delete this post?")) {
            var currentDPostId = this._id;
            DPosts.remove(currentDPostId);
            Router.go('newDPosts');
        } }
});