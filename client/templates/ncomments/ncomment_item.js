/**
 * Created by gopi on 1/8/15.
 */
Template.ncommentItem.helpers(
    {
        submittedText: function() {
            return this.submitted.toString();
        },
        ownComment: function() {
            return this.userId === Meteor.userId();
        }
}


);

Template.ncommentItem.events(
    {

        'click .delete': function(e) {
            e.preventDefault();
            if (confirm("Delete this comment?")) {
                var currentNCommentId = this._id;
                Meteor.call('ncommentDelete', currentNCommentId, function(error) {
                    // display the error to the user and abort
                    if (error)
                        throwError(error.reason);
                });

            } }



    });