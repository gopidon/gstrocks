/**
 * Created by gopi on 11/27/14.
 */
Template.npostItem.helpers(
    {
        ownPost: function() {
            return this.userId === Meteor.userId();
        }
});

Template.npostItem.events(
    {
        'click #makeHomeNews': function(e,t) {
            var makeHome = e.target.checked;
            var params = {
                id: this._id,
                makeHome: makeHome
            };
            Meteor.call('makeHomeItem', params, function(error, result) {
                // display the error to the user and abort
                if (error)
                    return throwError(error.reason);
            });
        },



        'click #delNPostButton': function(e) {
            e.preventDefault();
            $("#delNPostModalBody").text("Delete the post "+this.title+ "?");
            $("#delNPostModalId").val(this._id);
            $('#delNPostModal').modal("show");
            /*if (confirm("Delete this post?")) {
                var currentNPostId = this._id;
                Meteor.call('npostDelete', currentNPostId, function(error) {
                    // display the error to the user and abort
                    if (error)
                        throwError(error.reason);
                    else
                        Router.go('newNPosts');
                });

            } */
        }





    });