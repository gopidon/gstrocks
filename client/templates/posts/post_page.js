/**
 * Created by gopi on 11/27/14.
 */


Template.postPage.helpers(
    {

        comments: function() {
                return Comments.find({postId: this._id});
        }
    });


Template.postPage.events(
    {
        'click #loginLink': function(e) {
            e.preventDefault();
            $('#loginModal').modal("show");
        }






    });