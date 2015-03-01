/**
 * Created by gopi on 11/27/14.
 */
Template.postItem.helpers(
    {
        ownPost: function() {
            return this.userId === Meteor.userId();
        }
});

Template.postItem.rendered= function(){

};

Template.postItem.events(
    {
        'click #delPost': function(e) {

            e.preventDefault();
            var currentPostId = $("#delPostModalId").val();
            Meteor.call('postDelete', currentPostId, function(error) {
                $('#delPostModal').modal("hide");
                // display the error to the user and abort
                if (error) {
                    logger.error(error);
                    throwError(error.reason);
                }
            });


        }
        ,'click #postDelButton': function(e) {
            e.preventDefault();
            $("#delPostModalBody").text("Delete the post "+this.title+ "?");
            $("#delPostModalId").val(this._id);
            $('#delPostModal').modal("show");
        }






    });