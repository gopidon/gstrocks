/**
 * Created by gopi on 11/27/14.
 */
Template.dpostItem.helpers(
    {
        ownPost: function() {
            return this.userId === Meteor.userId();
        },
        upvotedClass: function() {
            var userId = Meteor.userId();
            if (userId && !_.include(this.upvoters, userId)) {
                return 'btn-primary upvotable';
            }
            else {
                return 'disabled';
            }
        }
});


Template.dpostItem.events(
    {
        'click #showOnHome': function(e,t) {
            var showOnHome = e.target.checked;
            var params = {
                id: this._id,
                showOnHome: showOnHome
            };
            Meteor.call('showOnHome', params, function(error, result) {
                // display the error to the user and abort
                if (error)
                    return throwError(error.reason);
            });
        },
        'click .upvote': function(e) {
            e.preventDefault();
            Meteor.call('upvote', this._id);
        }





    });