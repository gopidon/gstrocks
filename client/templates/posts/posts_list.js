/**
 * Created by gopi on 11/27/14.
 */
Template.postsList.events({
    "keyup #searchPost": _.throttle(function(e) {
        var text = $(e.target).val().trim();
        Router.go('newPosts',{'postsLimit':5,'postsSearch':text});
    }, 200),
    'click #delPost': function(e) {

        e.preventDefault();
        var currentPostId = $("#delPostModalId").val();
        Meteor.call('postDelete', currentPostId, function(error) {
            $('#delPostModal').modal("hide");
            // display the error to the user and abort
            if (error) {
                throwError(error.reason);
            }
        });


    }
});