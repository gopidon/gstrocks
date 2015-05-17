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
        'click #postDelButton': function(e) {
            e.preventDefault();
            $("#delPostModalBody").text("Delete the post "+this.title+ "?");
            $("#delPostModalId").val(this._id);
            $('#delPostModal').modal("show");
        }






    });