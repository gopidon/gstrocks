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
    /*$('#delPostModal').on('shown.bs.modal', function (event) {
        console.log("here1");
        var button = $(event.relatedTarget) // Button that triggered the modal

        var recipient = button.data('post-id') // Extract info from data-* attributes
        console.log("Recepient", recipient);
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var modal = $(this)
        modal.find('#delPostModalBody').text('New message to ');
        modal.find('#delPostModalId').val(recipient)
    })*/
}

Template.postItem.events(
    {
        'click #delPost': function(e) {

            e.preventDefault();
            var currentPostId = $("#delPostModalId").val();
            Meteor.call('postDelete', currentPostId, function(error) {
                $('#delPostModal').modal("hide");
                // display the error to the user and abort
                if (error) {
                    //console.log(error);
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