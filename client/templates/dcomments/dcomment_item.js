/**
 * Created by gopi on 1/8/15.
 */
Template.dcommentItem.helpers(
    {
        submittedText: function() {
            return moment(this.submitted).format('DD-MMM-YYYY, hh:mm a');
        },
        ownComment: function() {
            return this.userId === Meteor.userId();
        }
}


);



Template.dcommentItem.events(
    {

        'click .delete': function(e) {
            e.preventDefault();
            if (confirm("Delete this comment?")) {
                var currentDCommentId = this._id;
                Meteor.call('dcommentDelete', currentDCommentId, function(error) {
                    // display the error to the user and abort
                    if (error)
                    {
                        logger.warn("Error deleteing dComment: " + error)
                        throwError(error.reason);
                    }

                });

            } }



    });