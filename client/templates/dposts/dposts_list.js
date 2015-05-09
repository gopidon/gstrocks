/**
 * Created by gopi on 11/27/14.
 */

Template.dpostsList.events({
    "keyup #searchDiscussPost": _.throttle(function(e) {
        var text = $(e.target).val().trim();
        Router.go('newDPosts',{'dpostsLimit':5,'dpostsSearch':text});
    }, 200),

    'click #loginLink': function(e) {
        e.preventDefault();
        $('#loginModal').modal("show");
    },
    'click #dPostDelButton': function(e) {
        e.preventDefault();
        $("#delDPostModalBody").text("Delete the post "+this.title+ "?");
        $("#delDPostModalId").val(this._id);
        $('#dPostDelModal').modal("show");
    },
    'click #delDPost': function(e) {
        e.preventDefault();


        var currentDPostId = $("#delDPostModalId").val();
        Meteor.call('dpostDelete', currentDPostId, function(error) {
            $('#dPostDelModal').modal("hide");
            // display the error to the user and abort
            if (error)
                throwError(error.reason);

        });


    }
});
