/**
 * Created by gopi on 1/8/15.
 */
Template.commentItem.helpers(
    {
        submittedText: function() {
            return this.submitted.toString();
        },
        ownComment: function() {
            return this.userId === Meteor.userId();
        }
}


);

Template.commentItem.events(
    {

        'click .delete': function(e) {
            e.preventDefault();
            if (confirm("Delete this comment?")) {
                var currentCommentId = this._id;
                Meteor.call('commentDelete', currentCommentId, function(error) {
                    // display the error to the user and abort
                    if (error)
                    {
                        logger.warn("Error deleteing Comment: " + error)
                        throwError(error.reason);
                    }

                });

            } }



    });