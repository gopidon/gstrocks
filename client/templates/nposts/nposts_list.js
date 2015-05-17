/**
 * Created by gopi on 11/27/14.
 */
Template.npostsList.events({
    "keyup #searchNewsPost": _.throttle(function(e) {
        var text = $(e.target).val().trim();
        Router.go('newNPosts',{'npostsLimit':5,'npostsSearch':text});
    }, 200),

    'click #delNPost': function(e) {
        e.preventDefault();
        var currentNPostId = $("#delNPostModalId").val();

        Meteor.call('npostDelete', currentNPostId, function(error) {
            $('#delNPostModal').modal("hide");
            // display the error to the user and abort
            if (error) {
                logger.error(error);
                throwError(error.reason);
            }

        });


    }
});