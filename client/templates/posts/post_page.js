/**
 * Created by gopi on 11/27/14.
 */


Template.postPage.helpers(
    {

        comments: function() {
            //console.log(this._id);
                return Comments.find({postId: this._id});
        }
    });