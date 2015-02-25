/**
 * Created by gopi on 11/27/14.
 */


Template.dpostPage.helpers(
    {

        dcomments: function() {
            console.log(this._id);
                return DComments.find({dpostId: this._id});
        }
    });